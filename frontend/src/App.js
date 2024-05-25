import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import store from "./store";
import Layout from "./hocs/Layout";
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

import './App.css'


const PrivateRoute = ({ children }) => {
  const { authTokens } = useContext(AuthContext)
  return authTokens ? children : <Navigate to='/login'/>
}


const App = () => (
  <Provider store={store}>
    <Router>
      <Layout>
        <AuthProvider>
          <Routes>
            {/* <Route exact path="/" element={<Home/>} /> */}
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPasswordConfirm/>}
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home/>
                </PrivateRoute>
              }
            />
            {/* <Route path="/activate/:uid/:token" element={<Activate/>} /> */}
          </Routes>
        </AuthProvider>
      </Layout>
    </Router>
  </Provider>
);

export default App;
