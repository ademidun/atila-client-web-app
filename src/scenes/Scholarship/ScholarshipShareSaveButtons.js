import React from 'react';
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark, faShareAlt} from "@fortawesome/free-solid-svg-icons";

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

        return (
            <React.Fragment>
                <Dropdown className="d-inline mx-1">
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                        <FontAwesomeIcon className="cursor-pointer ml-1" icon={faShareAlt}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
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
    userProfile: PropTypes.shape({})
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ScholarshipShareSaveButtons);