import React from 'react';
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {Link} from "react-router-dom";
import moment from "moment";
import {formatCurrency} from "../../services/utils";
import Loading from "../../components/Loading";
import RelatedItems from "../../components/RelatedItems";

class ScholarshipDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            isLoadingScholarship: true,
        }
    }

    loadContent = () => {

        const { match : { params : { slug }} } = this.props;
        ScholarshipsAPI.getSlug(slug)
            .then(res => {
                this.setState({ scholarship: res.data });

            })
            .catch(err => {
                console.log({ err});
            })
            .finally(() => {
                this.setState({ isLoadingScholarship: false });
            });
    };
    componentDidMount() {
        this.loadContent();
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.loadContent();
    }
    goBack = (event) => {
        event.preventDefault();
        this.props.history.goBack();
    };
    render() {

        const { isLoadingScholarship, scholarship } = this.state;
        if (!scholarship) {
            return (
                <Loading
                    isLoading={isLoadingScholarship}
                    title={'Loading Scholarships..'} />)
        }
        const { id, name, description, deadline, funding_amount, slug, img_url, criteria_info, scholarship_url, application_form_url } = scholarship;

        const deadlineString = moment(deadline).format('MMMM DD, YYYY');
        const fundingString = formatCurrency(Number.parseInt(funding_amount), true);

        return (
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="content-detail">{name}</h1>
                            <img
                                style={{ maxHeight: '300px', width: 'auto'}}
                                src={img_url}
                                className="center-block"
                                alt={name} />
                        </div>

                        <div className="row">
                            <div className="col-md-8">
                                {scholarship_url &&
                                <React.Fragment>
                                    <a href={scholarship_url} target="_blank" rel="noopener noreferrer">
                                        Visit Scholarship Website
                                    </a> <br/>
                                </React.Fragment>}
                                {application_form_url &&
                                <React.Fragment>
                                    <a href={application_form_url} target="_blank" rel="noopener noreferrer">
                                        View Scholarship Application
                                    </a> <br/>
                                </React.Fragment>}
                                <Link to={`/scholarship/edit/${slug}`}>
                                    Edit Scholarship
                                </Link>
                                <br/>
                                <button onClick={this.goBack} className="btn btn-link pl-0">
                                    Go Back ←
                                </button>
                                <p>
                                    <small className="text-muted">
                                        Deadline: { deadlineString }
                                    </small>
                                </p>
                                <p>
                                    <small className="text-muted">
                                        Amount: {fundingString}
                                    </small>
                                </p>
                                <p>{description}</p>

                                {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                                <div className="content-detail" dangerouslySetInnerHTML={{__html: criteria_info}} />
                            </div>
                            <RelatedItems
                                className="col-md-4"
                                id={id}
                                itemType={'scholarship'} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ScholarshipDetail;