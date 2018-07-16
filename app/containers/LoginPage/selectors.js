import { createSelector } from 'reselect';

const select = (state) => state.get('LoginPage');

const makeSelectEmail = () => createSelector(
  select,
  (state) => state.get('email'),
);

const makeSelectPassword = () => createSelector(
  select,
  (state) => state.get('password'),
);

export {
  select,
  makeSelectEmail,
  makeSelectPassword,
};
