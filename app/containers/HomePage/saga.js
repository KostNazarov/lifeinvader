import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import { parsePostText, isPrivate } from 'utils/parsePostText';
import app from 'containers/App/firebaseConfig';

import formatErrorMessage from 'utils/formatErrorMessage';
import { setPosts, setPostText, postAdded } from './actions';
import { updateNickname, setError, updatePhoto } from '../App/actions';
import {
  ADD_POST,
  REMOVE_POST,
  LOAD_POSTS,
  SET_NICKNAME,
  FINISH_EDITING_POST,
  TOGGLE_LIKE,
  POST_ADDED,
} from './constants';

const database = app.database();
const defaultAvatar = 'http://www.gigtime.co/assets/fallback/default_user_avatar_huge.jpg';

/* eslint-disable no-console */
export function* handleAddPost(action) {
  const currentUser = app.auth().currentUser;
  const post = {
    date: Date.now(),
    text: action.text,
    private: isPrivate(action.text),
  };

  try {
    const postFull = Object.assign({}, post, {
      photoURL: currentUser.photoURL,
      author: currentUser.displayName,
      uid: currentUser.uid,
    });
    yield put(postAdded(postFull));
    yield database.ref(`users/${currentUser.uid}/posts/${post.date}`).set(post);

    const rawSubscribers = yield database.ref(`users/${currentUser.uid}/subscribers`).once('value');
    const subscribers = rawSubscribers.val();
    if (!subscribers) return;

    if (post.uid === currentUser.uid) return;
    const log = {
      date: Date.now(),
      read: false,
      type: 'POST_ADDED',
      content: postFull,
    };
    Object.values(subscribers).forEach((user) => {
      database.ref(`users/${user.uid}/news/${log.date}`).set(log);
    });
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleRemovePost(action) {
  const currentUser = app.auth().currentUser;
  const uid = currentUser.uid;
  const post = action.post;

  try {
    yield database.ref(`users/${uid}/posts/${post.date}`).set({});
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleLoadPosts(action) {
  const uid = action.uid;

  const rawUsers = yield database.ref('users').once('value');
  const users = rawUsers.val() || {};
  const currentUserData = users[uid];

  if (!currentUserData) {
    yield put(updateNickname(uid));
    yield put(updatePhoto(defaultAvatar));
    return;
  }

  try {
    const ownPosts = Object
      .values(currentUserData.posts || {})
      .map((post) => ({
        ...post,
        author: currentUserData.displayName,
        photoURL: currentUserData.photoURL,
        uid: currentUserData.uid,
      }));

    const allPosts = Object
      .values(currentUserData.subscriptions || {}) // Convert object to array of user's posts
      .map((subscription) => { // Fill every post with needed extra data
        const subUser = users[subscription.uid];
        if (subUser) {
          return Object
            .values(subUser.posts || {})
            .map((post) => ({
              ...post,
              author: subUser.displayName,
              photoURL: subUser.photoURL,
              uid: subUser.uid,
            }));
        }
        return false;
      })
      .filter((post) => !!post) // Remove empty posts
      .concat([...ownPosts]) // Add your posts
      .reduce((value, posts) => value.concat(posts), []) // Make array of posts out of array of user's posts
      .sort((a, b) => b.date - a.date); // Sort by ascending date

    yield put(setPosts(allPosts));
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleSetNickname(action) {
  const user = app.auth().currentUser;
  const displayName = (action.displayName || '').toString();
  const oldDisplayName = user.displayName;

  if (!displayName || user.displayName === displayName) return;

  try {
    const newNicknameRawData = yield database.ref(`displayNames/${displayName}`).once('value');
    if (newNicknameRawData.val()) {
      yield put(setError(formatErrorMessage('homepage/nickname-occupied')));
      return;
    }

    yield put(updateNickname(displayName));
    yield database.ref(`users/${user.uid}/displayName`).set(displayName);
    yield database.ref(`displayNames/${displayName}`).set(user.uid);
    yield database.ref(`displayNames/${user.displayName}`).set({});
    yield user.updateProfile({ displayName });
  } catch (error) {
    // console.error(error);
    yield put(updateNickname(oldDisplayName));
    yield put(setError(error.message));
  }
}

export function* handleFinishEditingPost(action) {
  if (!action.post) return;

  const post = {
    ...action.post,
    text: action.newText,
    private: isPrivate(action.newText),
    edited: !action.post.edited && action.post.text !== action.newText,
  };

  try {
    if (post.uid && post.date && post.text) {
      yield put(setPostText(post, post.text));
      yield database.ref(`users/${post.uid}/posts/${post.date}`).set(post);
    }
  } catch (error) {
    // console.error(error);
    yield put(setPostText(post, action.post.text));
    yield put(setError(error.message));
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

export function* handlePostMentions(action) {
  const words = parsePostText(action.post ? action.post.text : action.newText);
  if (!words.length) return;

  const mentions = words.filter((word) => word.mention);
  if (!mentions.length) return;

  const rawDisplayNames = yield database.ref('/displayNames').once('value');
  const displayNames = rawDisplayNames.val();
  if (!displayNames) return;

  const ownDisplayName = app.auth().currentUser.displayName;
  const unexisting = [];
  const existing = [];
  mentions.forEach((mention) => {
    const displayName = mention.value.substring(1, mention.value.length);
    const uid = displayNames[displayName];
    const exist = !!uid;
    if (exist) {
      existing.push(uid);
    } else if (displayName !== ownDisplayName) {
      unexisting.push(displayName);
    }
  });

  if (unexisting.length) {
    // TODO Add translating
    const errorMessage = unexisting.length === 1 ?
      `User that you mention doesn't exist: ${unexisting[0]}` :
      `Users that you mention doesn't exist: ${unexisting.join(', ')}`;
    yield put(setError(errorMessage));
  }

  if (existing.length) {
    const log = {
      date: Date.now(),
      read: false,
      type: 'POST_MENTION',
      content: action.post,
    };
    existing.forEach((uid) => {
      database.ref(`users/${uid}/news/${log.date}`).set(log);
    });
  }
}

export default function* homeSaga() {
  yield takeEvery(ADD_POST, handleAddPost);
  yield takeEvery(REMOVE_POST, handleRemovePost);
  yield takeLatest(LOAD_POSTS, handleLoadPosts);
  yield takeLatest(SET_NICKNAME, handleSetNickname);
  yield takeEvery(FINISH_EDITING_POST, handleFinishEditingPost);
  yield takeLatest(TOGGLE_LIKE, handleToggleLike);

  yield takeLatest(POST_ADDED, handlePostMentions);
  yield takeEvery(FINISH_EDITING_POST, handlePostMentions);
}
