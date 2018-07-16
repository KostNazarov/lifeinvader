import * as actionsType from './constants';

export function setInput(value) {
  return {
    type: actionsType.SET_INPUT,
    value,
  };
}

export function setFilter(filter) {
  return {
    type: actionsType.SET_FILTER,
    filter,
  };
}

export function setUsers(users) {
  return {
    type: actionsType.SET_USERS,
    users,
  };
}

export function loadUsers() {
  return {
    type: actionsType.LOAD_USERS,
  };
}
