/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import { setError } from 'containers/App/actions';
import app from 'containers/App/firebaseConfig';
import { LOAD_NEWS, TOGGLE_READ } from './constants';
import { setNews } from './actions';

const database = app.database();

/* eslint-disable no-console */
export function* handleLoadNews(action) {
  try {
    const uid = action.uid;
    const rawNews = yield database.ref(`users/${uid}/news`).once('value');
    const news = rawNews.val();
    if (!news) return;

    const processedNews = Object.values(news);

    yield put(setNews(processedNews));
  } catch (error) {
    // console.error(error);
    yield put(setError(error.messages));
  }
}

export function* handleToggleRead(action) {
  const uid = app.auth().currentUser.uid;
  const news = { ...action.news };

  try {
    yield database.ref(`users/${uid}/news/${news.date}/read`).set(news.read);
  } catch (error) {
    // console.error(error);
    yield put(setError(error.messages));
  }
}

export default function* newsSaga() {
  yield takeLatest(LOAD_NEWS, handleLoadNews);
  yield takeEvery(TOGGLE_READ, handleToggleRead);
}
