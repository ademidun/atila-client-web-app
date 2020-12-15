import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

import {Button, Input, Steps} from "antd";
import UserProfileAPI from "../../services/UserProfileAPI";
import PaymentSend from "../Payment/PaymentSend/PaymentSend";
import {ScholarshipPropType} from "../../models/Scholarship";
import {UserProfilePropType} from "../../models/UserProfile";

const { Step } = Steps;


let scholarshipContributionPages = [
    {
        title: 'Amount',
    },
    {
        title: 'Name',
    },
    {
        title: 'Email',
    },
    {
        title: 'Payment',
    },
    {
        title: 'Complete',
    },
];

class ScholarshipContribution extends React.Component {
    constructor(props) {
        super(props);

        const { userProfile } = props;
        const defaultContributor = {
            first_name: "",
            last_name: "",
            funding_amount: "",
            email: "",
            user: null,
            is_anonymous:false,
        };

        // pre-fill the contributor information with the logged in user profile details
        if (userProfile) {
            Object.keys(defaultContributor).forEach(defaultContributorKey => {
                if ( userProfile[defaultContributorKey]) {
                    defaultContributor[defaultContributorKey] = userProfile[defaultContributorKey];
                }
            });
        }

        this.state = {
            scholarship: null,
            scholarshipOwner: null,
            isLoadingScholarship: true,
            pageNumber: 1,
            contributor: defaultContributor,
            invalidInput: !defaultContributor.funding_amount,
        }
    }

    componentDidMount() {
        const { match : { params : { slug }}} = this.props;

        ScholarshipsAPI
            .getSlug(slug)
            .then(res => {
                const { scholarship } = res.data;
                this.setState({ scholarship });

                // TODO, scholarship serializer should return the userprofile information inside scholarship.owner
                // instead of only returning the userprofile PK.

                UserProfileAPI.get(scholarship.owner)
                    .then(res => {
                        this.setState({ scholarshipOwner: res.data });
                    })
            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                this.setState({isLoadingScholarship: false});
            })
    };

    changePage = (pageNumber) => {
        this.setState({pageNumber});
    };

    updateContributorInfo = (event) => {
        if (event.preventDefault) {
            event.preventDefault();
        }

        let { contributor } = this.state;
        let invalidInput = null;
        let value = event.target.value;

        if (event.target.name === "funding_amount") {
            value = Number.parseInt(value)
        }

        contributor = {
            ...contributor,
            [event.target.name]: value
        };
        if (contributor && contributor.funding_amount < 50) {
            invalidInput = "Minimum contribution amount is $50.";
        }

        this.setState({ contributor, invalidInput });
    };

    contributeAnonymously = () => {

        let { contributor } = this.state;

        contributor = {
            ...contributor,
            is_anonymous: true,
            first_name: "",
            last_name: "",
        };
        this.setState({ contributor });

    };

    submitScholarshipContributor = (event) => {
        // TODO implement some logic that should happen after a scholarship has been funded
        console.log({event});
    };

    render () {
        const { isLoadingScholarship, scholarship, pageNumber, contributor,scholarshipOwner, invalidInput } = this.state;

        const scholarshipSteps = (<Steps current={pageNumber-1} onChange={(current) => this.changePage(current+1)}>
            { scholarshipContributionPages.map(item => (
                <Step key={item.title} title={item.title} />
            ))}
        </Steps>);

        if (isLoadingScholarship) {
            return (<Loading title={`Loading Form`} className='mt-3' />)
        }

        return (
            <div className="content-detail container mt-5">
                {scholarshipSteps}
                <div className="row my-3">
                    {pageNumber === 1 &&
                        <div className="col-12">
                        <h1>
                            How much would you like to contribute to {scholarship.name}?
                        </h1>

                        <Input value={contributor.funding_amount}
                               prefix="$"
                               name="funding_amount"
                               placeholder="Funding Amount"
                               className="col-12"
                               type="number"
                               min="0"
                               step="1"
                               onChange={this.updateContributorInfo}/>
                    </div>

                    }
                    {pageNumber === 2 &&
                        <div className="col-12">
                        <h1>
                            Let{' '}{scholarshipOwner ? scholarshipOwner.first_name: "the Scholarship sponsor"}{' '}
                            know who is contributing
                        </h1>

                        <Input value={contributor.first_name}
                               name="first_name"
                               placeholder="First name"
                               className="col-12 mb-3"
                               onChange={this.updateContributorInfo}/>

                        <Input value={contributor.last_name}
                               name="last_name"
                               placeholder="Last name"
                               className="col-12"
                               onChange={this.updateContributorInfo}/>

                        <Button className="float-right col-md-6" type="link"
                                onClick={() => {
                                    this.contributeAnonymously();
                                    this.changePage(pageNumber+1);
                                }}>
                            Skip to contribute anonymously
                        </Button>
                    </div>
                    }
                    {pageNumber === 3 &&
                        <div className="col-12">
                        <h1>
                            Email to receive your funding confirmation
                        </h1>

                        <Input value={contributor.email}
                               name="email"
                               placeholder="Email"
                               className="col-12"
                               onChange={this.updateContributorInfo}/>
                    </div>
                    }
                    {pageNumber === 4 &&
                    <div className="my-3">
                        <PaymentSend scholarship={scholarship}
                                     updateScholarship={this.submitScholarshipContributor}
                                     contributorFundingAmount={contributor.funding_amount}
                                     contributor={contributor}/>
                    </div>
                    }

                    {invalidInput &&

                    <p className="text-danger">
                        {invalidInput}
                    </p>

                    }
                </div>

                    <div className="row">
                        {pageNumber > 1 &&
                        <Button className="float-left col-md-6"
                                onClick={() => this.changePage(pageNumber-1)}>Back</Button>}
                        {pageNumber === 1 &&
                        <Button className="float-left col-md-6">
                            <Link to={`/scholarship/${scholarship.slug}`}>
                                Back
                            </Link>
                        </Button>}

                        {pageNumber < scholarshipContributionPages.length &&
                        <Button className="float-right col-md-6"
                                onClick={() => this.changePage(pageNumber+1)}
                                disabled={invalidInput
                                || (pageNumber === 2 && !contributor.first_name)
                                || (pageNumber === 3 && !contributor.email)}>
                            Next
                        </Button>}
                    </div>
            </div>
        )
    }
}

ScholarshipContribution.defaultProps = {
    userProfile: null
};
ScholarshipContribution.propTypes = {
    // redux
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ScholarshipContribution);
