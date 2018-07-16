import * as actionTypes from './constants';

export function setPost(post) {
  return {
    type: actionTypes.SET_POST,
    post,
  };
}

export function loadPost(uid, date) {
  return {
    type: actionTypes.LOAD_POST,
    uid,
    date,
  };
}

export function addComment(post, text) {
  return {
    type: actionTypes.ADD_COMMENT,
    post,
    text,
  };
}

export function setInput(text) {
  return {
    type: actionTypes.SET_INPUT,
    text,
  };
}

export function removeComment(post, comment) {
  return {
    type: actionTypes.REMOVE_COMMENT,
    post,
    comment,
  };
}

export function startEditingComment(comment) {
  return {
    type: actionTypes.START_EDITING_COMMENT,
    comment,
  };
}

export function finishEditingComment(post, comment, newText) {
  return {
    type: actionTypes.FINISH_EDITING_COMMENT,
    post,
    comment,
    newText,
  };
}

export function setCommentText(comment, newText) {
  return {
    type: actionTypes.SET_COMMENT_TEXT,
    comment,
    newText,
  };
}

export function commentAdded(comment) {
  return {
    type: actionTypes.COMMENT_ADDED,
    comment,
  };
}

export function toggleLike(post, uid) {
  return {
    type: actionTypes.TOGGLE_LIKE,
    post,
    uid,
  };
}
