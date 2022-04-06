import React from 'react';
import PropTypes from 'prop-types';

import ContentCard from "./ContentCard";
import Loading from "./Loading";
import { genericItemTransform, getAlogliaIndexName } from "../services/utils";
import Environment from '../services/Environment';
import { useRelatedProducts } from '@algolia/recommend-react';
import recommend from '@algolia/recommend';

const recommendClient = recommend(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);

const RelatedProduct = ({recommendation}) => {
    recommendation = genericItemTransform(recommendation);
    return (
        <ContentCard key={recommendation.slug} content={recommendation} className="mb-3" />
    )
}

const RelatedProducts = ({recommendations}) => {
    return <>
        <h3 className="text-center">Related</h3>
        {recommendations.map(item => (
            <RelatedProduct recommendation={item} key={item.id} />
        ))}
    </>
}

const RelatedItems = (props) => {

    const { recommendations, status } = useRelatedProducts({
        indexName:  getAlogliaIndexName(props.itemType),
        maxRecommendations: 3,
        objectIDs: [props.id.toString()],
        recommendClient: recommendClient
    })

    if (status !== 'idle') {
        return (
            <div className={`${props.className}`}>
                <Loading
                    isLoading={status !== 'idle'}
                    title={'Loading Related Items..'} />
            </div>
        );
    } else {
        return (
            <div className={`${props.className}`}>
                <RelatedProducts recommendations={recommendations} />
            </div>
        )
    }
}

RelatedItems.defaultProps = {
    className: ''
};

RelatedItems.propTypes = {
    className: PropTypes.string,
    itemType: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
};

export default RelatedItems;

