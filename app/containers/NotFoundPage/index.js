import React from 'react';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    // TODO Add translation and design
    return (
      <h1>
        You are on not existed page! Check is path is correct.
      </h1>
    );
  }
}
