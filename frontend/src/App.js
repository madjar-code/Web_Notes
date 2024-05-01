import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./hocs/Layout";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";

const App = () => (
  <Provider store={store}>
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<Signup/>} />
          <Route exact path="/reset-password" element={<ResetPassword/>} />
          <Route
            exact
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm/>}
          />
          <Route path="/activate/:uid/:token" element={<Activate/>} />
        </Routes>
      </Layout>
    </Router>
  </Provider>
);

export default App;
