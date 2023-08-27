import React from "react";
import LoginPage from "../pages/LoginPage";
import UserSignupPage from "../pages/UserSignupPage";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import Footer from "./Footer";
import {HashRouter as Router, Route, Redirect,Switch} from "react-router-dom";
import TopBar from "./TopBar";
import { useSelector } from "react-redux";
import VerificationRequestsPage from "../pages/VerificationRequestsPage";
import PostViewDetailsPage from "../pages/PostViewDetailsPage";
import HashtagPage from "../pages/HashtagPage";
import ExplorePage from "../pages/ExplorePage";
const App = () => {
  const { isLoggedIn,admin } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    admin: store.admin,
  }));
  return (
    <div>
      <Router>
        {!false &&  <TopBar />}
        
        <Switch>
          <Route exact path="/" component={HomePage} />
          {!isLoggedIn && <Route path="/login" component={LoginPage} />}
          <Route path="/signup" component={UserSignupPage} />
          <Route path="/users/:username" component={UserPage} />
          {isLoggedIn && admin &&(
            <Route path="/verifications/applications" component={VerificationRequestsPage} />
          )}
          <Route path="/explore" component={ExplorePage} />
          <Route path="/post-details/:postId" component={PostViewDetailsPage} />
          <Route path="/hashtags/:hashtagName/posts" component={HashtagPage} />
          <Redirect to="/" />
        </Switch>
        <div>
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default App;
