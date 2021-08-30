import React from 'react';
import PropTypes from "prop-types";
import FormDynamic from "../../components/Form/FormDynamic";
import { Button } from "antd";
import { FormUtils } from '../../services/FormUtils';
import {connect} from "react-redux";
import Loading from "../../components/Loading";
import { DEFAULT_MESSAGING_CAMPAIGN } from '../../models/MessagingCampaign';


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
            campaign: props.campaign || Object.assign({}, DEFAULT_MESSAGING_CAMPAIGN),
            loading: null,
        };
    }

    handleSubmit = (event) => {

    }

    

    updateForm = (event) => {
        const { campaign } = this.state;

        const updatedCampaign = FormUtils.updateModelUsingForm(campaign, event);

        this.setState({campaign: updatedCampaign });
    }
    render() {
        const { campaign, loading } = this.state;
        return (
            <div>
                <FormDynamic model={campaign}
                             inputConfigs={MESSAGING_CAMPAIGN_FORM_CONFIG_PAGE_1}
                             onUpdateForm={this.updateForm}/>
                {loading && <Loading title={loading} />}
                <Button type="primary"
                        className="col-12 mt-2"
                        onClick={this.handleSubmit}
                        disabled={loading}>Save</Button>
            </div>
        );

    }
};

MessagingCampaignAddEdit.defaultProps = {
    campaign: {},
};

MessagingCampaignAddEdit.propTypes = {
    campaign: PropTypes.shape({}),
};

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(MessagingCampaignAddEdit);