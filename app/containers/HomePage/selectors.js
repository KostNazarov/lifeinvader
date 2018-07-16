import { createSelector } from 'reselect';

const select = (state) => state.get('HomePage');
const selectAuth = (state) => state.get('auth');

const makeSelectPhoto = () => createSelector(
  selectAuth,
  (state) => state.get('user').photoURL,
);

const makeSelectPosts = () => createSelector(
  select,
  (state) => state.get('posts'),
);

const makeSelectUser = () => createSelector(
  selectAuth,
  (state) => state.get('user'),
);

const makeSelectInput = () => createSelector(
  select,
  (state) => state.get('input'),
);

const makeSelectPhotoVisible = () => createSelector(
  select,
  (state) => state.get('photoModalVisible'),
);

const makeSelectNicknameVisible = () => createSelector(
  select,
  (state) => state.get('nicknameModalVisible'),
);

const makeSelectPostModalVisible = () => createSelector(
  select,
  (state) => state.get('postModalVisible'),
);

const makeSelectStatusModalVisible = () => createSelector(
  select,
  (state) => state.get('statusModalVisible'),
);

const makeSelectEditedPost = () => createSelector(
  select,
  (state) => state.get('editedPost'),
);

export {
  makeSelectUser,
  makeSelectPhoto,
  makeSelectPosts,
  makeSelectInput,
  makeSelectPhotoVisible,
  makeSelectNicknameVisible,
  makeSelectPostModalVisible,
  makeSelectStatusModalVisible,
  makeSelectEditedPost,
};
