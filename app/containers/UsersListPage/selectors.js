import { createSelector } from 'reselect';

const select = (state) => state.get('UsersListPage');

const makeSelectFilter = () => createSelector(
  select,
  (state) => state.get('filter'),
);

const makeSelectUsers = () => createSelector(
  select,
  (state) => state.get('users').filter((user) => user.displayName && user.displayName.toLowerCase().indexOf(state.get('filter').toLowerCase()) > -1),
);

export {
  select,
  makeSelectFilter,
  makeSelectUsers,
};
