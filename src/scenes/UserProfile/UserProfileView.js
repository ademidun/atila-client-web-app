import React from 'react';
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";

class UserProfileView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: null,
            errorGettingUserProfile: null,
            isLoadingUserProfile: false,
        }
    }

    componentDidMount() {
        this.loadContent();
    }
    componentDidUpdate(prevProps, prevState) {
        const { userProfile, errorGettingUserProfile } = this.state;
        if (userProfile === null && !errorGettingUserProfile) {
            this.loadContent();
        }
    }

    loadContent = () => {
        const { match : { params : { username }} } = this.props;
        UserProfileAPI.getUsername(username)
            .then(res => {
                console.log({ res });
                this.setState({userProfile: res.data});

            })
            .catch(err => {
                this.setState({errorGettingUserProfile: { err }});
            })
            .finally(() => {
                this.setState({ isLoadingUserProfile: false });
            });
    }

    render () {
        const { match : { params : { username }} } = this.props;
        const { errorGettingUserProfile, isLoadingUserProfile, userProfile } = this.state;

        if (errorGettingUserProfile) {
            return (
                <div className="text-center">
                    <h1>Error Getting User Profile.</h1>
                    <h3>
                        Please try again later
                    </h3>
                </div>);
        }

        if (!userProfile) {
            return (
                <Loading
                    isLoading={isLoadingUserProfile}
                    title={'Loading User Profile..'} />)
        }

        return (
            <div className="text-center container mt-3">
                <div className="card shadow">
                    <h1>View Profile for { username }</h1>
                    {JSON.stringify(userProfile)}
                </div>
            </div>
        );
    }
}

export default UserProfileView;
