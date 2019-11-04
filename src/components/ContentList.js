import React from 'react';
import PropTypes from 'prop-types';

import Loading from "./Loading";
import ContentCard from "./ContentCard";
import {genericItemTransform} from "../services/utils";
import {Link} from "react-router-dom";
import ResponseDisplay from "./ResponseDisplay";

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
            errorGettingContent,
            pageNumber,
        } = this.state;

        const {
            contentType
        } = this.props;

        let contentList = null;


        if (errorGettingContent) {
            contentList = (
                <div className="text-center container">
                    <h1>
                        Error Getting {contentType}
                        <span role="img" aria-label="sad face emoji">😕</span>
                    </h1>
                    <h3>Please try again later </h3>
                </div>)
        }

        else if (contentItems.length === 0) {
            contentList = (
                <Loading
                    isLoading={isLoadingContent}
                    title={`Loading ${contentType}...`} />);
        }
        else {
            contentList = contentItems.map( content =>
                    <ContentCard key={content.id}
                                 content={genericItemTransform(content)}
                                 className="col-12 mb-3"
                                 hideImage={contentType==='Essays'}
                    />
                );
        }

        const slugifyContent = contentType.substring(0, contentType.length - 1).toLowerCase();

        return (
            <div className="container mt-5">

                <h1 className="text-center center-block">
                    {contentType}
                </h1>
                <div className="col-12 mb-3">
                    <div className="card shadow">
                        <Link to={`/${slugifyContent}/add`} className="btn btn-outline-primary">
                            Add {slugifyContent}
                        </Link>
                    </div>
                </div>
                <div>
                    {contentList}
                </div>
                {
                    contentItems.length < totalContentCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl"
                            onClick={this.loadMoreItems}
                            disabled={isLoadingContent}>
                        Load More
                    </button>
                }

                {
                    contentItems.length >= totalContentCount
                    &&
                    <h4 className="text-center">
                        All Caught up {' '}
                        <span role="img" aria-label="happy face emoji">🙂</span>
                    </h4>
                }
                {pageNumber > 1 &&
                <ResponseDisplay
                    responseError={errorGettingContent}
                    isLoadingResponse={isLoadingContent}
                    loadingTitle={`Loading ${contentType}s...`}
                />
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