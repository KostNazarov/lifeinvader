import { createSelector } from 'reselect';

const select = (state) => state.get('PostPage');
const selectAuth = (state) => state.get('auth');

const makeSelectUser = () => createSelector(
  selectAuth,
  (state) => state.get('user'),
);

const makeSelectLoggedIn = () => createSelector(
  selectAuth,
  (state) => state.get('user') != null && state.get('user').uid != null
);

const makeSelectPost = () => createSelector(
  select,
  (state) => state.get('post'),
);

const makeSelectInput = () => createSelector(
  select,
  (state) => state.get('input'),
);

const makeSelectEditCommentModalVisible = () => createSelector(
  select,
  (state) => state.get('editCommentModalVisible'),
);

const makeSelectEditedComment = () => createSelector(
  select,
  (state) => state.get('editedComment'),
);

export {
  makeSelectUser,
  makeSelectLoggedIn,
  makeSelectPost,
  makeSelectInput,
  makeSelectEditCommentModalVisible,
  makeSelectEditedComment,
};
