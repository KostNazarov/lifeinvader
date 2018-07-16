import * as actionTypes from './constants';

export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user,
  };
}

export function loggedOut(user) {
  return {
    type: actionTypes.LOGGED_OUT,
    user,
  };
}

export function logout() {
  return {
    type: actionTypes.LOGOUT,
  };
}

export function updatePhoto(url) {
  return {
    type: actionTypes.UPDATE_PHOTO,
    url,
  };
}

export function updateNickname(displayName) {
  return {
    type: actionTypes.UPDATE_NICKNAME,
    displayName,
  };
}


export function setSubscriptions(subscriptions) {
  return {
    type: actionTypes.SET_SUBSCRIPTIONS,
    subscriptions,
  };
}

export function loadSubscriptions(uid) {
  return {
    type: actionTypes.LOAD_SUBSCRIPTIONS,
    uid,
  };
}

export function addSubscription(subscription) {
  return {
    type: actionTypes.ADD_SUBSCRIPTION,
    subscription,
  };
}

export function removeSubscription(subscription) {
  return {
    type: actionTypes.REMOVE_SUBSCRIPTION,
    subscription,
  };
}

export function setSubinfo(info) {
  return {
    type: actionTypes.SET_SUBINFO,
    info,
  };
}

export function setStatus(status) {
  return {
    type: actionTypes.SET_STATUS,
    status,
  };
}

export function setError(error) {
  return {
    type: actionTypes.SET_ERROR,
    error,
  };
}
