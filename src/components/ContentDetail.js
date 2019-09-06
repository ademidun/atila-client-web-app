import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import {BlogPropType} from "../models/Blog";
import {EssayPropType} from "../models/Essay";
import './ContentDetail.scss';

class ContentDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: null,
            blogs: [],
            searchPayload: {
                location: { city :'', province :'', country :'', name :''},
                education_level :[],
                education_field :[],
                searchString: '' ,
                previewMode: 'universalSearch' ,
                filter_by_user_show_eligible_only: true,
                sort_by: 'relevance'
            },
            errorGettingBlogs: null,
            isLoadingBLogs: false,
            pageNumber: 1,
        }
    }


    render () {

        const { className, content} = this.props;

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
    content: PropTypes.oneOfType([BlogPropType, EssayPropType]).isRequired
};

export default ContentDetail;