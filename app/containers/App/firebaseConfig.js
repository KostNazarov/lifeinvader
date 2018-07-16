import * as firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCSlD2JowWOb4dK5EaRqkjI2tbwvkmatlM',
  authDomain: 'lifeinvader-release.firebaseapp.com',
  databaseURL: 'https://lifeinvader-release.firebaseio.com',
  projectId: 'lifeinvader-release',
  storageBucket: '',
  messagingSenderId: '184592272644',
};

const app = firebase.initializeApp(config);
export default app;
