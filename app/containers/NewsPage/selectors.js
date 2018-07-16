import { createSelector } from 'reselect';

const select = (state) => state.get('NewsPage');
const seletAuth = (state) => state.get('auth');

const makeSelectNews = () => createSelector(
  select,
  (state) => state
    .get('news')
    .filter((news) => !news.read)
    .sort((a, b) => b.date - a.date),
);

const makeSelectReadNews = () => createSelector(
  select,
  (state) => state
    .get('news')
    .filter((news) => news.read)
    .sort((a, b) => b.date - a.date),
);

const makeSelectUser = () => createSelector(
  seletAuth,
  (state) => state.get('user'),
);

export {
  select,
  makeSelectNews,
  makeSelectUser,
  makeSelectReadNews,
};
