import React from 'react';
import PropTypes from 'prop-types';

import Loading from "./Loading";
import ContentCard from "./ContentCard";
import {genericItemTransform} from "../services/utils";

class ContentList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: null,
            contentItems: [],
            errorGettingContent: null,
            isLoadingContent: false,
            totalContentCount: 0,
            pageNumber: 1,
        }
    }

    loadMoreItems = () => {
        const { pageNumber } = this.state;

        this.setState({ pageNumber: pageNumber + 1 }, () => {
            this.loadItems(this.state.pageNumber);
        })
    };

    loadItems = (page) => {

        const { contentItems, totalContentCount } = this.state;
        const { ContentAPI } = this.props;

        if (totalContentCount && contentItems.length >= totalContentCount) {
            return
        }

        this.setState({ isLoadingContent: true });

        ContentAPI.list(page)
            .then(res => {

                const contentResults = contentItems;
                contentResults.push(...res.data.results);
                this.setState({ totalContentCount: res.data.count });

                if (contentResults) {
                    this.setState({ contentItems: contentResults });
                }

            })
            .catch(err => {
                console.log({ err});
                this.setState({errorGettingContent : err });
            })
            .finally(() => {
                this.setState({ isLoadingContent: false });
            });
    };

    componentDidMount() {
        this.loadItems();
    }

    render () {

        const {
            contentItems,
            isLoadingContent,
            totalContentCount,
            errorGettingContent
        } = this.state;

        const {
            contentType
        } = this.props;

        if (errorGettingContent) {
            return (
                <div className="text-center container">
                    <h1>
                        Error Getting {contentType}
                        <span role="img" aria-label="sad face emoji">😕</span>
                    </h1>
                    <h3>Please try again later </h3>
                </div>)
        }

        if (contentItems.length === 0) {
            return (
                <Loading
                    isLoading={isLoadingContent}
                    title={`Loading ${contentType}...`} />);
        }

        return (
            <div className="container m-5 row">

                <h1 className="text-center">
                    {contentType}
                </h1>

                <div>
                    {contentItems.map( content =>
                        <ContentCard key={content.id} content={genericItemTransform(content)} className="col-12 mb-3"
                                     hideImage={contentType==='Essays'}
                        />

                        )}
                </div>
                {
                    contentItems.length < totalContentCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl" onClick={this.loadMoreItems}>
                        Load More
                    </button>
                }
            </div>
        );
    }
}
ContentList.defaultProps = {
    className: ''
};

ContentList.propTypes = {
    className: PropTypes.string,
    contentType: PropTypes.string.isRequired,
    ContentAPI: PropTypes.func.isRequired,
};

export default ContentList;