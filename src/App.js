import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import loadable from '@loadable/component';
import 'bootstrap/dist/css/bootstrap.css';

import LandingPage from "./scenes/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading";
const Scholarship = loadable(() => import('./scenes/Scholarship/Scholarship'), {
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
const Register = loadable(() => import('./components/Register'), {
    fallback: <Loading />,
});

import { createStore } from 'redux'
import reducer from './redux/reducers'
import {SET_LOGGED_IN_USER_PROFILE} from "./redux/actions";

const store = createStore(reducer);
console.log('store.getState()', store.getState());

store.dispatch({
    type: SET_LOGGED_IN_USER_PROFILE,
    payload: {foo: 'bar'}
});
console.log('store.getState()', store.getState());


function App() {
  return (
      <Router>
        <div className="App">
            <Navbar />
            <Route exact path="/" component={LandingPage} />
            <Route path="/blog" component={Blog} />
            <Route path="/essay" component={Essay} />
            <Route path="/scholarship" component={Scholarship} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/team" component={Team} />
            <Route path="/terms-and-conditions" component={TermsConditions} />
            <Route path="/contact" component={ContactUs} />
            <Route path="/siteMap" component={SiteMap} />
            <Footer />
        </div>
      </Router>
  );
}

export default App;
