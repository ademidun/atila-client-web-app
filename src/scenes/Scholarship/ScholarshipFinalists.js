import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {Row, Col, Tag} from "antd";
import ContentCard from "../../components/ContentCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {formatCurrency, genericItemTransform} from "../../services/utils";
import ApplicationsAPI from "../../services/ApplicationsAPI";

class ScholarshipFinalists extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipFinalistEssays: [],
            scholarshipFinalistUserProfiles: [],
            isLoadingScholarshipFinalists: false,
            errorLoadingScholarshipFinalists: false,
        }
    }
    componentDidMount() {

        const { id, allFinalists } = this.props;
        this.setState({ isLoadingScholarshipFinalists: true });

        let scholarshipFinalistsPromise;
        if (allFinalists) {
            scholarshipFinalistsPromise = ApplicationsAPI.allFinalists();
        } else {
            scholarshipFinalistsPromise = ScholarshipsAPI.getFinalists(`${id}`);
        }
        scholarshipFinalistsPromise
            .then(res => {
                this.setState({
                        scholarshipFinalistEssays: res.data.finalist_essays,
                        scholarshipFinalistUserProfiles: res.data.finalist_user_profiles,
                });
            });

        scholarshipFinalistsPromise
            .catch(err => {
                console.log({ err});
            })
            .finally(() => {
                this.setState({ isLoadingScholarshipFinalists: false });
            });
    }

    render () {

        const { scholarshipFinalistEssays, scholarshipFinalistUserProfiles, isLoadingScholarshipFinalists  } = this.state;
        const { className, title, showEssaysFirst  } = this.props;

        if (isLoadingScholarshipFinalists) {
            return (
                <div className={`${className}`}>
                    <Loading
                        isLoading={isLoadingScholarshipFinalists}
                        title={'Loading Scholarship Finalists..'} />
                </div>);
        }

        return (
            <div className={`${className}`}>
                <h3 className="text-center">{title}</h3>
                {showEssaysFirst &&
                <ScholarshipFinalistEssays title={title} scholarshipFinalistEssays={scholarshipFinalistEssays} />
                }
                <UserProfilesCards userProfiles={scholarshipFinalistUserProfiles} />
                {!showEssaysFirst &&
                <ScholarshipFinalistEssays title={title} scholarshipFinalistEssays={scholarshipFinalistEssays} />
                }

            </div>
        );
    }
}

export function ScholarshipFinalistEssays({ title, scholarshipFinalistEssays }) {

    return (
        <React.Fragment>
            <h3 className="text-center">{title}' Essays</h3>
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                {scholarshipFinalistEssays.map(item => {
                    // set this so getItemType() in genericItemTransform() returns an essay
                    item.essay_source_url="";
                    return (
                        // Use zoom:0.8 as a temporary workaround so that that ScholarshipFinalists doesn't
                        // take up too much space.
                        <Col xs={24} md={12} lg={8} style={{zoom:0.9}} key={item.slug}>
                            <ContentCard key={item.slug}
                                         content={genericItemTransform(item)}
                                         customStyle={{height: "850px"}}
                                         className="mb-3" />
                        </Col>)
                })}

            </Row>
        </React.Fragment>
    )

}
export function UserProfilesCards({userProfiles, userKey="username"}) {
    return (<Row gutter={[{ xs: 8, sm: 16}, 16]}>
        {userProfiles.map(user => {

            let fundingAmount = <>
                {user.funding_amount &&
                    <strong>
                        :{' '}{ formatCurrency(user.funding_amount, true) }
                    </strong>
                }
        </>;

            let userDisplay = (
                <Link to={`/profile/${user.username}`} >
                    <img
                        alt="user profile"
                        className="rounded-circle py-1 pr-1 square-icon"
                        src={user.profile_pic_url} />
                    {user.first_name} {user.last_name}{' '}{fundingAmount}
                </Link>);

            if (user.is_anonymous || !user.username) {
                userDisplay = (
                    <div>
                        <img
                            alt="user profile"
                            className="rounded-circle py-1 pr-1 square-icon"
                            src={user.profile_pic_url} />
                        {user.is_anonymous ? "Anonymous" : `${user.first_name} ${user.last_name}`}{' '}{fundingAmount}
                    </div>);
            }

            return (
                // Use zoom:0.8 as a temporary workaround so that that ScholarshipFinalists doesn't
                // take up too much space.
                <Col xs={24} md={12} style={{zoom:0.9}} key={user[userKey]}>
                    <div className="bg-light mb-3 p-1 rounded-pill">
                        {userDisplay}
                        {user.is_winner && <Tag color="green">{' '}Winner</Tag>}
                        {user.is_owner && <Tag color="green">{' '}Creator</Tag>}
                    </div>
                </Col>)
        })}

    </Row>)

}

ScholarshipFinalists.defaultProps = {
    className: '',
    title: 'Related',
    allFinalists: false,
    showEssaysFirst: false,
};

ScholarshipFinalists.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    allFinalists: PropTypes.bool,
    showEssaysFirst: PropTypes.bool,
    itemType: PropTypes.string.isRequired,
    id: PropTypes.number,
};

export default ScholarshipFinalists;

