import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ component, state, to, ...rest }) { // eslint-disable-line react/prop-types
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!state) return <Redirect to={to} />;

        return React.createElement(component, props);
      }}
    />
  );
}
