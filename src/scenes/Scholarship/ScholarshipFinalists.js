import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";
import { Row, Col } from "antd";
import ContentCard from "../../components/ContentCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import { genericItemTransform } from "../../services/utils";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import { UserProfileCardsList } from '../UserProfile/UserProfileCard';
const queryString = require('query-string');

function ScholarshipFinalists(props) {
    const location = useLocation();

    const [state, setState] = React.useState({
        scholarshipFinalistEssays: [],
        scholarshipFinalistUserProfiles: [],
        isLoadingScholarshipFinalists: false,
        errorLoadingScholarshipFinalists: false,
        scholarships: [],
        isFilteredByScholarshipID: false,
    });

    React.useEffect(() => {
        const { id, allFinalists, search } = props;

        setState(prevState => ({ ...prevState, isLoadingScholarshipFinalists: true }));

        let scholarshipFinalistsPromise;
        let isFilteredById = false;

        let parsed;
        if (search) {
            parsed = queryString.parse(search);
            if (parsed.scholarship_id) {
                isFilteredById = true;
            }
        }

        setState(prevState => ({ ...prevState, isFilteredByScholarshipID: isFilteredById }));

        if (isFilteredById) {
            const parsedScholarshipIds = parsed.scholarship_id.split(",");
            scholarshipFinalistsPromise = ApplicationsAPI.filteredFinalists(parsedScholarshipIds);
        } else if (allFinalists) {
            scholarshipFinalistsPromise = ApplicationsAPI.allFinalists();
        } else {
            scholarshipFinalistsPromise = ScholarshipsAPI.getFinalists(`${id}`);
        }

        scholarshipFinalistsPromise
            .then(res => {
                setState(prevState => ({
                    ...prevState,
                    scholarshipFinalistEssays: res.data.finalist_essays,
                    scholarshipFinalistUserProfiles: res.data.finalist_user_profiles,
                    scholarships: res.data.scholarships,
                }));
            })
            .catch(err => {
                console.log({ err });
            })
            .finally(() => {
                setState(prevState => ({ ...prevState, isLoadingScholarshipFinalists: false }));
            });
    }, [props]);

    const { scholarshipFinalistEssays, scholarshipFinalistUserProfiles, isLoadingScholarshipFinalists,
        scholarships, isFilteredByScholarshipID } = state;
    const { className, title, showEssaysFirst } = props;
    const { pathname } = location;

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
            <UserProfileCardsList userProfiles={scholarshipFinalistUserProfiles} />
            {!showEssaysFirst &&
            <ScholarshipFinalistEssays title={title}
                                       scholarshipFinalistEssays={scholarshipFinalistEssays}
                                       isFiltered={isFilteredByScholarshipID}
                                       scholarships={scholarships} />
            }

        </div>
    );
}

export function ScholarshipFinalistEssays({ title, scholarshipFinalistEssays, isFiltered, scholarships }) {
    let displayTitle = (
        <h2>
            {title}' Essays
            <br /><br />
        </h2>
    );

    let essayContent;
    if (scholarshipFinalistEssays.length === 0) {
        essayContent = (
            <React.Fragment>
                <h3 className="text-center">No published essays to display</h3>
            </React.Fragment>
        );
    } else {
        essayContent = (<Row gutter={[{ xs: 8, sm: 16 }, 16]}>
            {scholarshipFinalistEssays.map(item => {
                item.essay_source_url = "";
                return (
                    <Col xs={24} md={12} lg={8} style={{ zoom: 0.9 }} key={item.slug}>
                        <ContentCard key={item.slug}
                                     content={genericItemTransform(item)}
                                     customStyle={{ height: "850px" }}
                                     className="mb-3" />
                    </Col>);
            })}
        </Row>);
    }

    if (isFiltered && scholarships.length > 0) {
        let scholarshipTitles = scholarships.map((scholarship, idx) => (
            <>
                <Link to={`/scholarship/${scholarship.slug}`}
                    target="_blank"
                    rel='noopener noreferrer'>
                    {scholarship.name}
                </Link>
                {idx !== scholarships.length - 1 && ', '}
            </>
        ));

        displayTitle = <>{displayTitle} for {scholarshipTitles}</>;
    }

    return (
        <React.Fragment>
            <h3 className="text-center">{displayTitle}</h3>
            {essayContent}
        </React.Fragment>
    );
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
    search: PropTypes.string,
};

export default ScholarshipFinalists;
