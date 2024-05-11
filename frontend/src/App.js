import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./hocs/Layout";
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

import './App.css'

const App = () => (
  <Provider store={store}>
    <Router>
      <Layout>
        <Routes>
          {/* <Route exact path="/" element={<Home/>} /> */}
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/reset-password/confirm" element={<ResetPasswordConfirm/>}/>
          {/* <Route path="/activate/:uid/:token" element={<Activate/>} /> */}
        </Routes>
      </Layout>
    </Router>
  </Provider>
);

export default App;
