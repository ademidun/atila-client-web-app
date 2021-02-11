import React from 'react';
import PropTypes from 'prop-types';

import ContentCard from "./ContentCard";
import Loading from "./Loading";
import {genericItemTransform} from "../services/utils";
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import BlogsApi from "../services/BlogsAPI";
import EssaysApi from "../services/EssaysAPI";

class RelatedItems extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            relatedItems: [],
            isLoadingRelatedItems: false,
            errorLoadingRelatedItems: false,
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

    render () {

        const { relatedItems, isLoadingRelatedItems  } = this.state;
        const { className } = this.props;

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
                <h3 className="text-center">Related</h3>
                {relatedItems.map(item => {
                    item = genericItemTransform(item);
                    return (<ContentCard key={item.slug}
                                         content={item}
                                         className="mb-3" />)
                })}
            </div>
        );
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

