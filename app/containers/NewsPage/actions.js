import * as actionTypes from './constants';

export function loadNews(uid) {
  return {
    type: actionTypes.LOAD_NEWS,
    uid,
  };
}

export function setNews(news) {
  return {
    type: actionTypes.SET_NEWS,
    news,
  };
}

export function toggleRead(news) {
  return {
    type: actionTypes.TOGGLE_READ,
    news,
  };
}
