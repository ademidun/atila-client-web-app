import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { searchApplications, findOccurencesOfSearchTerm } from './ApplicationUtils';
import { ApplicationResponseDisplay } from './ApplicationDetail/ApplicationDetailView';


export class ApplicationsSearch extends React.Component {

    constructor(props) {
        super(props);

        const { applications } = props;

        this.state = {
            searchTerm: "",
            allApplications: applications,
            filteredApplications: applications,
        }

        
    }

    onSearch = (event) => {

        // todo should this be taken from state or props?
        const { updateSearch } = this.props 
        const { allApplications } = this.state;
        const searchTerm = event.target.value;
        let filteredApplications;

        if (searchTerm) {
            filteredApplications = searchApplications(allApplications, searchTerm);
        } else {
            filteredApplications = allApplications;
        }

        this.setState({ searchTerm, filteredApplications });

        if (updateSearch) {
            updateSearch(filteredApplications, searchTerm)
        }
    }
    render() {

        const { searchTerm } = this.state;

        return (
            <Input id='email-subject' 
                   className="mb-2"
                   value={searchTerm}
                   allowClear={true}
                   onChange={this.onSearch}
                   onPressEnter={this.onSearch}
                   placeholder="Search applications..."/>
        )
        
    }

}

ApplicationsSearch.propTypes = {
    applications: PropTypes.array.isRequired,
    updateSearch: PropTypes.func,
};
export function ApplicationPreview({ application, searchTerm }){

    const applicationResponses = application.scholarship_responses;
    if (!applicationResponses || Object.values(applicationResponses).length === 0) {
        return null
    }

    let applicationResponse = Object.values(applicationResponses)[0];

    const longAnswerResponses = Object.values(applicationResponses).filter(application => application.type === "long_answer");

    if (longAnswerResponses.length > 0) {
        applicationResponse = longAnswerResponses[0]
    }

    let matchingSnippets;
    // Only start highlighting the text when the search term has 3 characters or more.
    // Otherwise, you would return too many noisy results if you match on just 1 or 2 characters.
    if (searchTerm && searchTerm.length >= 3) {
        matchingSnippets = findOccurencesOfSearchTerm(application, searchTerm);
        matchingSnippets = matchingSnippets.map(snippet => <p key= {snippet.value}>{snippet.html}</p>)
    }

    return (<div>
        Preview ({searchTerm}): 
            <div className="text-muted">
                {
                    matchingSnippets || 
                    <ApplicationResponseDisplay 
                        question={applicationResponse} 
                        responses={{[applicationResponse.key]: applicationResponse.response}} 
                        previewMode={true} />
                }
            </div>
    </div>)
}