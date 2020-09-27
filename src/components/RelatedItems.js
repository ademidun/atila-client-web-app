import React from 'react';
import PropTypes from 'prop-types';

import ContentCard from "./ContentCard";
import {genericItemTransform} from "../services/utils";
import SearchApi from "../services/SearchAPI";
import Loading from "./Loading";
import ScholarshipsAPI from "../services/ScholarshipsAPI";

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

        const { itemType, id } = this.props;
        this.setState({ isLoadingRelatedItems: true });
        let relatedItemsPromise  = Promise.resolve();
        if (itemType === 'scholarship') {
            relatedItemsPromise = ScholarshipsAPI
                .relatedItems(`${itemType}-${id}`);
            relatedItemsPromise
                .then(res => {
                    let relatedItems = [];
                    if (res.data.results) {
                        relatedItems = res.data.results.slice(0,3);
                    }
                    this.setState({ relatedItems });
                });
        } else {
            relatedItemsPromise = SearchApi.relatedItems(`?type=${itemType}&id=${id}`);
            relatedItemsPromise
                .then(res => {

                    const relatedItems = (res.data.items.map(item => genericItemTransform(item)));
                    this.setState({ relatedItems });
                });
        }
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
        const { className  } = this.props;

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
                {relatedItems.map(item => <ContentCard key={item.slug}
                                                       content={item}
                                                       className="mb-3" />)}
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

