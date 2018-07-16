import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Post from 'components/Post';
import Input from 'components/Input';
import InputModal from 'components/InputModal';
import { injectIntl } from 'react-intl';

import { setError } from '../App/actions';
import * as Selectors from './selectors';
import saga from './saga';
import * as actions from './actions';
import reducer from './reducer';
import messages from './messages';

export class PostPage extends React.Component {
  componentDidMount = () => this.loadPost();

  onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.addComment();
      event.preventDefault();
    }
  };

  addComment = () => {
    const text = this.props.input;
    if (!text.length) return;

    this.props.addComment(this.props.post, text);
    this.props.setInput('');
  };

  loadPost = () => {
    this.props.setPost({});
    const routes = this.props.location.pathname.split('/');
    const uid = routes[2];
    const date = routes[3];
    if (uid && date) {
      this.props.loadPost(uid, date);
    }
  };

  render() {
    if (this.props.post.date == null) return (null);

    const formatMessage = this.props.intl.formatMessage;
    if (this.props.post.private && this.props.user.displayName !== this.props.post.author) {
      this.props.setError(formatMessage(messages.postPrivate));
      return (null);
    }


    // TODO Enable post editing and deleting
    return (
      <div className={'page-container'}>
        <div className={'homepage__profile'}>
          {
            this.props.editCommentModalVisible &&
            <InputModal
              title={formatMessage(messages.commentModalTitle)}
              placeholder={formatMessage(messages.commentModalPlaceholder)}
              toggleModal={() => this.props.finishEditingComment()}
              defaultText={this.props.editedComment.text}
              onSubmit={(newText) => this.props.finishEditingComment(this.props.post, this.props.editedComment, newText)}
              textarea
            />
          }
          <Post
            post={this.props.post}
            onLike={() => this.props.toggleLike(this.props.post, this.props.user.uid)}
            displayName={this.props.user.displayName}
            dev={this.props.user.dev}
            // enableButton={this.props.post.uid === this.props.user.uid}
            nonInteractive={!this.props.loggedIn}
          />
          <div className={'homepage__posts-wrapper'}>
            {
              this.props.loggedIn &&
              <div className={'posts-editor'}>
                <Input
                  placeholder={formatMessage(messages.commentInput)}
                  onChange={this.props.setInput}
                  value={this.props.input}
                  onKeyDown={this.onKeyDown}
                  textarea
                />
              </div>
            }
          </div>
          {
            this.props.post.comments &&
            <div className={'homepage__profile'}>
              {
                this.props.post.comments.map((comment) => (
                  <Post
                    key={comment.date}
                    post={comment}
                    enableButton={comment.uid === this.props.user.uid}
                    onDelete={() => this.props.removeComment(this.props.post, comment)}
                    toggleEdit={() => this.props.startEditingComment(comment)}
                    displayName={this.props.user.displayName}
                    dev={this.props.user.dev}
                    nonInteractive
                  />
                ))
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

PostPage.propTypes = {
  intl: PropTypes.object,
  toggleLike: PropTypes.func,
  setPost: PropTypes.func,
  location: PropTypes.object,
  loadPost: PropTypes.func,
  post: PropTypes.object,
  loggedIn: PropTypes.bool,
  removeComment: PropTypes.func,
  startEditingComment: PropTypes.func,
  user: PropTypes.object,
  setInput: PropTypes.func,
  input: PropTypes.string,
  finishEditingComment: PropTypes.func,
  editedComment: PropTypes.object,
  editCommentModalVisible: PropTypes.bool,
  addComment: PropTypes.func,
  setError: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPost: actions.loadPost,
    setPost: actions.setPost,
    addComment: actions.addComment,
    setInput: actions.setInput,
    removeComment: actions.removeComment,
    startEditingComment: actions.startEditingComment,
    finishEditingComment: actions.finishEditingComment,
    toggleLike: actions.toggleLike,
    setError,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  post: Selectors.makeSelectPost(),
  loggedIn: Selectors.makeSelectLoggedIn(),
  user: Selectors.makeSelectUser(),
  input: Selectors.makeSelectInput(),
  editCommentModalVisible: Selectors.makeSelectEditCommentModalVisible(),
  editedComment: Selectors.makeSelectEditedComment(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'PostPage', reducer });
const withSaga = injectSaga({ key: 'PostPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(PostPage);
