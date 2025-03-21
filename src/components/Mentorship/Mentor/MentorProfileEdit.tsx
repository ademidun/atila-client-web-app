import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, message } from 'antd';
import {connect} from "react-redux";
import FormDynamic from '../../Form/FormDynamic';
import { Mentor } from '../../../models/Mentor';
import { mentorProfileFormConfig } from "../../../models/MentorConfig";
import { UserProfile } from '../../../models/UserProfile.class';
import MentorshipAPI from '../../../services/MentorshipAPI';
import UserProfileAPI from '../../../services/UserProfileAPI';
import { getErrorMessage } from '../../../services/utils';
import { scholarshipUserProfileSharedFormConfigs, toastNotify } from '../../../models/Utils';
import { RouteComponentProps, withRouter } from 'react-router';
import { NetworkResponse, NetworkResponseDisplay } from '../../NetworkResponse';
import MentorDurations from './MentorDurations';

let autoSaveTimeoutId: any;

interface RouteParamsProps {
    username: string,
    sessionId: string,
  };

export interface MentorProfileEditPropTypes extends RouteComponentProps<RouteParamsProps>  {
    userProfileLoggedIn?: UserProfile,
}

// Convert to class component to ensure refs property exists
class MentorProfileEdit extends React.Component<MentorProfileEditPropTypes> {
    state = {
        mentor: undefined as Mentor | undefined,
        networkResponse: {title: "", type: null} as NetworkResponse,
        isMentorSet: false
    };
    autoSaveTimeoutId: any = null;

    componentDidMount() {
        const { userProfileLoggedIn } = this.props;
        if (userProfileLoggedIn) {
            this.loadMentor();
        }
    }

    componentDidUpdate(prevProps: MentorProfileEditPropTypes) {
        const { userProfileLoggedIn } = this.props;
        if (prevProps.userProfileLoggedIn !== userProfileLoggedIn && userProfileLoggedIn) {
            this.loadMentor();
        }
    }

    componentWillUnmount() {
        if (this.autoSaveTimeoutId) {
            clearTimeout(this.autoSaveTimeoutId);
        }
    }

    loadMentor = async () => {
        const { match: { params: { username } }, userProfileLoggedIn } = this.props;
        
        this.setState({networkResponse: {title: "Loading Mentor profile", type: "loading"}});
        
        try {
            if (username) {
                const res = await MentorshipAPI.listMentors(`?username=${username}`);
                const { data: {results: mentors } } = res;
                this.setState({
                    mentor: mentors[0],
                    isMentorSet: true,
                    networkResponse: {title: "", type: null}
                });
            }
            else {
                const res = await UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "mentor");
                const { data } = res;
                this.setState({
                    mentor: data.mentor,
                    isMentorSet: true,
                    networkResponse: {title: "", type: null}
                });
            }
        } catch (error) {
            console.log({error});
            this.setState({
                networkResponse: {title: getErrorMessage(error), type: "error"}
            });
        }
    }

    createMentorProfile = () => {
        const { userProfileLoggedIn } = this.props;
        
        this.setState({networkResponse: {title: "Creating your Mentor profile", type: "loading"}});
        
        MentorshipAPI.createMentor(userProfileLoggedIn?.user!)
        .then((res: any) => {
            const { data } = res;
            this.setState({
                mentor: data,
                networkResponse: {title: "Mentor profile succesfully created!", type: "success"}
            });
        })
        .catch(error => {
            console.log({error});
            this.setState({
                networkResponse: {title: getErrorMessage(error), type: "error"}
            });
        });
    }

    updateForm = (event: any) => {
        const { mentor } = this.state;
        
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        if (!mentor){
            return;
        }

        const value = event.target.value;

        let updatedMentor;
        let newValue = (mentor as any)[event.target.name];
        
        if (Array.isArray((mentor as any)[event.target.name]) && !Array.isArray(value)) {
            newValue.push(value);
        } else {
            newValue = value;
        }
        
        updatedMentor = {
            ...mentor,
            [event.target.name]: newValue
        };

        this.setState({mentor: updatedMentor}, this.saveChanges);
    };

    saveChanges = () => {
        const { mentor } = this.state;
        
        if (!this.state.isMentorSet) {
            return;
        }

        if (this.autoSaveTimeoutId) {
            clearTimeout(this.autoSaveTimeoutId);
        }

        // Runs 1 second (1000 ms) after the last change
        this.autoSaveTimeoutId = setTimeout(() => {
            MentorshipAPI
            .patchMentor({mentor: mentor!})
            .then(res => {
                message.success('Mentor Profile successfully saved!');
            })
            .catch(err => {
                let postError = err.response && err.response.data;
                postError = JSON.stringify(postError, null, 4);
                toastNotify(`${postError}`, 'error');
            });
        }, 1000);
    }

    handleDurationsSaved = (prices: any) => {
        const { mentor } = this.state;
        if (mentor) {
            this.setState({
                mentor: { ...mentor, prices }
            }, this.saveChanges);
        }
    }

    render() {
        const { userProfileLoggedIn } = this.props;
        const { mentor, networkResponse } = this.state;
        
        return (
            <div className='m-3'>
                <h1>Edit Mentor Profile</h1>
                <NetworkResponseDisplay response={networkResponse} />
                {!mentor && 
                    <div className='text-center'>
                    <h3>You must first create a mentor profile</h3>
                        <Button onClick={this.createMentorProfile} disabled={networkResponse.type==='loading'} type="primary">
                            Create Mentor Profile
                        </Button>
                    </div>
                }

                {mentor && 
                    <>
                    <label>
                        Changes are automatically saved
                    </label>
                        <FormDynamic onUpdateForm={this.updateForm}
                                    model={mentor}
                                    inputConfigs={mentorProfileFormConfig}
                                    loggedInUserProfile={userProfileLoggedIn}
                        />
                        <hr/>
                        <MentorDurations initialDurations={mentor.prices} 
                            onDurationsSaved={this.handleDurationsSaved} />
                        <hr/>

                        <FormDynamic onUpdateForm={this.updateForm}
                                    model={mentor}
                                    inputConfigs={scholarshipUserProfileSharedFormConfigs}
                                    loggedInUserProfile={userProfileLoggedIn} />
                    </>
                }
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(MentorProfileEdit));