import { Map } from 'immutable';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = new Map({
  news: [],
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_NEWS:
      // console.log('SET_NEWS', action.news);
      return state.set('news', action.news);

    case actionTypes.TOGGLE_READ:
      return state.update('news', (news) => {
        const index = news.findIndex((data) => data.date === action.news.date);
        news[index].read = !action.news.read; // eslint-disable-line
        return [...news];
      }
      );

    default:
      return state;
  }
}

export default homeReducer;
