import * as actionsType from './constants';

export function setEmail(email) {
  return {
    type: actionsType.SET_EMAIL,
    email,
  };
}

export function setPassword(password) {
  return {
    type: actionsType.SET_PASSWORD,
    password,
  };
}

export function setConfirmPassword(confirmPassword) {
  return {
    type: actionsType.SET_CONFIRM_PASSWORD,
    confirmPassword,
  };
}

export function register(key, email, password) {
  return {
    type: actionsType.REGISTER,
    key,
    email,
    password,
  };
}

export function setKey(key) {
  return {
    type: actionsType.SET_KEY,
    key,
  };
}
