import { EventTypes } from "redux-segment";

import { API_REQUEST } from "techbikers/middleware/api";
import { getUserById } from "techbikers/selectors/user";

export const IDENTIFY_USER = "IDENTIFY_USER";

export function identifyUser(userId, email, firstName, lastName) {
  return {
    type: IDENTIFY_USER,
    meta: {
      analytics: {
        eventType: EventTypes.identify,
        eventPayload: {
          userId,
          traits: { firstName, lastName, email }
        }
      }
    }
  };
}

export const AUTHENTICATION_REQUEST = "AUTHENTICATION_REQUEST";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";

export function authenticateAs(email, password) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password
    })
  };

  function authenticateApiRequest() {
    return {
      email,
      [API_REQUEST]: {
        endpoint: "/auth/token",
        fetchOptions,
        requestActionType: AUTHENTICATION_REQUEST,
        successActionType: AUTHENTICATION_SUCCESS,
        errorActionType: AUTHENTICATION_FAILURE
      }
    };
  }

  return dispatch => dispatch(authenticateApiRequest(email, password)).then(
    response => {
      if (!response.error) {
        const { userId, firstName, lastName } = response.response;
        dispatch(getUserById(userId));
        dispatch(identifyUser(userId, email, firstName, lastName));
      }
    }
  );
}

export function authenticateWithToken(token, email = null) {
  return {
    type: AUTHENTICATION_SUCCESS,
    email,
    response: { token }
  };
}

export const REFRESH_AUTHENTICATION_REQUEST = "REFRESH_AUTHENTICATION_REQUEST";
export const REFRESH_AUTHENTICATION_SUCCESS = "REFRESH_AUTHENTICATION_SUCCESS";
export const REFRESH_AUTHENTICATION_FAILURE = "REFRESH_AUTHENTICATION_FAILURE";

export function refreshAuthenticationToken(token) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/refresh",
      fetchOptions,
      requestActionType: REFRESH_AUTHENTICATION_REQUEST,
      successActionType: REFRESH_AUTHENTICATION_SUCCESS,
      errorActionType: REFRESH_AUTHENTICATION_FAILURE
    }
  };
}

export const EXCHANGE_AUTHENTICATION_TOKEN_REQUEST = "EXCHANGE_AUTHENTICATION_TOKEN_REQUEST";
export const EXCHANGE_AUTHENTICATION_TOKEN_SUCCESS = "EXCHANGE_AUTHENTICATION_TOKEN_SUCCESS";
export const EXCHANGE_AUTHENTICATION_TOKEN_FAILURE = "EXCHANGE_AUTHENTICATION_TOKEN_FAILURE";

export function exchangeAuthenticationToken(backend, code, state) {
  const fetchOptions = {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ backend, code, state })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/exchange",
      fetchOptions,
      requestActionType: EXCHANGE_AUTHENTICATION_TOKEN_REQUEST,
      successActionType: EXCHANGE_AUTHENTICATION_TOKEN_SUCCESS,
      errorActionType: EXCHANGE_AUTHENTICATION_TOKEN_FAILURE
    }
  };
}

export function changePassword(email, password, newpassword1, newpassword2) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      new_password1: newpassword1, // eslint-disable-line camelcase
      new_password2: newpassword2 // eslint-disable-line camelcase
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/password/change",
      fetchOptions,
      requestActionType: AUTHENTICATION_REQUEST,
      successActionType: AUTHENTICATION_SUCCESS,
      errorActionType: AUTHENTICATION_FAILURE
    }
  };
}

export const BEGIN_PASSWORD_RESET_REQUEST = "BEGIN_PASSWORD_RESET_REQUEST";
export const BEGIN_PASSWORD_RESET_SUCCESS = "BEGIN_PASSWORD_RESET_SUCCESS";
export const BEGIN_PASSWORD_RESET_FAILURE = "BEGIN_PASSWORD_RESET_FAILURE";

export function beginResetPassword(email) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/password/reset",
      fetchOptions,
      requestActionType: BEGIN_PASSWORD_RESET_REQUEST,
      successActionType: BEGIN_PASSWORD_RESET_SUCCESS,
      errorActionType: BEGIN_PASSWORD_RESET_FAILURE
    }
  };
}

export const CONFIRM_PASSWORD_RESET_REQUEST = "CONFIRM_PASSWORD_RESET_REQUEST";
export const CONFIRM_PASSWORD_RESET_SUCCESS = "CONFIRM_PASSWORD_RESET_SUCCESS";
export const CONFIRM_PASSWORD_RESET_FAILURE = "CONFIRM_PASSWORD_RESET_FAILURE";

export function confirmResetPassword(id, token, newpassword1, newpassword2) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: id,
      token,
      new_password1: newpassword1, // eslint-disable-line camelcase
      new_password2: newpassword2 // eslint-disable-line camelcase
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/password/reset/confirm",
      fetchOptions,
      requestActionType: CONFIRM_PASSWORD_RESET_REQUEST,
      successActionType: CONFIRM_PASSWORD_RESET_SUCCESS,
      errorActionType: CONFIRM_PASSWORD_RESET_FAILURE
    }
  };
}

export function confirmResetPasswordAndAuthenticate(id, token, newpassword1, newpassword2) {
  return dispatch => dispatch(confirmResetPassword(id, token, newpassword1, newpassword2)).then(
    ({ response }) => {
      if (response.success) {
        dispatch(authenticateAs(response.email, newpassword1));
      }
    }
  );
}

export const LOGOUT = "LOGOUT";

export function logout() {
  return {
    type: LOGOUT,
    meta: {
      analytics: {
        eventType: EventTypes.track
      }
    }
  };
}