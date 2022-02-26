import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import LandingPage from "./scenes/LandingPage/LandingPage";
import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading";

import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import GoogleAnalyticsTracker from "./services/GoogleAnalyticsTracker";
import ScrollToTop from "./components/ScrollToTop";
import LogRocket from "logrocket";
import LogrocketFuzzySanitizer from 'logrocket-fuzzy-search-sanitizer';
import setupLogRocketReact from "logrocket-react";
import Environment from "./services/Environment";
import { MockAPI } from './services/mocks/MockAPI';

import './index.scss';
import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css"; //used for React Notion code syntax higlighting
import "react-toastify/dist/ReactToastify.css";


const Payment = loadable(() => import("./scenes/Payment/Payment"), {
  fallback: <Loading />,
});
const Pricing = loadable(() => import("./scenes/Payment/Pricing"), {
  fallback: <Loading />,
});
const Scholarship = loadable(() => import("./scenes/Scholarship/Scholarship"), {
  fallback: <Loading />,
});
const Application = loadable(() => import("./scenes/Application/Application"), {
  fallback: <Loading />,
});
const Crypto = loadable(() => import("./scenes/Crypto/Crypto"), {
  fallback: <Loading />,
});
const HowToStartAScholarship = loadable(() => import("./scenes/DirectApplicationInfo/HowToStartAScholarship"), {
  fallback: <Loading />,
});
const Wiki = loadable(() => import("./scenes/Wiki/Wiki"), {
  fallback: <Loading />,
});
const HowToApplyForScholarships = loadable(() => import("./scenes/DirectApplicationInfo/HowToApplyForScholarships"), {
  fallback: <Loading />,
});
const SearchAtila = loadable(() => import("./scenes/Search/SearchAtila"), {
  fallback: <Loading />,
});
const Search = loadable(() => import("./scenes/Search/Search"), {
  fallback: <Loading />,
});
const UserProfile = loadable(() => import("./scenes/UserProfile/UserProfile"), {
  fallback: <Loading />,
});
const Blog = loadable(() => import("./scenes/Blog/Blog"), {
  fallback: <Loading />,
});
const Essay = loadable(() => import("./scenes/Essay/Essay"), {
  fallback: <Loading />,
});
const Team = loadable(() => import("./components/Team/Team"), {
  fallback: <Loading />,
});
const Testimonials = loadable(() => import("./components/Testimonials"), {
  fallback: <Loading />,
});
const FinalistsList = loadable(() => import("./components/FinalistsList"), {
  fallback: <Loading />,
});
const BookDemo = loadable(() => import("./components/BookDemo"), {
  fallback: <Loading />,
});
const AtilaPointsRankings = loadable(() => import("./components/AtilaPointsRankings"), {
  fallback: <Loading />,
});
const About = loadable(() => import("./components/About"), {
  fallback: <Loading />,
});
const Rubric = loadable(() => import("./components/Rubric"), {
  fallback: <Loading />,
});
const Admin = loadable(() => import("./scenes/Admin/Admin"), {
  fallback: <Loading />,
});
const Referral = loadable(() => import("./components/Referral"), {
  fallback: <Loading />,
});
const Values = loadable(() => import("./components/Values"), {
  fallback: <Loading/>,
});
const TermsConditions = loadable(() => import("./components/TermsConditions"), {
  fallback: <Loading />,
});
const ScholarshipSponsorAgreement = loadable(() => import("./components/ScholarshipSponsorAgreement"), {
  fallback: <Loading />,
})
const SiteMap = loadable(() => import("./components/SiteMap"), {
  fallback: <Loading />,
});
const ContactUs = loadable(() => import("./components/ContactUs"), {
  fallback: <Loading />,
});
const ContactsNetwork = loadable(() => import("./scenes/Contact/ContactsNetwork"), {
  fallback: <Loading />,
});
const Login = loadable(() => import("./components/Login"), {
  fallback: <Loading />,
});
const VerifyAccount = loadable(() => import("./components/VerifyAccount"), {
  fallback: <Loading />,
});
const Register = loadable(() => import("./components/Register"), {
  fallback: <Loading />,
});

const HighSchool = loadable(() => import("./components/HighSchool"), {
  fallback: <Loading />,
});
const Ebook = loadable(() => import("./scenes/Ebook/Ebook"), {
  fallback: <Loading />,
});
const EbookPremium = loadable(() => import("./scenes/EbookPremium/EbookPremium"), {
  fallback: <Loading />,

});
const Resources = loadable(() => import("./scenes/Resources/Resources"), {
  fallback: <Loading />,

});

const privateFieldNames = [
  'password',
  'security_question_answer',
];

const { requestSanitizer, responseSanitizer } = LogrocketFuzzySanitizer.setup(privateFieldNames);
class App extends React.Component {
  constructor(props) {
    super(props);
    let mockApi = new MockAPI();
    if (mockApi.mock) {
      mockApi.initializeMocks();
    }
    if (process.env.NODE_ENV !== "test" &&
        !navigator.userAgent.includes('https://github.com/prerender/prerender')) {
      // TODO: mock LogRocket.init and setupLogRocketReact and all uses of LogRocket in Navbar.js and Register.js
      const logRocketAppId = `guufgl/atila-${Environment.name}`;
      LogRocket.init(logRocketAppId, {
        network: {
          requestSanitizer,
          responseSanitizer
        }
      });

      setupLogRocketReact(LogRocket);
    }
  }

  render() {
    const {
      isLoadingLoggedInUserProfile,
      isFinishedLoadingLoggedInUserProfile,
    } = this.props;

    return (
      <Router>
        <ScrollToTop />
        <div className='App'>
          <ToastContainer />
          <Navbar />
          {isLoadingLoggedInUserProfile && (
            <Loading loaderType='beat' title='' style={{ width: "auto" }} />
          )}
          {isFinishedLoadingLoggedInUserProfile && (
            <Switch>
              <Route
                exact
                path='/'
                component={GoogleAnalyticsTracker(LandingPage)}
              />
              <Route path='/blog' component={GoogleAnalyticsTracker(Blog)} />
              <Route path='/essay' component={GoogleAnalyticsTracker(Essay)} />
              <Route
                path='/scholarship'
                component={GoogleAnalyticsTracker(Scholarship)}
              />
              <Route
                path='/application'
                component={GoogleAnalyticsTracker(Application)}
              />
              <Route
                path='/start'
                component={GoogleAnalyticsTracker(HowToStartAScholarship)}
              />
              <Route
                path='/apply'
                component={GoogleAnalyticsTracker(HowToApplyForScholarships)}
              />
              <Route
                path='/wiki/:pageId'
                component={GoogleAnalyticsTracker(Wiki)}
              />
              <Route path='/crypto' component={GoogleAnalyticsTracker(Crypto)} />
              <Route path='/crypto/:action' component={GoogleAnalyticsTracker(Crypto)} />
              <Route
                path='/search-old'
                component={GoogleAnalyticsTracker(SearchAtila)}
              />
              <Route
                path='/search'
                component={GoogleAnalyticsTracker(Search)}
              />
              <Redirect from="/s/:query" to="/search?query=:query" />
              <Redirect from="/s" to="/search" />
              <Route path='/login' component={GoogleAnalyticsTracker(Login)} />
              <Route
                path='/pricing'
                component={GoogleAnalyticsTracker(Pricing)}
              />
              <Route
                path='/payment'
                component={GoogleAnalyticsTracker(Payment)}
              />
              <Route
                path='/verify'
                component={GoogleAnalyticsTracker(VerifyAccount)}
              />
              <Route
                path='/register'
                component={GoogleAnalyticsTracker(Register)}
              />
              <Route
                path='/profile'
                component={GoogleAnalyticsTracker(UserProfile)}
              />
              <Route
                path='/high-school'
                component={GoogleAnalyticsTracker(HighSchool)}
              />
              <Route
                  path='/highschool'
                  component={GoogleAnalyticsTracker(HighSchool)}
              />
              <Route
                  path='/demo'
                  component={GoogleAnalyticsTracker(BookDemo)}
              />
              <Route
                  path='/schools/premium'
                  component={GoogleAnalyticsTracker(EbookPremium)}
              />
              <Route
                path='/schools'
                component={GoogleAnalyticsTracker(Ebook)}
              />
              <Route path='/team' component={GoogleAnalyticsTracker(Team)} />
              <Route path='/testimonials' component={GoogleAnalyticsTracker(Testimonials)} />
              <Route path='/about' component={GoogleAnalyticsTracker(About)} />
              <Route path='/rubric' component={GoogleAnalyticsTracker(Rubric)} />
              <Route path='/admin' component={GoogleAnalyticsTracker(Admin)} />
              <Route path='/values' component={GoogleAnalyticsTracker(Values)} />
              <Route path='/finalists' component={GoogleAnalyticsTracker(FinalistsList)} />
              <Route path='/rankings' component={GoogleAnalyticsTracker(AtilaPointsRankings)} />
              <Route path='/students' component={GoogleAnalyticsTracker(Resources)} />
              <Redirect from="/student" to="/students" />
              <Redirect from="/points" to="/blog/tomiwa/atila-points" />
              <Route
                path='/terms-and-conditions'
                component={GoogleAnalyticsTracker(TermsConditions)}
              />
              <Route
                  path='/scholarship-sponsor-agreement'
                  component={GoogleAnalyticsTracker(ScholarshipSponsorAgreement)}
              />
              <Route
                path='/contact'
                component={GoogleAnalyticsTracker(ContactUs)}
              />
              <Route
                path='/clubs'
                component={GoogleAnalyticsTracker(ContactsNetwork)}
              />
              <Route
                path='/siteMap'
                component={GoogleAnalyticsTracker(SiteMap)}
              />
              <Route path='/j/:referredByUsername?' component={GoogleAnalyticsTracker(Referral)} />
            </Switch>
          )}
          <Footer />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    ui: {
      user: {
        isLoadingLoggedInUserProfile,
        isFinishedLoadingLoggedInUserProfile,
      },
    },
  } = state;

  return {
    isLoadingLoggedInUserProfile,
    isFinishedLoadingLoggedInUserProfile,
  };
};

export default connect(mapStateToProps)(App);
