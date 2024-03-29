import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { Spin, Alert } from 'antd';
import { getErrorMessage } from "../services/utils";
import UserProfileAPI from '../services/UserProfileAPI';
import { UserProfilePreview } from "./ReferredByInput";
import defaultSeoContent from './HelmetSeo';
import HelmetSeo from "./HelmetSeo";
import { AtilaPointsPopover } from '../scenes/UserProfile/UserProfileReferralManagement';


class AtilaPointsRankings extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
            userProfiles: [],
            atilaPointsDetail: {}, 
            isLoading: null,
            requestError: "",
            showReferredUsers: false,
            showAtilaPointsDetail: false,
        }
      }

      componentDidMount() {
            this.getReferredUsers();
      }
    
      getReferredUsers = () => {
        this.setState({isLoading: "Loading Rankings..."});

        

        UserProfileAPI.list('atila-points/rankings')
        .then(res => {
            const { user_profiles: userProfiles } = res.data;
            this.setState({ userProfiles });
        })
        .catch(err => {
            console.log({err});
            this.setState({ requestError: getErrorMessage(err) });
        })
        .finally(() => {
            this.setState({isLoading: false});
        });
      };

      render() {

        const {  isLoading, requestError, userProfiles } = this.state;
        
        const subtitle = (
            <h3 className="text-center text-muted">
                Top students with the most {' '}
                <AtilaPointsPopover children={<Link to="/points">Atila Points</Link>} />
            </h3>
        )
        const seoContent = {
            ...defaultSeoContent,
            title: 'Atila Rankings',
            description: 'Top students with the most Atila Points.',
        };

        let userProfilesContent = <tr>
            <td>
            No UserProfiles found
            </td>
        </tr>;

        if (userProfiles) {
            userProfilesContent = (<>
            {userProfiles.map((userProfile, index) => (
                        <tr key={userProfile.username}>
                        <th scope="row">
                            <Link to={`/profile/${userProfile.username}`} style={{display: "block"}}>
                            {index+1}
                            </Link>
                        </th>
                        <td>
                            <Link to={`/profile/${userProfile.username}`} style={{display: "block"}}>
                            <UserProfilePreview userProfile={userProfile} />
                            </Link>
                        </td>
                        <td className="font-weight-bold">
                            <Link to={`/profile/${userProfile.username}`} style={{display: "block"}}>
                                {parseInt( userProfile.atila_points ).toLocaleString()}
                            </Link>
                        </td>
                        </tr>
                    ))}
            </>
            )
        }


        
        return (
            <div className="container p-2 mt-3">
                <HelmetSeo content={seoContent}/>
                <div className="mb-3">
                    <h1>Atila Rankings</h1>
                    {subtitle}
                </div>
                {isLoading && 
                    <div>
                        {isLoading}
                        <Spin />
                    </div>
                }
                <table className="table table-hover col-12">
                <thead style={{"backgroundColor": "aliceblue"}}>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Atila Points</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 
                        Set the style display: "block" to make the entire table cell clickable.
                        To make it easier for the users.
                    */}
                    {userProfilesContent}
                </tbody>
                </table>
                {requestError &&
                    <div className="my-2">
                        Error: <br/>
                        <Alert
                            type="error"
                            message={requestError}
                            style={{maxWidth: '300px'}}
                        />
                    </div>
                }
          </div>
        )

      }
    

}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(AtilaPointsRankings);