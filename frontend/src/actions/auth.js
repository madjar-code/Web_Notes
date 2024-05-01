import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  LOGOUT,
} from "./types";

const API_PREFIX = 'http://localhost:8000'

export const load_user = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    try {
      const me_api_url = `${API_PREFIX}/auth/users/me/`;
      const result = await axios.get(me_api_url, config);

      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: result.data,
      });
    } catch (error) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const login_api_url = `${API_PREFIX}/auth/jwt/create/`;
    const result = await axios.post(login_api_url, body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });

    dispatch(load_user());
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const checkAuthenticated = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const body = JSON.stringify({ token: localStorage.getItem("access") });

    try {
      const verify_api_url = `${API_PREFIX}/auth/jwt/verify`;
      const response = await axios.post(verify_api_url, body, config);

      if (response.data.code == "token_not_valid") {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });
      }
    } catch (error) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

export const signup =
  (first_name, last_name, email, password, re_password) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      re_password,
    });

    try {
      const create_user_api_url = `${API_PREFIX}/auth/users/`;
      const response = await axios.post(create_user_api_url, body, config);

      dispatch({
        type: SIGNUP_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      dispatch({
        type: SIGNUP_FAIL,
      });
    }
  };

export const verify = (uid, token) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token });

  try {
    const activation_api_url = `${API_PREFIX}/auth/users/activation/`;
    await axios.post(activation_api_url, body, config);

    dispatch({
      type: ACTIVATION_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
  }
};

export const reset_password = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email });

  try {
    const reset_password_api_url = `${API_PREFIX}/auth/users/reset_password/`;
    console.log(reset_password_api_url)
    await axios.post(reset_password_api_url, body, config);

    dispatch({
      type: PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
    });
  }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token, new_password, re_new_password });

  try {
    const reset_password_confirm_api_url = `${API_PREFIX}/auth/users/reset_password_confirm/`;
    await axios.post(reset_password_confirm_api_url, body, config);

    dispatch({
      type: PASSWORD_RESET_CONFIRM_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: PASSWORD_RESET_CONFIRM_FAIL,
    });
  }
};

export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
};