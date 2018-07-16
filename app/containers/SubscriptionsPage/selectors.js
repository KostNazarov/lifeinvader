import { createSelector } from 'reselect';

const select = (state) => state.get('SubscriptionsPage');

const makeSelectValue = () => createSelector(
  select,
  (state) => state.get('value'),
);

export {
  select,
  makeSelectValue,
};
