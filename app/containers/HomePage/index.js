import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Image } from 'react-bootstrap';
import { loadSubscriptions, updatePhoto, setStatus } from 'containers/App/actions';
import { makeSelectSubscriptions } from 'containers/App/selectors';
import app from 'containers/App/firebaseConfig';
import { FormattedMessage, injectIntl } from 'react-intl';

import saga from './saga';
import reducer from './reducer';
import * as Selectors from './selectors';
import * as actions from './actions';
import Input from '../../components/Input';
import Post from '../../components/Post';
import ChangePhotoModal from '../../components/ChangePhotoModal';
import InputModal from '../../components/InputModal';
import messages from './messages';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount = () => {
    const uid = this.props.user.uid;
    this.props.loadPosts(uid);
  };

  componentWillUnmount = () => this.props.setPosts([]);

  onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.createPost();
      event.preventDefault();
    }
  };

  createPost = () => {
    const text = this.props.input;
    if (!text.length) {
      return;
    }

    const uid = this.props.user.uid;
    this.props.addPost(text, uid);
    this.props.setInput('');
  };

  render() {
    const formatMessage = this.props.intl.formatMessage;

    return (
      <div className={'page-container'}>
        {
          this.props.photoModalVisible &&
            <ChangePhotoModal
              toggleModal={this.props.togglePhotoModal}
              onSubmit={this.props.updatePhoto}
              defaultText={this.props.user.photoURL}
              url={this.props.user.photoURL}
            />
        }
        {
          this.props.nicknameModalVisible &&
          <InputModal
            placeholder={formatMessage(messages.nicknameModalPlaceholder)}
            title={formatMessage(messages.nicknameModalTitle)}
            toggleModal={this.props.toggleNicknameModal}
            defaultText={this.props.user.displayName}
            onSubmit={this.props.setNickname}
          />
        }
        {
          this.props.postModalVisible &&
          <InputModal
            placeholder={formatMessage(messages.postModalPlaceholder)}
            title={formatMessage(messages.postModalTitle)}
            toggleModal={() => this.props.finishEditingPost()}
            defaultText={this.props.editedPost.text}
            onSubmit={(newText) => this.props.finishEditingPost(this.props.editedPost, newText)}
            textarea
          />
        }
        {
          this.props.statusModalVisible &&
          <InputModal
            placeholder={formatMessage(messages.statusModalPlaceholder)}
            title={formatMessage(messages.statusModalTitle)}
            toggleModal={this.props.toggleStatusModal}
            defaultText={this.props.user.status}
            onSubmit={this.props.setStatus}
            textarea
          />
        }
        <div className={'profile'}>
          <button
            className={'avatar-wrapper'}
            onClick={this.props.togglePhotoModal}
          >
            <Image
              src={this.props.photo}
              className={'avatar'}
            />
          </button>
          <div className={'profile-info'}>
            <div
              role={'button'}
              tabIndex={0}
              className={'profile-nickname'}
              onClick={this.props.toggleNicknameModal}
              style={{ cursor: 'pointer' }}
            >
              {this.props.user.displayName || 'Unknown'}
              <span className={'help'}>
                <FormattedMessage {...messages.postInputHelp} />
              </span>
            </div>
            <div
              role={'button'}
              tabIndex={0}
              className={'profile-status'}
              onClick={this.props.toggleStatusModal}
            >
              { // Display status or placeholder
                this.props.user.status ||
                <span className={'help'}>Your status here</span>
              }
            </div>
            {
              this.props.user.dev &&
              <div className={'profile-status'}>
                <div>SUBS: {Object.keys(this.props.user.subscriptions || {}).length}</div>
                <div>POSTS: {Object.keys(this.props.user.posts || {}).length}</div>
                <div>KEY: {this.props.user.key}</div>
                <div>UID: {this.props.user.uid}</div>
              </div>
            }
          </div>
        </div>
        <div className={'homepage__posts-wrapper'}>
          <div className={'posts-editor'}>
            <Input
              title={formatMessage(messages.postInputTitle)}
              onChange={this.props.setInput}
              value={this.props.input}
              onKeyDown={this.onKeyDown}
              textarea
            />
            <div className={'buttons-block'}>
              <button
                onClick={() => this.props.loadPosts(this.props.user.uid)}
              >
                <FormattedMessage {...messages.postInputUpdate} />
              </button>
              <button onClick={this.createPost}>
                <FormattedMessage {...messages.postInputCreate} />
              </button>
            </div>
          </div>
          <div className={'homepage__profile'}>
            {
              this.props.posts.map((post) => (
                <Post
                  key={post.date}
                  post={post}
                  enableButton={post.uid === this.props.user.uid}
                  onDelete={() => this.props.removePost(post)}
                  onLike={() => this.props.toggleLike(post, this.props.user.uid)}
                  toggleEdit={() => this.props.startEditingPost(post)}
                  displayName={this.props.user.displayName}
                  dev={this.props.user.dev}
                />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  intl: PropTypes.object,
  photo: PropTypes.string,
  addPost: PropTypes.func,
  posts: PropTypes.any,
  removePost: PropTypes.func,
  user: PropTypes.any,
  loadPosts: PropTypes.func,
  input: PropTypes.string,
  setInput: PropTypes.func,
  setNickname: PropTypes.func,
  togglePhotoModal: PropTypes.func,
  toggleNicknameModal: PropTypes.func,
  updatePhoto: PropTypes.func,
  photoModalVisible: PropTypes.bool,
  nicknameModalVisible: PropTypes.bool,
  toggleLike: PropTypes.func,
  postModalVisible: PropTypes.bool,
  startEditingPost: PropTypes.func,
  finishEditingPost: PropTypes.func,
  editedPost: PropTypes.object,
  setStatus: PropTypes.func,
  toggleStatusModal: PropTypes.func,
  statusModalVisible: PropTypes.bool,
  setPosts: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addPost: actions.addPost,
    setPosts: actions.setPosts,
    removePost: actions.removePost,
    loadPosts: actions.loadPosts,
    setInput: actions.setInput,
    togglePhotoModal: actions.togglePhotoModal,
    toggleNicknameModal: actions.toggleNicknameModal,
    setNickname: actions.setNickname,
    startEditingPost: actions.startEditingPost,
    finishEditingPost: actions.finishEditingPost,
    toggleLike: actions.toggleLike,
    toggleStatusModal: actions.toggleStatusModal,
    setStatus,
    loadSubscriptions,
    updatePhoto,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  user: Selectors.makeSelectUser(),
  photo: Selectors.makeSelectPhoto(),
  posts: Selectors.makeSelectPosts(),
  subscriptions: makeSelectSubscriptions(),
  input: Selectors.makeSelectInput(),
  photoModalVisible: Selectors.makeSelectPhotoVisible(),
  nicknameModalVisible: Selectors.makeSelectNicknameVisible(),
  postModalVisible: Selectors.makeSelectPostModalVisible(),
  editedPost: Selectors.makeSelectEditedPost(),
  statusModalVisible: Selectors.makeSelectStatusModalVisible(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'HomePage', reducer });
const withSaga = injectSaga({ key: 'HomePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(HomePage);
