import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

import LandingPage from "./scenes/LandingPage/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Blog from "./scenes/Blog/Blog";
import Scholarship from "./scenes/Scholarship/Scholarship";
import Essay from "./scenes/Essay/Essay";


function App() {
  return (
      <Router>
        <div className="App">
            <Navbar />
            <Route exact path="/" component={LandingPage} />
            <Route path="/blog" component={Blog} />
            <Route path="/essay" component={Essay} />
            <Route path="/scholarship" component={Scholarship} />
            <Footer />
        </div>
      </Router>
  );
}

export default App;
