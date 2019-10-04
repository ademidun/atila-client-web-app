import React from 'react';
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark, faShareAlt, faMailBulk, faSms} from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger, faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';

class ScholarshipShareSaveButtons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSavedScholarship: false
        }
    }

    saveScholarship = (event) => {
        event.preventDefault();
        const { isSavedScholarship } = this.state;
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
            <React.Fragment>
                <Dropdown className="d-inline mx-1">
                    <Dropdown.Toggle variant="outline-primary"
                                     id="dropdown-basic"
                                     title="Share Scholarship">
                        <FontAwesomeIcon className="cursor-pointer ml-1" icon={faShareAlt}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-auto">
                        {shareData.map(shareItem => (
                            <Dropdown.Item href={shareItem.url}
                                           key={shareItem.name}
                                           target="_blank"
                                           title={`Share on ${shareItem.name}`}>
                                <FontAwesomeIcon className="cursor-pointer ml-1"
                                                 icon={shareItem.icon}/> {' '}
                                {`Share on ${shareItem.name}`}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <button className={`btn ${isSavedScholarship ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={this.saveScholarship}
                        title="Save Scholarship" >
                    <FontAwesomeIcon className="cursor-pointer ml-1" icon={faBookmark}/>
                </button>
            </React.Fragment>
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