import React from 'react';
import { FormattedMessage } from 'react-intl';

const identifiers = {
  'auth/invalid-email': 'containers.HomePage.error.email.badlyFormatted',
  'auth/invalid-key': 'components.RegisterPage.error.key.invalid',
  'user/not-found': 'components.UserPage.user.notFound',
  'url/contain-data': 'containers.HomePage.error.avatar.containData',
  'sub/on-self': 'containers.SubscriptionsPage.error.subscribe.onSelf',
  'homepage/nickname-occupied': 'containers.HomePage.error.nickname.occupied',
  'userpage/unlogged-like': 'error.like.unlogged',
  'auth/wrong-password': 'containers.LoginPage.error.password.wrong',
  'auth/user-not-found': 'containers.LoginPage.error.user.notFound',
};

export default function formatErrorMessage(error) {
  const id = typeof error === 'object' ? identifiers[error.code] : identifiers[error];

  return (
    id ?
      <FormattedMessage id={id} /> :
      error.message
  );
}
