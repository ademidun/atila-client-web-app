import {genericItemTransform, prettifyKeys} from "../../services/utils";
import ContentCard from "../../components/ContentCard";
import React from "react";
import ScholarshipCard from "../Scholarship/ScholarshipCard";
import {Link} from "react-router-dom";

export function SearchResultsDisplay({searchResults, searchResultsMetadata}) {

    const {metadata} = searchResults;
    return (
        <div>
            {['scholarships', 'blogPosts', 'essays'].map(contentType => (
                <div key={contentType} className="col-12 mb-2 card shadow">
                    <h1>{contentType === 'blogPosts' ? 'Blogs' : prettifyKeys(contentType)}</h1>
                    {
                        searchResults[contentType] &&
                        searchResults[contentType].map(content =>{

                            if(contentType === 'scholarships') {
                                return <ScholarshipCard scholarship={content}
                                                        key={`${contentType}-${content.id}`}/>
                            } else {
                                return <ContentCard content={genericItemTransform(content)}
                                                    key={`${contentType}-${content.id}`} className="mb-2"/>
                            }
                        })
                    }
                    <div>
                        {metadata[contentType] && metadata[contentType]['omit_results'] &&
                        <Link to="/register" className="btn btn-primary center-block font-size-xl my-3">
                            Register for free to see all {metadata[contentType]['total_results_count']}
                            {' '}
                            {contentType === 'blogPosts' ? 'Blogs' : prettifyKeys(contentType)}
                        </Link>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}