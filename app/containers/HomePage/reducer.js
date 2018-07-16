import { List, fromJS } from 'immutable';
import { isPrivate } from '../../utils/parsePostText';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = fromJS({
  posts: [],
  subscriptions: new List([]),
  input: '',
  photoModalVisible: false,
  nicknameModalVisible: false,
  postModalVisible: false,
  statusModalVisible: false,
  editedPost: {},
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_POSTS:
      // console.log('SET_POSTS', action.posts);
      return state.set('posts', action.posts);

    case actionTypes.SET_INPUT:
      return state.set('input', action.input);

    case actionTypes.TOGGLE_PHOTO_MODAL:
      return state.update('photoModalVisible', (visible) => !visible);

    case actionTypes.TOGGLE_NICKNAME_MODAL:
      return state.update('nicknameModalVisible', (visible) => !visible);

    case actionTypes.TOGGLE_STATUS_MODAL:
      return state.update('statusModalVisible', (visible) => !visible);

    case actionTypes.START_EDITING_POST:
      return state
        .set('postModalVisible', true)
        .set('editedPost', action.post);

    case actionTypes.FINISH_EDITING_POST:
      return state
        .set('postModalVisible', false);

    case actionTypes.SET_POST_TEXT:
      return state.update('posts', (posts) => {
        const index = posts.findIndex((post) => post.date === action.post.date);
        if (posts[index].text !== action.newText) {
          posts[index] = { // eslint-disable-line
            ...posts[index],
            edited: true,
            text: action.text,
            private: isPrivate(action.newText),
          };
        }
        return [...posts];
      });

    case actionTypes.TOGGLE_LIKE:
      return state.update('posts', (posts) => {
        const index = posts.findIndex((post) => post.date === action.post.date);
        const post = posts[index];
        const liked = !(post.likes && post.likes[action.uid]);
        if (liked) {
          if (!post.likes) post.likes = {};
          post.likes[action.uid] = true; // eslint-disable-line
        } else {
          delete post.likes[action.uid]; // eslint-disable-line
        }
        return [...posts];
      });

    case actionTypes.POST_ADDED:
      return state.update('posts', (posts) => {
        posts.push(action.post);
        return [...posts].sort((a, b) => b.date - a.date);
      });

    case actionTypes.REMOVE_POST:
      return state.update('posts', (posts) => {
        const index = posts.findIndex((post) => post.date === action.post.date);
        posts.splice(index, 1);
        return [...posts];
      });

    default:
      return state;
  }
}

export default homeReducer;
