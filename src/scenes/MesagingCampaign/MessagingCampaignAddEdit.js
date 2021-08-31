import React from 'react';
import PropTypes from "prop-types";
import FormDynamic from "../../components/Form/FormDynamic";
import { Button, Input } from "antd";
import { FormUtils } from '../../services/FormUtils';
import {connect} from "react-redux";
import Loading from "../../components/Loading";
import { DEFAULT_MESSAGING_CAMPAIGN } from '../../models/MessagingCampaign';
import MessagingCampaignAPI from '../../services/MessagingCampaignAPI';
import { toastNotify } from '../../models/Utils';
import { updateCurrentUserProfileQuery } from '../../redux/actions/query';
import { convertDynamicQueryToQueryList, convertQueryListToDynamicQuery } from '../../components/Query/QueryBuilderHelper';

const { Search } = Input;

let autoSaveTimeoutId;

export const MESSAGING_CAMPAIGN_FORM_CONFIG_PAGE_1 = Object
.keys(DEFAULT_MESSAGING_CAMPAIGN).filter(key => !['recipients_query'].includes(key)).map(campaign_attribute => {

    const inputConfig = {
        keyName: campaign_attribute
    };
    if (campaign_attribute === "message_template_body") {
        inputConfig.type = "html_editor"
    }
    return inputConfig;
});

const sendMessageFormConfig = [
    {
        keyName: "limit",
        type: "number"
    },
    {
        keyName: "skip_send",
        type: "checkbox"
    }
]

class MessagingCampaignAddEdit extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            campaign: props.campaign,
            sendMessageSettings: {},
            isAddCampaignMode: true,
            loading: null,
        };
    }

    handleSubmit = (event) => {
        this.setState({loading: true});

        const { isAddCampaignMode, campaign } = this.state;
        const { currentUserProfileQuery } = this.props;


        campaign.recipients_query = convertQueryListToDynamicQuery(currentUserProfileQuery);

        let postResponsePromise;
        if(isAddCampaignMode) {
            postResponsePromise = MessagingCampaignAPI.create(campaign)
        } else {
            postResponsePromise = MessagingCampaignAPI.patch(campaign.id, campaign);
        }
        postResponsePromise
            .then(res => {
                this.setState({isAddCampaignMode: false, campaign: res.data});
                toastNotify('Successfuly Saved');
            })
            .catch(err=> {
                console.log({err});
                let campaignPostError = err.response && err.response.data;
                campaignPostError = JSON.stringify(campaignPostError, null, 4);
                this.setState({campaignPostError});
                toastNotify(`🙁${campaignPostError}`, 'error');

            })
            .finally(()=>{
                this.setState({loading: false});
            });
    }

    onGetCampaign = (campaignId) => {
        this.handleCampaignResponsePromise(MessagingCampaignAPI.get(campaignId));
    }

    sendMessages = (event) => {
        const { campaign, sendMessageSettings } = this.state;
        this.handleCampaignResponsePromise(MessagingCampaignAPI.sendMessages(campaign.id, sendMessageSettings), true);
    }

    handleCampaignResponsePromise(responsePromise, isResponseNested=false) {
        this.setState({loading: true});
        responsePromise
        .then(res => {
                
            const { updateCurrentUserProfileQuery } = this.props;
            let campaign = res.data;
            if (isResponseNested) {
                campaign = res.data.campaign;
            } else {
                campaign = res.data;
                toastNotify(`Successfuly Retreieved campaign ${campaign.id}`);
            }
            this.setState({isAddCampaignMode: false, campaign });

            updateCurrentUserProfileQuery(convertDynamicQueryToQueryList(campaign.recipients_query));
        })
        .catch(err=> {
            console.log({err});
            let campaignPostError = err.response && err.response.data;
            campaignPostError = JSON.stringify(campaignPostError, null, 4);
            this.setState({campaignPostError});
            toastNotify(`🙁${campaignPostError}`, 'error');

        })
        .finally(()=>{
            this.setState({loading: false});
        });
    }

    updateForm = (event) => {
        const { campaign, isAddCampaignMode } = this.state;

        const updatedCampaign = FormUtils.updateModelUsingForm(campaign, event);

        this.setState({campaign: updatedCampaign }, () => {
            if(!isAddCampaignMode) {
                if (autoSaveTimeoutId) {
                    clearTimeout(autoSaveTimeoutId);
                }
                autoSaveTimeoutId = setTimeout(() => {
                    // Runs 1 second (1000 ms) after the last change
                    this.handleSubmit();
                }, 1000);
            }
        });
    }

    updateSendMessageSettingsForm = (event) => {
        let { sendMessageSettings} = this.state;

        sendMessageSettings = FormUtils.updateModelUsingForm(sendMessageSettings, event);
        this.setState({ sendMessageSettings });
    }

    render() {
        const { campaign, loading, isAddCampaignMode, sendMessageSettings } = this.state;
        return (
            <div>
                <Search
                    placeholder="Enter a Previous Campaign ID"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={this.onGetCampaign}
                />
                {campaign.id && 
                <h5>
                    Campaign ID: {campaign.id}
                </h5>
                }
                <FormDynamic model={campaign}
                             inputConfigs={MESSAGING_CAMPAIGN_FORM_CONFIG_PAGE_1}
                             onUpdateForm={this.updateForm}/>
                {loading && <Loading title={loading} />}
                <Button type="primary"
                        className="col-12 mt-2"
                        onClick={this.handleSubmit}
                        disabled={loading}>{isAddCampaignMode ? "Create" : "Update"}</Button>

                <hr />
                <h4>Send Campaign Message</h4>


                <FormDynamic model={sendMessageSettings}
                             inputConfigs={sendMessageFormConfig}
                             onUpdateForm={this.updateSendMessageSettingsForm}/>
                {!isAddCampaignMode && 
                <Button type="primary"
                        className="col-12 mt-2"
                        onClick={this.sendMessages}
                        disabled={loading}>Send Messages</Button>
                }

                {campaign.total_possible_recipients && 
                <p>
                    Total possible recipients: {campaign.total_possible_recipients}<br/>

                    Sent Messages: {campaign.sent_messages}<br/>

                    Remaining to send: {campaign.total_possible_recipients - campaign.sent_messages}<br/>
                </p>
                }
            </div>
        );

    }
};

MessagingCampaignAddEdit.defaultProps = {
    campaign: Object.assign({}, DEFAULT_MESSAGING_CAMPAIGN),
};

MessagingCampaignAddEdit.propTypes = {
    campaign: PropTypes.shape({}),
};

const mapDispatchToProps = {
    updateCurrentUserProfileQuery,
};

const mapStateToProps = state => {
    return { 
        loggedInUserProfile: state.data.user.loggedInUserProfile,
        currentUserProfileQuery: state.data.query.currentUserProfileQuery 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingCampaignAddEdit);
