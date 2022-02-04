import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { Application } from '../../models/Application.class';
import { Scholarship } from '../../models/Scholarship.class';
import { UserProfile } from '../../models/UserProfile.class';
import ApplicationsAPI from '../../services/ApplicationsAPI';

interface ScholarshipApplyButtonPropTypes extends RouteComponentProps {
    /** Amount to send to destination address before gas fees. */
    loggedInUserProfile?: UserProfile;
    scholarship: Scholarship;
}

ScholarshipApplyButton.defaultProps = {
}



/**
 * See flow for deciding which apply button to show: https://app.diagrams.net/#G1G_6VEkDXNARPZVo3UXao9gnfYlYDaLGH
 * or  https://i.imgur.com/YRLmfHy.png
 */
function ScholarshipApplyButton(props: ScholarshipApplyButtonPropTypes): JSX.Element | null {
    const { loggedInUserProfile, scholarship, history, location: { pathname } } = props;

    const { owner_detail: scholarshipOwner } = scholarship;
    
    const [isLoadingApplication, setIsLoadingApplication] = useState<boolean>(false);
    const [application, setApplication] = useState<Application|undefined>(undefined);

    let scholarshipDateMoment = moment(scholarship.deadline);
    const isScholarshipDeadlinePassed = scholarshipDateMoment.diff(moment()) < 0;

    const findExistingApplication = useCallback(
        () => {
            if(!loggedInUserProfile || !scholarship.is_atila_direct_application) {
                return
            }
    
            setIsLoadingApplication(true);
            ApplicationsAPI
                .doesApplicationExist(loggedInUserProfile.user, scholarship.id)
                .then(res => {
                    const { data: { exists, application: existingApplication } } = res;
                    if (exists) {
                        setApplication(existingApplication);
                    }
                })
                .catch((err) => {
                    console.log({ err });
                })
                .finally(() => {
                    setIsLoadingApplication(false);
                });
        }, [loggedInUserProfile, scholarship])

    
    const getOrCreateApplication = () => {
        if(!loggedInUserProfile) {
            return
        }
        ApplicationsAPI.getOrCreate({ scholarship: scholarship.id, user: loggedInUserProfile.user })
            .then((res: any) => {

                const { data: { application: newApplication } } = res;

                history.push(`/application/${newApplication.id}`);
            })
            .catch((err: any) => {
                console.log({ err });
            })
    }

    useEffect(() => {
        findExistingApplication();
    }, [findExistingApplication]);
    
    const viewApplicationButton = (
        <Button type="primary" size="large">
                    <Link to={`/application/${application?.id}`}>
                        View Application
                    </Link>
                </Button>
    );
    // is there a way to combine logic of View Application and Continue Application?
    const continueApplicationButton = (
        <Button type="primary" size="large">
                    <Link to={`/application/${application?.id}`}>
                        Continue Application
                    </Link>
                </Button>
    );

    const registerButton = (
    <Button type="primary" size="large">
        <Link to={`/register?redirect=${pathname}&applyNow=1`}>
            Apply Now
        </Link>
    </Button>
);

    const startApplicationButton = (<Button type="primary" size="large"
    onClick={getOrCreateApplication}
   >
    Apply Now
</Button>);

    if (isLoadingApplication) {
       return ( <Loading title="Loading Application..." />)
    }
    if (loggedInUserProfile && scholarshipOwner.user === loggedInUserProfile.user) {
        return null
    }
    if(isScholarshipDeadlinePassed) {
        return application ? viewApplicationButton : null
    } else {
        if (loggedInUserProfile) {
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

const mapStateToProps = (state: any) => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(ScholarshipApplyButton));