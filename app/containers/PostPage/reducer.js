import { fromJS } from 'immutable';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = fromJS({
  post: {},
  input: '',
  editCommentModalVisible: false,
  editedComment: {},
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_POST:
      // console.log('SET_POST', action.post);
      return state.set('post', action.post);

    case actionTypes.SET_INPUT:
      return state.set('input', action.text);

    case actionTypes.START_EDITING_COMMENT:
      return state
        .set('editCommentModalVisible', true)
        .set('editedComment', action.comment);

    case actionTypes.FINISH_EDITING_COMMENT:
      return state
        .set('editCommentModalVisible', false);

    case actionTypes.COMMENT_ADDED:
      return state.update('post', (post) => {
        const comments = post.comments || [];
        comments.push(action.comment);
        comments.sort((a, b) => a.date - b.date);
        post.comments = comments; // eslint-disable-line
        return { ...post };
      });

    case actionTypes.REMOVE_COMMENT:
      return state.update('post', (post) => {
        const comments = post.comments;
        const index = comments.findIndex((comment) => comment.date === action.comment.date);
        comments.splice(index, 1); // eslint-disable-line
        return { ...post };
      });

    case actionTypes.SET_COMMENT_TEXT:
      return state.update('post', (post) => {
        const comments = post.comments;
        const index = comments.findIndex((comment) => comment.date === action.comment.date);
        comments[index].edited = !comments[index].edited && comments[index].text !== action.newText; // eslint-disable-line
        comments[index].text = action.newText; // eslint-disable-line
        return { ...post };
      });

    case actionTypes.TOGGLE_LIKE:
      return state.update('post', (post) => {
        const liked = !(post.likes && post.likes[action.uid]);
        if (liked) {
          if (!post.likes) post.likes = {}; // eslint-disable-line
          post.likes[action.uid] = true; // eslint-disable-line
        } else {
          delete post.likes[action.uid]; // eslint-disable-line
        }
        return { ...post };
      });

    default:
      return state;
  }
}

export default homeReducer;
