import React from 'react';
import PropTypes from 'prop-types';

import ContentCard from "./ContentCard";
import {genericItemTransform} from "../services/utils";
import SearchApi from "../services/SearchAPI";
import EssayDetail from "../scenes/Essay/EssayDetail";

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

        SearchApi.relatedItems(`?type=${itemType}&id=${id}`)
            .then(res => {
                console.log({ res });
                this.setState({ relatedItems: res.data.items });
            })
            .catch(err => {
                console.log({ err});
            })
            .finally(() => {
                this.setState({ isLoadingRelatedItems: false });
            });
    }

    render () {

        const { relatedItems  } = this.state;
        const { className  } = this.props;

        if (!relatedItems) {
            return null;
        }
        return (
            <div className={`${className}`}>
                <h3 className="text-center">Related</h3>
                {relatedItems.map(item => <ContentCard key={item.id}
                                                       content={genericItemTransform(item)}
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
