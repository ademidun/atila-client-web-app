import {genericItemTransform, prettifyKeys} from "../../services/utils";
import ContentCard from "../../components/ContentCard";
import React from "react";
import Scholarship from "../Scholarship/Scholarship";
import ScholarshipCard from "../Scholarship/ScholarshipCard";

export function SearchResultsDisplay({searchResults, searchResultsMetadata}) {

    return (
        <div>
            {['scholarships', 'blogPosts', 'essays'].map(contentType => (
                <div key={contentType} className="col-12 mb-2 card shadow">
                    <h1>{contentType === 'blogPosts' ? 'Blogs' : prettifyKeys(contentType)}</h1>
                    {
                        searchResults && searchResults[contentType] &&
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
                </div>
            ))}
        </div>
    )
}