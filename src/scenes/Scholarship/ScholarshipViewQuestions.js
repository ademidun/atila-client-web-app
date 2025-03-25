import React, { useState, useEffect } from 'react'
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import { Link, useParams } from "react-router-dom";
import FormDynamic from "../../components/Form/FormDynamic";
import {
    transformProfileQuestionsToApplicationForm,
    transformScholarshipQuestionsToApplicationForm
} from "../Application/ApplicationUtils";
import ApplicationWordCountExplainer from '../Application/ApplicationWordCountExplainer';

function ScholarshipViewQuestions() {
    const { slug } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [isLoadingScholarship, setIsLoadingScholarship] = useState(true);

    useEffect(() => {
        ScholarshipsAPI
            .getSlug(slug)
            .then(res => {
                const { scholarship } = res.data;
                setScholarship(scholarship);
            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                setIsLoadingScholarship(false);
            })
    }, [slug]);

    if (isLoadingScholarship) {
        return (<Loading title={`Loading Form`} className='mt-3' />)
    }

    const userProfileQuestionsFormConfig = transformProfileQuestionsToApplicationForm(scholarship.user_profile_questions)
        .map(formConfig => ({
            ...formConfig,
            disabled: true,
        }));
    const scholarshipQuestionsFormConfig = transformScholarshipQuestionsToApplicationForm(scholarship.specific_questions)
        .map(formConfig => ({
            ...formConfig,
            disabled: true,
        }));
    const notSavingResponsesReminder = (
        <React.Fragment>
            <h5 className="text-center text-muted">Note: None of your responses here are saved.
            Visit the <Link to={`/scholarship/${scholarship.slug}`}>scholarship page</Link>{' '} 
            and click Apply Now to apply.</h5>
        </React.Fragment>
    );

    return (
        <div className="container mt-5">
            <h1>Questions for <Link to={`/scholarship/${scholarship.slug}`}>{scholarship.name}</Link></h1>
            {notSavingResponsesReminder}
            <br />
            <h3> User Profile Questions </h3>
            <FormDynamic onUpdateForm={() => {}}
                         model={{}}
                         inputConfigs={userProfileQuestionsFormConfig} />
            <br />
            <h3>Scholarship Questions </h3>
            <ApplicationWordCountExplainer />
            <FormDynamic onUpdateForm={() => {}}
                         model={{}}
                         inputConfigs={scholarshipQuestionsFormConfig}
            /><br/>
            {notSavingResponsesReminder}
        </div>
    )
}

export default ScholarshipViewQuestions;
