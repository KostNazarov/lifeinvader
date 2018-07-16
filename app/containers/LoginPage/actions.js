import * as actionTypes from './constants';

export function setEmail(email) {
  return {
    type: actionTypes.SET_EMAIL,
    email,
  };
}

export function setPassword(password) {
  return {
    type: actionTypes.SET_PASSWORD,
    password,
  };
}

export function login(email, password) {
  return {
    type: actionTypes.LOGIN,
    email,
    password,
  };
}
