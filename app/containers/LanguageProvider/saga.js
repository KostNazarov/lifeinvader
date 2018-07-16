/**
 * Gets the repositories of the user from Github
 */

import { takeLatest } from 'redux-saga/effects';
import { CHANGE_LOCALE } from './constants';

// import request from 'utils/request';

export function* handleChangeLocale(action) {
  const locale = action.locale;
  localStorage.setItem('li-language', locale);
}

export default function* sagaLanguageProvider() {
  yield takeLatest(CHANGE_LOCALE, handleChangeLocale);
}
