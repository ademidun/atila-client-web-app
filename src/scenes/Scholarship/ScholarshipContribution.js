import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

import {Button, Input, Steps} from "antd";
import UserProfileAPI from "../../services/UserProfileAPI";
import PaymentSend from "../Payment/PaymentSend/PaymentSend";
import {UserProfilePropType} from "../../models/UserProfile";
import Register from "../../components/Register";
import FileInput from "../../components/Form/FileInput";
import {DEFAULT_SCHOLARSHIP_CONTRIBUTOR} from "../../models/Scholarship";

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
        /**
         * Usually you might use something like: Object.assign({}, DEFAULT_SCHOLARSHIP_CONTRIBUTOR)
         * to avoid contributor values persisting between different re-renderings
         * as was done in DEFAULT_SCHOLARSHIP (see: ScholarshipAddEdit.js).
         * But in DEFAULT_SCHOLARSHIP the problem came when we wanted to add different users, in this use case
         * it's more likely that a user who contributed towards one scholarship, is likely to be the same user
         * that contributes to another or the same scholarship. So persisting state values in this scenario,
         * is actually an advantage.
         */
        const defaultContributor = DEFAULT_SCHOLARSHIP_CONTRIBUTOR;

        // Pre-fill the contributor information with the logged-in user profile details.
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
            showRegistrationForm: true,
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
        let { is_anonymous } = contributor;
        let invalidInput = null;
        let value = event.target.value;
        let eventName = event.target.name;
        if (event.target.type==='checkbox'){
            value = event.target.checked
        }
        if (eventName === "funding_amount") {
            value = Number.parseInt(value)
        }
        // If the user types a first name or last name then that implies they are not anonymous.
        if (eventName === "first_name" || eventName === "last_name") {
            is_anonymous = !value;
        }

        contributor = {
            ...contributor,
            is_anonymous,
            [eventName]: value
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

    toggleShowRegistrationForm = () => {
        const { showRegistrationForm } = this.state;

        this.setState({showRegistrationForm: !showRegistrationForm});
    };

    render () {
        const { isLoadingScholarship, scholarship, pageNumber,
            contributor, scholarshipOwner, invalidInput, showRegistrationForm } = this.state;
        const { userProfile } = this.props;

        const scholarshipSteps = (<Steps current={pageNumber-1} onChange={(current) => this.changePage(current+1)}>
            { scholarshipContributionPages.map(item => (
                <Step key={item.title} title={item.title} />
            ))}
        </Steps>);

        if (isLoadingScholarship) {
            return (<Loading title={`Loading Form`} className='mt-3' />)
        }

        return (
            <div className="container mt-5">
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
                               <hr/>

                           <h3>Optional: Add a Picture of yourself to go with your donation</h3>
                            <FileInput title={"Profile Picture"}
                                       type={"image"}
                                       keyName={"profile_pic_url"}
                                       filePath={`user-profile-pictures-contributors`}
                                       onChangeHandler={this.updateContributorInfo} />
                            {contributor.profile_pic_url && <img src={contributor.profile_pic_url}
                                                                 alt={contributor.first_name}
                                                                 width="250"
                                                                 className="card center-block my-3"/> }

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
                    {pageNumber >= 4 &&
                    <div className="col-12">
                        {pageNumber === 4 &&
                        <h1>
                            Enter Payment Details
                        </h1>
                        }
                        {pageNumber === 5 && !userProfile &&
                            <div className="col-12 text-center mb-3">
                                <h1>Optional: Create an Account</h1> <br/>
                                <p className="text-muted">
                                    Creating an account will allow you to view all your contributions
                                    on Atila and request being added as a reviewer to applications for this scholarship.
                                </p>
                                <Button onClick={this.toggleShowRegistrationForm} type="link">
                                    {showRegistrationForm ? 'Hide ': 'Show '} Registration Form
                                </Button>
                                {showRegistrationForm &&
                                    <Register location={this.props.location}
                                              userProfile={contributor}
                                              disableRedirect={true} />
                                }
                            </div>
                        }
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

export default withRouter(connect(mapStateToProps)(ScholarshipContribution));
