import * as actionTypes from './constants';

export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user,
  };
}

export function loadUser(uid) {
  return {
    type: actionTypes.LOAD_USER,
    uid,
  };
}

export function setPosts(posts) {
  return {
    type: actionTypes.SET_POSTS,
    posts,
  };
}

export function toggleLike(post) {
  return {
    type: actionTypes.TOGGLE_LIKE,
    post,
  };
}

export function setPostLiked(post, uid, liked) {
  return {
    type: actionTypes.SET_POST_LIKED,
    post,
    uid,
    liked,
  };
}
