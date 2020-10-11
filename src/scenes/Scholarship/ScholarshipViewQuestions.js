import React from 'react'
import {connect} from "react-redux";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {Link} from "react-router-dom";

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

        const ScholarshipQuestions = scholarship.specific_questions.map(questionDict =>
            <QuestionTransformer questionDict={questionDict} />
        )

        return (
            <div className="container mt-5">
                <h1>Application form for <Link to={`/scholarship/${scholarship.slug}`}>{scholarship.name}</Link></h1>
                {ScholarshipQuestions}
            </div>
        )
    }
}

function QuestionTransformer(questionDict) {
    console.log(questionDict)
    return (
        <div>
            <h3>Question: {questionDict.question}</h3>
            <h4>Type: {questionDict.type}</h4>
        </div>
    )
}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ScholarshipViewQuestions);