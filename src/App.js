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
                element={<LandingPage />}
              />
              <Route path='/mentorship/*' element={<Mentorship />} />
              <Route path="/m/:mentorUsername" element={<Navigate to="/mentorship/session/new/:mentorUsername/?j=:mentorUsername" replace />} />
              <Route path='/blog/*' element={<Blog />} />
              <Route path='/essay/*' element={<Essay />} />
              <Route
                path='/scholarship/*'
                element={<Scholarship />}
              />
              <Route
                path='/application/*'
                element={<Application />}
              />
              <Route
                path='/start'
                element={<HowToStartAScholarship />}
              />
              <Route
                path='/apply'
                element={<HowToApplyForScholarships />}
              />
              <Route path='/crypto/:action' element={<Crypto />} />
              <Route path='/crypto' element={<Crypto />} />
              <Route path='/collection/:slug' element={<CollectionDetail />} />
              <Route path='/atlas' element={<Atlas />} />
              <Route
                path='/search-old'
                element={<SearchAtila />}
              />
              <Route
                path='/search'
                element={<Search />}
              />
              <Route path="/s/:query" element={<Navigate to="/search?query=:query" replace />} />
              <Route path="/s" element={<Navigate to="/search" replace />} />
              <Route path='/login' element={<Login />} />
              <Route path='/pricing' element={<Pricing />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/verify' element={<VerifyAccount />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile/*' element={<UserProfile />} />
              <Route path='/high-school' element={<HighSchool />} />
              <Route path='/highschool' element={<HighSchool />} />
              <Route path='/demo' element={<BookDemo />} />
              <Route path='/schools/premium' element={<EbookPremium />} />
              <Route path='/schools' element={<Ebook />} />
              <Route path='/testimonials' element={<Testimonials />} />
              <Route path='/rubric' element={<Rubric />} />
              <Route path='/admin/*' element={<Admin />} />
              <Route path='/values' element={<Values />} />
              <Route path='/finalists' element={<FinalistsList />} />
              <Route path='/rankings' element={<AtilaPointsRankings />} />
              <Route path='/resources' element={<Resources />} />
              <Route path="/student" element={<Navigate to="/resources" replace />} />
              <Route path="/students" element={<Navigate to="/resources" replace />} />
              <Route path="/points" element={<Navigate to="/blog/tomiwa/atila-points" replace />} />
              <Route path='/terms-and-conditions' element={<TermsConditions />} />
              <Route path='/scholarship-sponsor-agreement' element={<ScholarshipSponsorAgreement />} />
              <Route path='/contact' element={<ContactUs />} />
              <Route path='/clubs' element={<ContactsNetwork />} />
              <Route path='/siteMap' element={<SiteMap />} />
              <Route path='/j/:referredByUsername?' element={<Referral />} />
              <Route path="/blog/:slug" element={
                  <ContentDetail contentType="Blog" ContentAPI={BlogsApi} />
              } />
              <Route path="/blog/create" element={
                  <ContentAddEdit contentType="Blog" />
              } />
              <Route path="/blog/edit/:slug" element={
                  <ContentAddEdit contentType="Blog" />
              } />
              <Route path="/essay/:slug" element={
                  <ContentDetail contentType="Essay" ContentAPI={EssaysApi} />
              } />
              <Route path="/essay/create" element={
                  <ContentAddEdit contentType="Essay" />
              } />
              <Route path="/essay/edit/:slug" element={
                  <ContentAddEdit contentType="Essay" />
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
