import React from 'react'
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {Link, withRouter} from "react-router-dom";
import FormDynamic from "../../components/Form/FormDynamic";
import {
    transformProfileQuestionsToApplicationForm,
    transformScholarshipQuestionsToApplicationForm
} from "../Application/ApplicationUtils";

class ScholarshipViewQuestions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            isLoadingScholarship: true
        }
    }

    componentDidMount() {
        const { match : { params : { slug }}} = this.props;

        ScholarshipsAPI
            .getSlug(slug)
            .then(res => {
                const { scholarship } = res.data;
                this.setState({ scholarship });
            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                this.setState({isLoadingScholarship: false});
            })
    }

    render () {
        const { isLoadingScholarship, scholarship } = this.state;

        if (isLoadingScholarship) {
            return (<Loading title={`Loading Form`} className='mt-3' />)
        }


        const userProfileQuestionsFormConfig = transformProfileQuestionsToApplicationForm(scholarship.user_profile_questions);
        const scholarshipQuestionsFormConfig = transformScholarshipQuestionsToApplicationForm(scholarship.specific_questions);

        return (
            <div className="container mt-5">
                <h1>Questions for <Link to={`/scholarship/${scholarship.slug}`}>{scholarship.name}</Link></h1>
                <h5 className="text-center text-muted">Note: None of your responses here are saved.

                    Visit the <Link to={`/scholarship/${scholarship.slug}`}>scholarship page</Link> and click Apply Now to apply</h5>
                <br />
                <h3> User Profile Questions </h3>
                <FormDynamic onUpdateForm={() => {}}
                             model={{}}
                             inputConfigs={userProfileQuestionsFormConfig} />
                <br />
                <h3>Scholarship Questions </h3>
                <FormDynamic onUpdateForm={() => {}}
                             model={{}}
                             inputConfigs={scholarshipQuestionsFormConfig}
                />
            </div>
        )
    }
}

export default withRouter(ScholarshipViewQuestions);