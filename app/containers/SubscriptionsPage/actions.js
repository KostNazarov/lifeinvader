import * as actionsType from './constants';

export function setInput(value) {
  return {
    type: actionsType.SET_INPUT,
    value,
  };
}
