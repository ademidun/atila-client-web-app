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

const { Search } = Input;

export const MESSAGING_CAMPAIGN_FORM_CONFIG_PAGE_1 = Object.keys(DEFAULT_MESSAGING_CAMPAIGN).map(campaign_attribute => {

    const inputConfig = {
        keyName: campaign_attribute
    };
    if (campaign_attribute === "message_template_body") {
        inputConfig.type = "html_editor"
    }
    return inputConfig;
});

class MessagingCampaignAddEdit extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            campaign: props.campaign,
            isAddCampaignMode: true,
            loading: null,
        };
    }

    handleSubmit = (event) => {
        this.setState({loading: true});

        const { isAddCampaignMode, campaign } = this.state;

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
        MessagingCampaignAPI.get(campaignId)
            .then(res => {
                this.setState({isAddCampaignMode: false, campaign: res.data});
                toastNotify(`Successfuly Retreieved campaign ${campaignId}`);
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
        const { campaign } = this.state;

        const updatedCampaign = FormUtils.updateModelUsingForm(campaign, event);

        this.setState({campaign: updatedCampaign });
    }
    render() {
        const { campaign, loading, isAddCampaignMode } = this.state;
        return (
            <div>
                <Search
                    placeholder="Enter a Previous Campaign ID"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={this.onGetCampaign}
                />
                <FormDynamic model={campaign}
                             inputConfigs={MESSAGING_CAMPAIGN_FORM_CONFIG_PAGE_1}
                             onUpdateForm={this.updateForm}/>
                {loading && <Loading title={loading} />}
                <Button type="primary"
                        className="col-12 mt-2"
                        onClick={this.handleSubmit}
                        disabled={loading}>{isAddCampaignMode ? "Create" : "Update"}</Button>
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

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(MessagingCampaignAddEdit);