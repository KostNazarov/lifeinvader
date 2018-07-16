import { List, Map } from 'immutable';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = new Map({
  user: new Map({}),
  posts: new List([]),
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USER:
      // console.log('SET_USER', action.user);
      return state.set('user', new Map(action.user));

    case actionTypes.SET_POSTS:
      // console.log('SET_POSTS', action.posts);
      return state.set('posts', new List(action.posts));

    case actionTypes.SET_POST_LIKED:
      return state.update('posts', (origPosts) => {
        const posts = origPosts.toJS();
        const index = posts.findIndex((post) => post.date === action.post.date);
        if (action.liked) {
          if (!posts[index].likes) posts[index].likes = {};
          posts[index].likes[action.uid] = true;
        } else {
          delete posts[index].likes[action.uid];
        }
        return new List(posts);
      });

    default:
      return state;
  }
}

export default homeReducer;
