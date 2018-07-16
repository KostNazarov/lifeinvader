import { createSelector } from 'reselect';

const selectRoute = (state) => state.get('route');
const selectAuth = (state) => state.get('auth');

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectUser = () => createSelector(
  selectAuth,
  (state) => state.get('user'),
);

const makeSelectLoggedIn = () => createSelector(
  selectAuth,
  (state) => state.get('user') != null && state.get('user').uid != null,
);

const makeSelectSubscriptions = () => createSelector(
  selectAuth,
  (state) => state.get('subscriptions'),
);

const makeSelectError = () => createSelector(
  selectAuth,
  (state) => state.get('error'),
);

export {
  selectAuth,
  makeSelectLocation,
  makeSelectUser,
  makeSelectLoggedIn,
  makeSelectSubscriptions,
  makeSelectError,
};
