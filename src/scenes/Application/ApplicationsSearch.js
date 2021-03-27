import React from 'react';
import PropTypes from 'prop-types';
import { stripHtml } from '../../services/utils';
import { Input } from 'antd';
import { searchApplications, findOccurencesOfSearchTerm } from './ApplicationUtils';


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



    let applicationResponsePreview = Object.values(applicationResponses)[0];
    
    applicationResponsePreview =  applicationResponsePreview.type === "long_answer" ? stripHtml(applicationResponsePreview.response) : applicationResponsePreview.response;
    applicationResponsePreview = applicationResponsePreview.substring(0, 140) + "...";

    if (searchTerm && searchTerm.length > 3) {
        let matcingSnippets = findOccurencesOfSearchTerm(application, searchTerm);
        applicationResponsePreview = matcingSnippets.map(snippet => <p key= {snippet.value}>{snippet.html}</p>)
    }

    return (<div>
        Preview ({searchTerm}): 
            <div className="text-muted">
            {applicationResponsePreview}
            </div>
    </div>)
}