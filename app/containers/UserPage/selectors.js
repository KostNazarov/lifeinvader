import { createSelector } from 'reselect';

const select = (state) => state.get('UserPage');
const selectAuth = (state) => state.get('auth');

const makeSelectUser = () => createSelector(
  select,
  (state) => state.get('user'),
);

const makeSelectLoggedIn = () => createSelector(
  selectAuth,
  (state) => state.get('user') != null && state.get('user').uid != null
);

const makeSelectPosts = () => createSelector(
  select,
  (state) => state.get('posts'),
);

export {
  makeSelectUser,
  makeSelectLoggedIn,
  makeSelectPosts,
};
