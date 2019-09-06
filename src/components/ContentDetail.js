import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import './ContentDetail.scss';
import Loading from "./Loading";

class ContentDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: null,
            errorGettingContent: null,
            isLoadingContent: false,
        }
    }

    componentDidMount() {

        const { ContentAPI, contentSlug } = this.props;
        
        this.setState({isLoadingContent: true});
        ContentAPI.getSlug(`${contentSlug}`)
            .then(res => {
                
                if (res.data.blog) {
                    this.setState({content: res.data.blog});
                }
                else if( res.data.essay) {
                    this.setState({content: res.data.essay});
                }

            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingContent: false});
            });
    }
    
    render () {

        const { className} = this.props;
        const { isLoadingContent, content } = this.state;

        if (isLoadingContent) {
            return (<Loading
                isLoading={isLoadingContent}
                title={'Loading...'} />)
        }

        if (!content) {
            return null;
        }

        const { title, body, header_image_url, user } = content;

        return (
            <div className={`${className} content-detail mt-5`}>
                <h1>{title}</h1>
                {header_image_url &&
                <img src={header_image_url}
                     alt={title}
                     style={{ maxWidth: '100%' }}
                />}


                <div className="bg-light my-3 p-1">
                    <Link to={`/profile/${user.username}`} >
                        <img
                            alt="user profile"
                            style={{ height: '50px', maxWidth: 'auto' }}
                            className="rounded-circle py-1 pr-1"
                            src={user.profile_pic_url} />
                        {user.first_name} {user.last_name}
                    </Link>
                </div>
                {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                <div dangerouslySetInnerHTML={{__html: body}} />
            </div>
        );
    }
}
ContentDetail.defaultProps = {
    className: ''
};

ContentDetail.propTypes = {
    className: PropTypes.string,
    ContentAPI: PropTypes.func.isRequired,
    contentSlug: PropTypes.string.isRequired,
};

export default ContentDetail;