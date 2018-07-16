/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import app from 'containers/App/firebaseConfig';
import { parsePostText } from 'utils/parsePostText';
import { setPost, commentAdded, setCommentText } from './actions';
import { LOAD_POST, ADD_COMMENT, REMOVE_COMMENT, FINISH_EDITING_COMMENT, TOGGLE_LIKE } from './constants';
import { setError } from '../App/actions';

/* eslint-disable no-console */
const database = app.database();
export function* handleLoadPost(action) {
  const uid = action.uid;
  const date = action.date;

  try {
    const rawUser = yield database.ref(`users/${uid}`).once('value');
    const user = rawUser.val();
    if (user && user.posts) {
      const post = user.posts[date];
      if (!post) {
        yield put(setPost({}));
        return;
      }

      post.author = user.displayName;
      post.photoURL = user.photoURL;
      post.uid = user.uid;

      const commenters = {};
      if (post.comments) {
        for (const key in post.comments) { // eslint-disable-line
          const comment = post.comments[key];
          const cuid = comment.uid;
          if (commenters[cuid] == null) {
            const rawData = yield database.ref(`users/${cuid}`).once('value');
            const cuser = rawData.val();
            if (cuser) {
              commenters[cuid] = cuser;
            }
          }
        }

        post.comments = Object
          .values(post.comments)
          .map((oldComment) => {
            const comment = oldComment;
            const cuser = commenters[comment.uid];
            if (cuser) {
              comment.author = cuser.displayName;
              comment.photoURL = cuser.photoURL;
            }
            return comment;
          })
          .sort((a, b) => a.date - b.date);
      }

      yield put(setPost(post));
    }
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleAddComment(action) {
  const currentUser = app.auth().currentUser;
  const post = action.post;
  const comment = {
    date: Date.now(),
    text: action.text,
    uid: currentUser.uid,
  };

  try {
    const fullComment = Object.assign({}, comment, {
      author: currentUser.displayName,
      photoURL: currentUser.photoURL,
    });
    yield put(commentAdded(fullComment));
    yield database.ref(`users/${post.uid}/posts/${post.date}/comments/${comment.date}`).set(comment);

    if (post.uid === currentUser.uid) return;
    const log = {
      date: Date.now(),
      read: false,
      type: 'COMMENT_ADDED',
      content: {
        post: {
          date: post.date,
          uid: post.uid,
        },
        comment: fullComment,
      },
    };
    yield database.ref(`users/${post.uid}/news/${log.date}`).set(log);
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleRemoveComment(action) {
  // const currentUser = app.auth().currentUser;
  const post = action.post;
  const comment = action.comment;

  try {
    yield database.ref(`users/${post.uid}/posts/${post.date}/comments/${comment.date}`).set({});
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleFinishEditingComment(action) {
  const post = action.post;
  const comment = action.comment;
  const newText = action.newText;

  if (post && post.uid && post.date && post.text !== newText) {
    yield put(setCommentText(comment, newText));
    yield database.ref(`users/${post.uid}/posts/${post.date}/comments/${comment.date}`).set({
      ...comment,
      text: newText,
      edited: true,
    });
  }
}

export function* handleToggleLike(action) {
  const uid = action.uid;
  const post = action.post;
  const authorUid = post.uid;
  const postDate = post.date;
  const liked = !!(post.likes && post.likes[uid]);

  try {
    yield database.ref(`users/${authorUid}/posts/${postDate}/likes/${uid}`).set(liked || {});
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleCommentMentions(action) {
  const words = parsePostText(action.text || action.newText);
  if (!words.length) return;

  const mentions = words.filter((word) => word.mention);
  if (!mentions.length) return;

  const rawDisplayNames = yield database.ref('displayNames').once('value');
  const displayNames = rawDisplayNames.val();
  if (!displayNames) return;

  const ownDisplayName = app.auth().currentUser.displayName;
  const unexisting = [];
  const existing = [];
  mentions.forEach((mention) => {
    const displayName = mention.value.substring(1, mention.value.length);
    const uid = displayNames[displayName];
    if (uid) {
      existing.push(uid);
    } else if (displayName !== ownDisplayName) {
      unexisting.push(displayName);
    }
  });

  if (unexisting.length) {
    // TODO Add translation
    const errorMessage = unexisting.length === 1 ?
      `User that you mention doesn't exist: ${unexisting[0]}` :
      `Users that you mention doesn't exist: ${unexisting.join(', ')}`;
    yield put(setError(errorMessage));
  }

  if (existing.length) {
    const log = {
      date: Date.now(),
      read: false,
      type: 'COMMENT_MENTION',
      content: action.post,
    };
    existing.forEach((uid) => {
      database.ref(`users/${uid}/news/${log.date}`).set(log);
    });
  }
}

export default function* postSaga() {
  yield takeLatest(LOAD_POST, handleLoadPost);
  yield takeLatest(ADD_COMMENT, handleAddComment);
  yield takeLatest(REMOVE_COMMENT, handleRemoveComment);
  yield takeLatest(FINISH_EDITING_COMMENT, handleFinishEditingComment);
  yield takeLatest(TOGGLE_LIKE, handleToggleLike);

  yield takeLatest(ADD_COMMENT, handleCommentMentions);
  yield takeEvery(FINISH_EDITING_COMMENT, handleCommentMentions);
}
