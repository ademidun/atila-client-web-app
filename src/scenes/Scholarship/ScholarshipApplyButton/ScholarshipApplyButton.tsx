import { useCallback, useEffect, useState } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './ScholarshipApplyButton.scss'
import Loading from '../../../components/Loading';
import ApplicationsAPI from '../../../services/ApplicationsAPI';
import { UserProfile } from '../../../models/UserProfile.class';
import { Scholarship } from '../../../models/Scholarship.class';
import { Application } from '../../../models/Application.class';
import { getErrorMessage } from '../../../services/utils';

interface ScholarshipApplyButtonProps {
    scholarship: Scholarship;
    userProfileLoggedIn?: UserProfile;
    className?: string;
}

interface ApplicationResponse {
    data: {
        results: Application[];
    };
}

/**
 * See flow for deciding which apply button to show: https://app.diagrams.net/#G1G_6VEkDXNARPZVo3UXao9gnfYlYDaLGH
 * or  https://i.imgur.com/YRLmfHy.png
 */
function ScholarshipApplyButton(props: ScholarshipApplyButtonProps) {
    const { scholarship, userProfileLoggedIn } = props;
    const navigate = useNavigate();
    const location = useLocation();

    const { owner_detail: scholarshipOwner, open_date, is_atila_direct_application, is_funded } = scholarship;
    
    const [application, setApplication] = useState<Application | null>(null);
    const [loadingApplication, setLoadingApplication] = useState("");

    let scholarshipDateMoment = moment(scholarship.deadline);
    const todayMoment = moment(Date.now());
    const isScholarshipDeadlinePassed = scholarshipDateMoment.diff(moment()) < 0;

    const findExistingApplication = useCallback(() => {
        if (!userProfileLoggedIn || !scholarship) {
            return;
        }

        setLoadingApplication("Loading application");
        ApplicationsAPI.doesApplicationExist(userProfileLoggedIn.user, scholarship.id)
            .then((res: ApplicationResponse) => {
                const { data: { results } } = res;
                if (results.length > 0) {
                    setApplication(results[0]);
                }
            })
            .catch((error: Error) => {
                console.log({ error });
                setLoadingApplication(getErrorMessage(error));
            })
            .finally(() => {
                setLoadingApplication("");
            });
    }, [scholarship, userProfileLoggedIn]);

    useEffect(() => {
        findExistingApplication();
    }, [findExistingApplication]);
    
    const viewApplicationButton = (
        <Button type="primary" size="large" className="ScholarshipApplyButton">
            <Link to={`/application/${application?.id}`}>
                View Application
            </Link>
        </Button>
    );
    // is there a way to combine logic of View Application and Continue Application?
    const continueApplicationButton = (
        <Button type="primary" size="large" className="ScholarshipApplyButton">
            <Link to={`/application/${application?.id}`}>
                Continue Application
            </Link>
        </Button>
    );

    const registerButton = (
        <Button type="primary" size="large" className="ScholarshipApplyButton">
            <Link to={`/register?redirect=${encodeURIComponent(location.pathname)}`}>
                Apply Now
            </Link>
        </Button>
    );

    const startApplicationButton = (
        <Button type="primary" size="large" className="ScholarshipApplyButton"
            onClick={() => {
                if (!userProfileLoggedIn) {
                    navigate(`/register?redirect=${encodeURIComponent(location.pathname)}`);
                    return;
                }

                if (application) {
                    navigate(`/application/${application.id}`);
                    return;
                }

                navigate(`/scholarship/${scholarship.slug}/apply`);
            }}
        >
            Apply Now
        </Button>
    );


    if (loadingApplication) {
        return <Loading isLoading={loadingApplication} title={loadingApplication} />;
    }
    if (userProfileLoggedIn && scholarshipOwner.user === userProfileLoggedIn.user) {
        return null
    }
    if (open_date && open_date > todayMoment.toISOString()) {
        return <Button disabled={true} size="large" className="ScholarshipApplyButton">
            Scholarship is not open yet
        </Button>
    }
    if (is_atila_direct_application && !is_funded) {
        return <Button disabled={true} size="large" className="ScholarshipApplyButton">
            Scholarship must be funded
        </Button>
    }
    if(isScholarshipDeadlinePassed) {
        return application ? viewApplicationButton : null
    } else {
        if (userProfileLoggedIn) {
            if(application) {
                return application.is_submitted ? viewApplicationButton : continueApplicationButton
            } else {
                return startApplicationButton
            }
        } else {
            return registerButton
        }
    }
}

const mapStateToProps = (state: any) => ({
    userProfileLoggedIn: state.data.user.loggedInUserProfile
});

export default connect(mapStateToProps)(ScholarshipApplyButton);