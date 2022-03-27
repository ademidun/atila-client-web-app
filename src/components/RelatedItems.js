import React from 'react';
import PropTypes from 'prop-types';

import ContentCard from "./ContentCard";
import Loading from "./Loading";
import {genericItemTransform} from "../services/utils";
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import BlogsApi from "../services/BlogsAPI";
import EssaysApi from "../services/EssaysAPI";
import Environment from '../services/Environment';
import { RelatedProducts } from '@algolia/recommend-react';
import recommend from '@algolia/recommend';

const recommendClient = recommend(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);
const scholarshipIndexName = Environment.ALGOLIA_SCHOLARSHIP_INDEX;
const blogIndexName = Environment.ALGOLIA_BLOG_INDEX;

const RelatedItem = ({item}) => {
    console.log({item})
    item = genericItemTransform(item);
    return (
            <ContentCard key={item.slug} content={item} className="mb-3" />
    )
}

const ListView = (props) => {
  return (
      <>
          {props.items.map(item => (
            <props.itemComponent item={item} key={item.id}/>
          ))}
      </>
  );
}

const HeaderComponent = () => {
    return <h3 className="text-center">Related</h3>
}

const FallBackComponent = () => {
    return <p>No related content found</p>
}


class RelatedItems extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            relatedItems: [],
            isLoadingRelatedItems: false,
            errorLoadingRelatedItems: false,
            id: props.id.toString(),
        }
    }

    componentDidMount() {

        const { id, itemType } = this.props;
        this.setState({ isLoadingRelatedItems: true });

        let ContentAPI;
        switch (itemType) {
            case "scholarship":
                ContentAPI = ScholarshipsAPI;
                break;
            case "blog":
                ContentAPI = BlogsApi;
                break;
            case "essay":
                ContentAPI = EssaysApi;
                break;
            default:
                ContentAPI = ScholarshipsAPI;
                break;
        }

        let relatedItemsPromise;
        relatedItemsPromise = ContentAPI
            .relatedItems(`${id}`)
            .then(res => {
                let relatedItems = [];
                if (res.data.results) {
                    relatedItems = res.data.results.slice(0,3);
                }
                this.setState({ relatedItems });
            });

        relatedItemsPromise
            .catch(err => {
                console.log({ err});
            })
            .finally(() => {
                this.setState({ isLoadingRelatedItems: false });
            });
    }

    getAlogliaIndexName(itemType) {
        let indexName = '';
        switch (itemType) {
            case "scholarship":
                indexName = scholarshipIndexName
                break;
            case "blog":
                indexName = blogIndexName;
                break;
            default:
                break;
        }

        return indexName;
    }

    render () {

        const { isLoadingRelatedItems, id } = this.state;
        const { className, itemType } = this.props;

        if (isLoadingRelatedItems) {
            return (
                <div className={`${className}`}>
                    <Loading
                        isLoading={isLoadingRelatedItems}
                        title={'Loading Related Items..'} />
                </div>);
        }

        return (
            <div className={`${className}`}>
                <RelatedProducts
                    objectIDs={[id]}
                    recommendClient={recommendClient}
                    indexName={this.getAlogliaIndexName(itemType)}
                    itemComponent={RelatedItem}
                    view={ListView}
                    headerComponent={HeaderComponent}
                    fallbackComponent={FallBackComponent}
                    maxRecommendations={3}
                 />
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

