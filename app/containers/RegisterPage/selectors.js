import { createSelector } from 'reselect';

const select = (state) => state.get('RegisterPage');

const makeSelectEmail = () => createSelector(
  select,
  (state) => state.get('email'),
);

const makeSelectPassword = () => createSelector(
  select,
  (state) => state.get('password'),
);

const makeSelectConfirmPassword = () => createSelector(
  select,
  (state) => state.get('confirmPassword'),
);

const makeSelectKey = () => createSelector(
  select,
  (state) => state.get('key'),
);

export {
  select,
  makeSelectEmail,
  makeSelectPassword,
  makeSelectConfirmPassword,
  makeSelectKey,
};
