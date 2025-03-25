import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
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
import ContentDetail from './components/ContentDetail/ContentDetail';
import ContentAddEdit from './components/ContentAddEdit/ContentAddEdit';
import BlogsApi from './services/BlogsAPI';
import EssaysApi from './services/EssaysAPI';

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
const CollectionDetail = loadable(() => import("./scenes/Collection/CollectionDetail"), {
  fallback: <Loading />,
});
const Atlas = loadable(() => import("./scenes/Atlas/Atlas"), {
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
const Mentorship = loadable(() => import("./scenes/Mentorship/Mentorship"), {
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
            <Routes>
              <Route
                path='/'
                element={<GoogleAnalyticsTracker><LandingPage /></GoogleAnalyticsTracker>}
              />
              <Route path='/mentorship/*' element={<GoogleAnalyticsTracker><Mentorship /></GoogleAnalyticsTracker>} />
              <Route path="/m/:mentorUsername" element={<Navigate to="/mentorship/session/new/:mentorUsername/?j=:mentorUsername" replace />} />
              <Route path='/blog/*' element={<GoogleAnalyticsTracker><Blog /></GoogleAnalyticsTracker>} />
              <Route path='/essay/*' element={<GoogleAnalyticsTracker><Essay /></GoogleAnalyticsTracker>} />
              <Route
                path='/scholarship/*'
                element={<GoogleAnalyticsTracker><Scholarship /></GoogleAnalyticsTracker>}
              />
              <Route
                path='/application/*'
                element={<GoogleAnalyticsTracker><Application /></GoogleAnalyticsTracker>}
              />
              <Route
                path='/start'
                element={<GoogleAnalyticsTracker><HowToStartAScholarship /></GoogleAnalyticsTracker>}
              />
              <Route
                path='/apply'
                element={<GoogleAnalyticsTracker><HowToApplyForScholarships /></GoogleAnalyticsTracker>}
              />
              <Route
                path='/wiki/:pageId'
                element={<GoogleAnalyticsTracker><Wiki /></GoogleAnalyticsTracker>}
              />
              <Route path='/crypto/:action' element={<GoogleAnalyticsTracker><Crypto /></GoogleAnalyticsTracker>} />
              <Route path='/crypto' element={<GoogleAnalyticsTracker><Crypto /></GoogleAnalyticsTracker>} />
              <Route path='/collection/:slug' element={<GoogleAnalyticsTracker><CollectionDetail /></GoogleAnalyticsTracker>} />
              <Route path='/atlas' element={<GoogleAnalyticsTracker><Atlas /></GoogleAnalyticsTracker>} />
              <Route
                path='/search-old'
                element={<GoogleAnalyticsTracker><SearchAtila /></GoogleAnalyticsTracker>}
              />
              <Route
                path='/search'
                element={<GoogleAnalyticsTracker><Search /></GoogleAnalyticsTracker>}
              />
              <Route path="/s/:query" element={<Navigate to="/search?query=:query" replace />} />
              <Route path="/s" element={<Navigate to="/search" replace />} />
              <Route path='/login' element={<GoogleAnalyticsTracker><Login /></GoogleAnalyticsTracker>} />
              <Route path='/pricing' element={<GoogleAnalyticsTracker><Pricing /></GoogleAnalyticsTracker>} />
              <Route path='/payment' element={<GoogleAnalyticsTracker><Payment /></GoogleAnalyticsTracker>} />
              <Route path='/verify' element={<GoogleAnalyticsTracker><VerifyAccount /></GoogleAnalyticsTracker>} />
              <Route path='/register' element={<GoogleAnalyticsTracker><Register /></GoogleAnalyticsTracker>} />
              <Route path='/profile/*' element={<GoogleAnalyticsTracker><UserProfile /></GoogleAnalyticsTracker>} />
              <Route path='/high-school' element={<GoogleAnalyticsTracker><HighSchool /></GoogleAnalyticsTracker>} />
              <Route path='/highschool' element={<GoogleAnalyticsTracker><HighSchool /></GoogleAnalyticsTracker>} />
              <Route path='/demo' element={<GoogleAnalyticsTracker><BookDemo /></GoogleAnalyticsTracker>} />
              <Route path='/schools/premium' element={<GoogleAnalyticsTracker><EbookPremium /></GoogleAnalyticsTracker>} />
              <Route path='/schools' element={<GoogleAnalyticsTracker><Ebook /></GoogleAnalyticsTracker>} />
              <Route path='/team' element={<GoogleAnalyticsTracker><Team /></GoogleAnalyticsTracker>} />
              <Route path='/testimonials' element={<GoogleAnalyticsTracker><Testimonials /></GoogleAnalyticsTracker>} />
              <Route path='/about' element={<GoogleAnalyticsTracker><About /></GoogleAnalyticsTracker>} />
              <Route path='/rubric' element={<GoogleAnalyticsTracker><Rubric /></GoogleAnalyticsTracker>} />
              <Route path='/admin/*' element={<GoogleAnalyticsTracker><Admin /></GoogleAnalyticsTracker>} />
              <Route path='/values' element={<GoogleAnalyticsTracker><Values /></GoogleAnalyticsTracker>} />
              <Route path='/finalists' element={<GoogleAnalyticsTracker><FinalistsList /></GoogleAnalyticsTracker>} />
              <Route path='/rankings' element={<GoogleAnalyticsTracker><AtilaPointsRankings /></GoogleAnalyticsTracker>} />
              <Route path='/resources' element={<GoogleAnalyticsTracker><Resources /></GoogleAnalyticsTracker>} />
              <Route path="/student" element={<Navigate to="/resources" replace />} />
              <Route path="/students" element={<Navigate to="/resources" replace />} />
              <Route path="/points" element={<Navigate to="/blog/tomiwa/atila-points" replace />} />
              <Route path='/terms-and-conditions' element={<GoogleAnalyticsTracker><TermsConditions /></GoogleAnalyticsTracker>} />
              <Route path='/scholarship-sponsor-agreement' element={<GoogleAnalyticsTracker><ScholarshipSponsorAgreement /></GoogleAnalyticsTracker>} />
              <Route path='/contact' element={<GoogleAnalyticsTracker><ContactUs /></GoogleAnalyticsTracker>} />
              <Route path='/clubs' element={<GoogleAnalyticsTracker><ContactsNetwork /></GoogleAnalyticsTracker>} />
              <Route path='/siteMap' element={<GoogleAnalyticsTracker><SiteMap /></GoogleAnalyticsTracker>} />
              <Route path='/j/:referredByUsername?' element={<GoogleAnalyticsTracker><Referral /></GoogleAnalyticsTracker>} />
              <Route path="/blog/:slug" element={
                <GoogleAnalyticsTracker>
                  <ContentDetail contentType="Blog" ContentAPI={BlogsApi} />
                </GoogleAnalyticsTracker>
              } />
              <Route path="/blog/create" element={
                <GoogleAnalyticsTracker>
                  <ContentAddEdit contentType="Blog" />
                </GoogleAnalyticsTracker>
              } />
              <Route path="/blog/edit/:slug" element={
                <GoogleAnalyticsTracker>
                  <ContentAddEdit contentType="Blog" />
                </GoogleAnalyticsTracker>
              } />
              <Route path="/essay/:slug" element={
                <GoogleAnalyticsTracker>
                  <ContentDetail contentType="Essay" ContentAPI={EssaysApi} />
                </GoogleAnalyticsTracker>
              } />
              <Route path="/essay/create" element={
                <GoogleAnalyticsTracker>
                  <ContentAddEdit contentType="Essay" />
                </GoogleAnalyticsTracker>
              } />
              <Route path="/essay/edit/:slug" element={
                <GoogleAnalyticsTracker>
                  <ContentAddEdit contentType="Essay" />
                </GoogleAnalyticsTracker>
              } />
              <Route path="/blog" element={<Navigate to="/" replace />} />
              <Route path="/essay" element={<Navigate to="/" replace />} />
            </Routes>
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
