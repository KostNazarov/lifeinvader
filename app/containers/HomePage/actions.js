import * as actionTypes from './constants';

export function addPost(text) {
  return {
    type: actionTypes.ADD_POST,
    text,
  };
}

export function removePost(post) {
  return {
    type: actionTypes.REMOVE_POST,
    post,
  };
}

export function setPosts(posts) {
  return {
    type: actionTypes.SET_POSTS,
    posts,
  };
}

export function loadPosts(uid) {
  return {
    type: actionTypes.LOAD_POSTS,
    uid,
  };
}

export function setInput(input) {
  return {
    type: actionTypes.SET_INPUT,
    input,
  };
}

export function togglePhotoModal() {
  return {
    type: actionTypes.TOGGLE_PHOTO_MODAL,
  };
}

export function toggleNicknameModal() {
  return {
    type: actionTypes.TOGGLE_NICKNAME_MODAL,
  };
}

export function setNickname(displayName) {
  return {
    type: actionTypes.SET_NICKNAME,
    displayName,
  };
}

export function startEditingPost(post) {
  return {
    type: actionTypes.START_EDITING_POST,
    post,
  };
}

export function finishEditingPost(post, newText) {
  return {
    type: actionTypes.FINISH_EDITING_POST,
    post,
    newText,
  };
}

export function setPostText(post, newText) {
  return {
    type: actionTypes.SET_POST_TEXT,
    post,
    newText,
  };
}

export function toggleLike(post, uid) {
  return {
    type: actionTypes.TOGGLE_LIKE,
    post,
    uid,
  };
}

export function postAdded(post) {
  return {
    type: actionTypes.POST_ADDED,
    post,
  };
}
export function toggleStatusModal() {
  return {
    type: actionTypes.TOGGLE_STATUS_MODAL,
  };
}
