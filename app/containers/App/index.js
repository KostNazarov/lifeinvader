import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import Header from 'components/Header';
import Notification from 'components/Notification';
import PrivateRoute from 'components/PrivateRoute';

import HomePage from 'containers/HomePage';
import NotFoundPage from 'containers/NotFoundPage';
import LoginPage from 'containers/LoginPage';
import RegisterPage from 'containers/RegisterPage';
import SubscriptionsPage from 'containers/SubscriptionsPage';
import UserPage from 'containers/UserPage';
import PostPage from 'containers/PostPage';
import UsersListPage from 'containers/UsersListPage';
import NewsPage from 'containers/NewsPage';

import app from './firebaseConfig';

import './index.css';
import './button.css';
import * as actions from './actions';
import * as Selectors from './selectors';

import saga from './saga';
import reducer from './reducer';

export class App extends React.Component {
  constructor(props) {
    super(props);

    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
      }
    });
  }

  componentDidMount = () => {
    const uid = this.props.user.uid;
    this.props.loadSubscriptions(uid);
  };

  render() {
    return (
      <div className={'app-wrapper'}>
        <Header
          loggedIn={this.props.loggedIn}
          onLogout={this.props.logout}
        />
        {
          this.props.error &&
          <Notification
            text={this.props.error}
            onClick={() => this.props.setError('')}
          />
        }
        <div className={'app-container'}>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              state={this.props.loggedIn}
              to={'/login'}
              component={HomePage}
            />
            <PrivateRoute
              exact
              path="/login"
              state={!this.props.loggedIn}
              to={'/'}
              component={LoginPage}
            />
            <PrivateRoute
              exact
              path="/register"
              state={!this.props.loggedIn}
              to={'/'}
              component={RegisterPage}
            />
            <PrivateRoute
              exact
              path="/subscriptions"
              state={this.props.loggedIn}
              to={'/login'}
              component={SubscriptionsPage}
            />
            <PrivateRoute
              path="/news"
              state={this.props.loggedIn}
              to="/login"
              component={NewsPage}
            />
            <Route path={'/post/'} component={PostPage} />
            <Route path={'/user/'} component={UserPage} />
            <Route path={'/users'} component={UsersListPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  setUser: PropTypes.func,
  user: PropTypes.object,
  loadSubscriptions: PropTypes.func,
  error: PropTypes.any,
  setError: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setUser: actions.setUser,
    logout: actions.logout,
    loadSubscriptions: actions.loadSubscriptions,
    setError: actions.setError,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  user: Selectors.makeSelectUser(),
  loggedIn: Selectors.makeSelectLoggedIn(),
  error: Selectors.makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'auth', reducer });
const withSaga = injectSaga({ key: 'auth', saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect,
)(App);

