import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { makeSelectLoggedIn, makeSelectUser } from '../App/selectors';
import * as Selectors from './selectors';
import * as actions from './actions';
import reducer from './reducer';
import saga from './saga';
import Input from '../../components/Input';
import messages from './messages';

export class UsersListPage extends React.Component {
  componentWillMount = () => this.props.loadUsers();

  render() {
    const formatMessage = this.props.intl.formatMessage;

    return (
      <div className={'page-container'}>
        <div className={'users-page'}>
          <Input
            title={formatMessage(messages.inputTitle)}
            placeholder={formatMessage(messages.inputPlaceholder)}
            value={this.props.filter}
            onChange={this.props.setFilter}
          />
          <div className={'subscriptions-list'}>
            {
              this.props.users.map((user) => (
                <div
                  key={user.uid}
                  className={'user-info-post'}
                >
                  <Link to={`user/${user.uid}`}>
                    <img
                      src={user.photoURL}
                      className={'avatar-icon'}
                      alt={''}
                    />
                  </Link>
                  <div className={'user-post-info__text'}>
                    <Link to={`user/${user.uid}`}>
                      {user.displayName}
                    </Link>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

UsersListPage.propTypes = {
  intl: PropTypes.object,
  filter: PropTypes.string,
  users: PropTypes.instanceOf(Map),
  setFilter: PropTypes.func,
  loadUsers: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setFilter: actions.setFilter,
    loadUsers: actions.loadUsers,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  loggedIn: makeSelectLoggedIn(),
  users: Selectors.makeSelectUsers(),
  filter: Selectors.makeSelectFilter(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'UsersListPage', reducer });
const withSaga = injectSaga({ key: 'UsersListPage', saga });

export default compose(
  withReducer,
  withConnect,
  withSaga,
  injectIntl,
)(UsersListPage);
