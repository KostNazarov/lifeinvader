import React from 'react';
import PropTypes from 'prop-types';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import reducer from './reducer';
import saga from './saga';

import * as actions from './actions';
import * as Selectors from './selectors';
import { loadSubscriptions, addSubscription, removeSubscription, setError } from '../App/actions';
import { makeSelectSubscriptions, makeSelectUser } from '../App/selectors';

import Post from '../../components/Post';
import formatErrorMessage from '../../utils/formatErrorMessage';

export class UserPage extends React.Component {
  componentWillMount = () => this.props.loadUser(this.uid);

  componentWillUnmount = () => {
    this.props.setUser({});
    this.props.setPosts([]);
  };

  subscriptionAction = () => {
    if (this.isSubscribed) {
      this.props.removeSubscription({ uid: this.props.user.get('uid') });
    } else {
      this.props.addSubscription(this.props.user.get('displayName'));
    }
  };

  toggleLike = (post) => {
    if (this.props.loggedIn) {
      this.props.toggleLike(post);
    } else {
      this.props.setError(formatErrorMessage('userpage/unlogged-like'));
    }
  };

  get uid() {
    const routes = this.props.location.pathname.split('/');
    return routes[routes.length - 1];
  }

  get isSubscribed() {
    let subscribed = false;
    this.props.subscriptions.map((sub) => { // eslint-disable-line
      if (sub.uid === this.props.user.get('uid')) {
        subscribed = true;
      }
    });
    return subscribed;
  }

  render() {
    if (!this.props.user.get('displayName')) {
      return (null);
    }

    return (
      <div className={'page-container'}>
        <div className={'profile'}>
          <div className={'avatar-wrapper'}>
            <Image
              className={'avatar'}
              src={this.props.user.get('photoURL')}
            />
          </div>
          <div className={'profile-info'}>
            <h1 className={'profile-nickname'}>
              {this.props.user.get('displayName') || 'Unknown'}
            </h1>
            {
              this.props.user.get('status') &&
              <div className={'profile-status'}>
                {
                  this.props.user.get('status')
                }
              </div>
            }
            {
              this.props.selfUser.dev &&
              <div className={'profile-status'}>
                <div>SUBS: {Object.keys(this.props.user.get('subscriptions') || {}).length}</div>
                <div>POSTS: {Object.keys(this.props.user.get('posts') || {}).length}</div>
                <div>KEY: {this.props.user.get('key')}</div>
                <div>UID: {this.props.user.get('uid')}</div>
              </div>
            }
          </div>
        </div>
        <div className={'homepage__posts-wrapper'}>
          {
            this.props.loggedIn &&
            <div className={'posts-editor'}>
              <div className={'buttons-block'}>
                <button onClick={this.subscriptionAction}>
                  <FormattedMessage id={this.isSubscribed ? 'unsubscribe' : 'subscribe'} />
                </button>
              </div>
            </div>
          }
          <div className={'homepage__profile'}>
            {
              this.props.posts.map((post) => (
                <Post
                  key={post.date}
                  post={post}
                  onLike={this.toggleLike}
                  displayName={this.props.selfUser.displayName}
                  dev={this.props.selfUser.dev}
                />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

UserPage.propTypes = {
  setError: PropTypes.func,
  loggedIn: PropTypes.bool,
  loadUser: PropTypes.func,
  location: PropTypes.object,
  user: PropTypes.object,
  setUser: PropTypes.func,
  posts: PropTypes.any,
  removeSubscription: PropTypes.func,
  addSubscription: PropTypes.func,
  subscriptions: PropTypes.any,
  toggleLike: PropTypes.func,
  setPosts: PropTypes.func,
  selfUser: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadUser: actions.loadUser,
    setUser: actions.setUser,
    toggleLike: actions.toggleLike,
    setPosts: actions.setPosts,
    setError,
    addSubscription,
    removeSubscription,
    loadSubscriptions,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  user: Selectors.makeSelectUser(),
  loggedIn: Selectors.makeSelectLoggedIn(),
  posts: Selectors.makeSelectPosts(),
  subscriptions: makeSelectSubscriptions(),
  selfUser: makeSelectUser(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'UserPage', reducer });
const withSaga = injectSaga({ key: 'UserPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UserPage);
