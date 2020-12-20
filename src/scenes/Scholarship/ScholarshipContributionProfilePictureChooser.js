import React from "react";
import PropTypes from "prop-types";
import {
    SCHOLARSHIP_CONTRIBUTOR_PROFILE_PICTURES
} from "../../models/Scholarship";
import {Button} from "antd";

class ScholarshipContributionProfilePictureChooser extends React.Component {
    constructor(props) {
        super(props);

        const { contributor } = props;

        this.state = {
            profilePictures: SCHOLARSHIP_CONTRIBUTOR_PROFILE_PICTURES,
            selectedPicture: contributor.profile_pic_url,
        }
    }

    updateSelectedProfilePicture(picture) {
        const { onSelectedPicture } = this.props;
        console.log({picture});
        const syntheticEvent = {
            target: {
                name: "profile_pic_url",
                value: picture,
            }
        };
        onSelectedPicture(syntheticEvent);
    };

    render () {
        const { profilePictures } = this.state;

        return (
            <div className="col-12">
                {profilePictures.map(profilePicture => (
                    <Button onClick={()=> this.updateSelectedProfilePicture(profilePicture)}
                            key={profilePicture}>
                        <img src={profilePicture}
                             alt="Contributor Profile"
                             className="rounded-circle shadow border mt-4"
                              style={{width: "250px"}}/>
                    </Button>
                ))}
            </div>
        )
    }
}


ScholarshipContributionProfilePictureChooser.propTypes = {
    onSelectedPicture: PropTypes.func,
    contributor: PropTypes.shape({}),
};

export default ScholarshipContributionProfilePictureChooser;