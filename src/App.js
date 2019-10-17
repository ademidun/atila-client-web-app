import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Analytics from 'react-router-ga';
import loadable from '@loadable/component';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from "react-redux";
import LandingPage from "./scenes/LandingPage/LandingPage";
import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar/Navbar";
import GoogleAnalyticsTracker from "./services/GoogleAnalyticsTracker";

const Scholarship = loadable(() => import('./scenes/Scholarship/Scholarship'), {
    fallback: <Loading />,
});
const Search = loadable(() => import('./scenes/Search/Search'), {
    fallback: <Loading />,
});
const UserProfile = loadable(() => import('./scenes/UserProfile/UserProfile'), {
    fallback: <Loading />,
});
const Blog = loadable(() => import('./scenes/Blog/Blog'), {
    fallback: <Loading />,
});
const Essay = loadable(() => import('./scenes/Essay/Essay'), {
    fallback: <Loading />,
});
const Team = loadable(() => import('./components/Team/Team'), {
    fallback: <Loading />,
});
const TermsConditions = loadable(() => import('./components/TermsConditions'), {
    fallback: <Loading />,
});
const SiteMap = loadable(() => import('./components/SiteMap'), {
    fallback: <Loading />,
});
const ContactUs = loadable(() => import('./components/ContactUs'), {
    fallback: <Loading />,
});
const Login = loadable(() => import('./components/Login'), {
    fallback: <Loading />,
});
const VerifyAccount = loadable(() => import('./components/VerifyAccount'), {
    fallback: <Loading />,
});
const Register = loadable(() => import('./components/Register'), {
    fallback: <Loading />,
});


function App(props) {
    const {
        isLoadingLoggedInUserProfile,
        isFinishedLoadingLoggedInUserProfile,
    } = props;

    return (
            <Router>
                <Analytics  id="UA-110656912-1" debug={true}>
                <div className="App">
                    <ToastContainer />
                    <Navbar />
                    {isLoadingLoggedInUserProfile &&
                    <Loading loaderType="beat" title="" style={{ width: 'auto' }}/>}
                    {isFinishedLoadingLoggedInUserProfile &&
                    <React.Fragment>
                        <Route exact path="/" component={GoogleAnalyticsTracker(LandingPage)} />
                        <Route path="/blog" component={GoogleAnalyticsTracker(Blog)} />
                        <Route path="/essay" component={GoogleAnalyticsTracker(Essay)} />
                        <Route path="/scholarship" component={GoogleAnalyticsTracker(Scholarship)} />
                        <Route path="/search" component={GoogleAnalyticsTracker(Search)} />
                        <Route path="/login" component={GoogleAnalyticsTracker(Login)} />
                        <Route path="/verify" component={GoogleAnalyticsTracker(VerifyAccount)} />
                        <Route path="/register" component={GoogleAnalyticsTracker(Register)} />
                        <Route path="/profile" component={GoogleAnalyticsTracker(UserProfile)} />
                        <Route path="/team" component={GoogleAnalyticsTracker(Team)} />
                        <Route path="/terms-and-conditions" component={GoogleAnalyticsTracker(TermsConditions)} />
                        <Route path="/contact" component={GoogleAnalyticsTracker(ContactUs)} />
                        <Route path="/siteMap" component={GoogleAnalyticsTracker(SiteMap)} />
                    </React.Fragment>
                    }
                    <Footer />
                </div>
                </Analytics>
            </Router>
    );
}

const mapStateToProps = state => {
    const { ui :{
        user : {
            isLoadingLoggedInUserProfile,
            isFinishedLoadingLoggedInUserProfile,
        }
    }
    } = state;

    return {
        isLoadingLoggedInUserProfile,
        isFinishedLoadingLoggedInUserProfile,
    }
};

export default connect(mapStateToProps)(App);
