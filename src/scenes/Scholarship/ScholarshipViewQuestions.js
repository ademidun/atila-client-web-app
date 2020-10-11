import React from 'react'
import {connect} from "react-redux";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {Link} from "react-router-dom";
import {questionTypesLabel} from "../Scholarship/ScholarshipQuestionBuilder"

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
                const scholarship = res.data;
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
        const { isLoadingScholarship, scholarship } = this.state

        if (isLoadingScholarship) {
            return (<Loading title={`Loading Form`} className='mt-3' />)
        }

        const scholarshipQuestions = scholarship.specific_questions.map(questionDict =>
            <QuestionTransformer questions={questionDict} />
        )

        return (
            <div className="container mt-5">
                <h1>Application form for <Link to={`/scholarship/${scholarship.slug}`}>{scholarship.name}</Link></h1>
                <br />
                {scholarshipQuestions}
            </div>
        )
    }
}

function QuestionTransformer(props) {
    return (
        <div>
            <h3>Question: {props.questions.question}</h3>
            <h4>Type: {questionTypesLabel[props.questions.type]}</h4>
            <br />
        </div>
    )
}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ScholarshipViewQuestions);