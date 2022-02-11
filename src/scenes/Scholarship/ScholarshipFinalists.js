import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {Row, Col, Tag} from "antd";
import ContentCard from "../../components/ContentCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {formatCurrency, genericItemTransform} from "../../services/utils";
import ApplicationsAPI from "../../services/ApplicationsAPI";
const queryString = require('query-string');

class ScholarshipFinalists extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipFinalistEssays: [],
            scholarshipFinalistUserProfiles: [],
            isLoadingScholarshipFinalists: false,
            errorLoadingScholarshipFinalists: false,
            scholarships: [], // If we are filtering by scholarship id, this var stores the scholarships' info.
            isFilteredByScholarshipID: false,
        }
    }
    componentDidMount() {
        const { id, allFinalists, search } = this.props;

        this.setState({ isLoadingScholarshipFinalists: true });

        let scholarshipFinalistsPromise;
        let isFilteredById = false;

        let parsed;
        if (search) {
            parsed = queryString.parse(search);
            if (parsed.scholarship_id) {
                isFilteredById = true;
            }
        }

        this.setState({ isFilteredByScholarshipID: isFilteredById })

        if (isFilteredById) {
            const parsedScholarshipIds = parsed.scholarship_id.split(",")
            scholarshipFinalistsPromise = ApplicationsAPI.filteredFinalists(parsedScholarshipIds)
        } else if (allFinalists) {
            scholarshipFinalistsPromise = ApplicationsAPI.allFinalists();
        } else {
            scholarshipFinalistsPromise = ScholarshipsAPI.getFinalists(`${id}`);
        }

        scholarshipFinalistsPromise
            .then(res => {
                this.setState({
                        scholarshipFinalistEssays: res.data.finalist_essays,
                        scholarshipFinalistUserProfiles: res.data.finalist_user_profiles,
                        scholarships: res.data.scholarships,
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

        const { scholarshipFinalistEssays, scholarshipFinalistUserProfiles, isLoadingScholarshipFinalists,
            scholarships, isFilteredByScholarshipID  } = this.state;
        const { className, title, showEssaysFirst, location : { pathname} } = this.props;

        const finalistsPathname = "/finalists";

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
                <h2 className="text-center">
                    {pathname === finalistsPathname ?
                        <React.Fragment>
                            {title}
                        </React.Fragment>
                        :
                        <Link to={finalistsPathname}
                            target="_blank"
                            rel='noopener noreferrer'>
                            {title}
                        </Link>
                    }
                </h2>
                {showEssaysFirst &&
                <ScholarshipFinalistEssays title={title}
                                           scholarshipFinalistEssays={scholarshipFinalistEssays}
                                           isFiltered={isFilteredByScholarshipID}
                                           scholarships={scholarships} />
                }
                <UserProfilesCards userProfiles={scholarshipFinalistUserProfiles} />
                {!showEssaysFirst &&
                <ScholarshipFinalistEssays title={title}
                                           scholarshipFinalistEssays={scholarshipFinalistEssays}
                                           isFiltered={isFilteredByScholarshipID}
                                           scholarships={scholarships} />
                }

            </div>
        );
    }
}

export function ScholarshipFinalistEssays({ title, scholarshipFinalistEssays, isFiltered, scholarships }) {
    let displayTitle =(
            <h2 > 
                {title}' Essays 
                <br/><br/>
            </h2>
        )

    let essayContent;
    if (scholarshipFinalistEssays.length === 0) {
        essayContent = (
            <React.Fragment>
                <h3 className="text-center">No published essays to display</h3>
            </React.Fragment>
        )
    } else {
        essayContent = (<Row gutter={[{ xs: 8, sm: 16}, 16]}>
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
        </Row>)
    }


    if (isFiltered && scholarships.length > 0) {
        // Get all the scholarship titles as link components
        let scholarshipTitles = scholarships.map((scholarship, idx) => (
            <>
                <Link to={`/scholarship/${scholarship.slug}`}
                    target="_blank"
                    rel='noopener noreferrer'>
                    {scholarship.name}
                </Link>
                {idx !== scholarships.length-1 && ', '} {/* Don't put a separator on final title */}
            </>
        ))

        displayTitle = <>{displayTitle} for {scholarshipTitles}</>
    }

    return (
        <React.Fragment>
            <h3 className="text-center">{displayTitle}</h3>
            {essayContent}
        </React.Fragment>
    )

}


export function UserProfilesCards({userProfiles, userKey="username"}) {
    return (
    
    <Row gutter={[{ xs: 8, sm: 16}, 16]}>
        {userProfiles.map((user, index) => {

            const fundingAmount = <>
                {user.funding_amount &&
                    <strong>
                        :{' '}{ formatCurrency(user.funding_amount, true) }
                    </strong>
                }
            </>;

            const userDisplay = (  
                <div className='UserCard'>
                    
                    <div className='userUpper-container'>
                        <div className='userImage-container'>
                            <Link to={`/profile/${user.username}`}>
                            <img id="avatar-pic"
                                alt="user profile"
                                src={user.profile_pic_url} />
                            </Link>
                        </div>
                    </div>
                    <div className='tag'>
                        {user.is_winner && <Tag color="green">{' '}Winner</Tag>}
                        {user.is_owner && <Tag color="green">{' '}Creator</Tag>}
                    </div>
                    {user.is_anonymous || !user.username ? 
                
                        <div className='userLower-container'>
                            {user.is_anonymous ? "Anonymous" : `${user.first_name} ${user.last_name}`}{' '}{fundingAmount}
                        </div>
                        :
                        <div className='userLower-container'>
                        <Link to={`/profile/${user.username}`}>
                        {user.first_name}{' '}{user.last_name} 
                        {fundingAmount}
                        </Link>
                        </div>
                    }
                                
                </div>  
            );
            return (
                    <div key={index}>
                        <br/><br/>
                        {userDisplay}
                    </div>)
            })}

    </Row>
    )

};

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
    search: PropTypes.string,
};

export default withRouter(ScholarshipFinalists);
