import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import loadable from '@loadable/component';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from "react-redux";
import LandingPage from "./scenes/LandingPageOld/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                <div className="App">
                    <ToastContainer />
                    <Navbar />
                    {isLoadingLoggedInUserProfile && <Loading loaderType="beat" title="" style={{ width: 'auto' }}/>}
                    {isFinishedLoadingLoggedInUserProfile &&
                    <React.Fragment>
                        <Route exact path="/" component={LandingPage} />
                        <Route path="/blog" component={Blog} />
                        <Route path="/essay" component={Essay} />
                        <Route path="/scholarship" component={Scholarship} />
                        <Route path="/search" component={Search} />
                        <Route path="/login" component={Login} />
                        <Route path="/verify" component={VerifyAccount} />
                        <Route path="/register" component={Register} />
                        <Route path="/profile" component={UserProfile} />
                        <Route path="/team" component={Team} />
                        <Route path="/terms-and-conditions" component={TermsConditions} />
                        <Route path="/contact" component={ContactUs} />
                        <Route path="/siteMap" component={SiteMap} />
                    </React.Fragment>
                    }
                    <Footer />
                </div>
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
