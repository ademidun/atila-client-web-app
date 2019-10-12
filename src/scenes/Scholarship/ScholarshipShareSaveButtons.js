import React from 'react';
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {Dropdown, OverlayTrigger} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark, faShareAlt, faMailBulk, faSms} from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger, faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import {toastNotify} from "../../models/Utils";
import NotificationsService from "../../services/NotificationsService";
import {Link} from "react-router-dom";

class ScholarshipShareSaveButtons extends React.Component {

    constructor(props) {
        super(props);

        const { userProfile, scholarship } = props;

        let isSavedScholarship = false;
        if (userProfile && userProfile.saved_scholarships.includes(scholarship.id)) {
            isSavedScholarship = true;
        }

        this.state = {
            isSavedScholarship,
        }
    }

    renderTooltip = props => {

        const { isSavedScholarship } = this.state;

        const title = isSavedScholarship?
            "You've already saved this scholarship 👌🏿":
            'Save Scholarship';

        return (
            <div
                {...props}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    padding: '2px 10px',
                    color: 'white',
                    borderRadius: 3,
                    ...props.style,
                }}
            >
                {title}
            </div>
        );
    }


    saveScholarship = (event) => {
        event.preventDefault();
        const { isSavedScholarship } = this.state;
        const { userProfile, scholarship } = this.props;

        if (isSavedScholarship) {
            toastNotify("You've already saved this scholarship 👌🏿");
            return;
        }

        if (!userProfile) {
            toastNotify((<p>You must <Link to="/register">Register</Link> to save a scholarship.</p>));
            return;
        }
        NotificationsService.createScholarshipNotifications(userProfile, scholarship)
            .then(res=> {
                console.log({res});
            });
        this.setState({ isSavedScholarship: !isSavedScholarship });

    };

    render () {
        const { isSavedScholarship } = this.state;
        const { scholarship } = this.props;

        const shareData = [
            {
                icon: faFacebookMessenger,
                name: 'Facebook Messenger',
                url: 'http://www.facebook.com/dialog/send?app_id=401124503672116&link=https://atila.ca/scholarship/'
                    +scholarship.slug+'&redirect_uri=https://atila.ca/'
            },
            {
                icon: faFacebook,
                name: 'Facebook',
                url: 'https://www.facebook.com/sharer.php?display=popup&quote=Check out this scholarship from Atila?: '
                    +scholarship.name+'+&u=https://atila.ca/scholarship/'+scholarship.slug+'&app_id=401124503672116'
            },
            {
                icon: faMailBulk,
                name: 'Email',
                url: 'mailto:?body=Check out this scholarship from Atila%0A%0Ahttps://atila.ca/scholarship/'
                    +scholarship.slug+'&subject=Scholarship From Atila - '+ scholarship.name
            },
            {
                icon: faWhatsapp,
                url: `https://web.whatsapp.com/send?text=https://atila.ca/scholarship/${scholarship.slug}`,
                name: 'WhatsApp'
            },
            {
                icon: faSms,
                url: `sms:?&body=Check out this scholarship from Atila: https://atila.ca/scholarship/${scholarship.slug}`,
                name: 'SMS (android)'
            },
        ];
        return (
            <div className="mb-3 d-inline">
                <Dropdown className="d-inline mx-3">
                    <Dropdown.Toggle variant="outline-primary"
                                     id="dropdown-basic"
                                     title="Share Scholarship">
                        <FontAwesomeIcon className="ml-1" icon={faShareAlt}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-auto">
                        {shareData.map(shareItem => (
                            <Dropdown.Item href={shareItem.url}
                                           key={shareItem.name}
                                           target="_blank"
                                           title={`Share on ${shareItem.name}`}>
                                <FontAwesomeIcon className="ml-1"
                                                 icon={shareItem.icon}/> {' '}
                                {`Share on ${shareItem.name}`}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <OverlayTrigger
                    placement="right-start"
                    delay={{ delay: 250, hide: 400 }}
                    overlay={this.renderTooltip}
                >
                    <button className={`btn ${isSavedScholarship ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={this.saveScholarship}
                            disabled={isSavedScholarship}
                            title={isSavedScholarship?
                                "You've already saved this scholarship 👌🏿": 'Save Scholarship'} >
                        <FontAwesomeIcon className="ml-1" icon={faBookmark}/>
                    </button>
                </OverlayTrigger>
            </div>
        );
    }
}

ScholarshipShareSaveButtons.defaultProps = {
    userProfile: null,
};

ScholarshipShareSaveButtons.propTypes = {
    userProfile: PropTypes.shape({}),
    scholarship: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ScholarshipShareSaveButtons);