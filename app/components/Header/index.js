import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './header.css';
import messages from './messages';

export function Header(props) {
  const buttonLogged = (
    <button
      className={'header-menu__button'}
      onClick={props.onLogout}
    >
      <FormattedMessage {...messages.logout} />
    </button>
  );

  const buttonNotLogged = (
    <Link to={'/login'}>
      <button className={'header-menu__button'}>
        <FormattedMessage {...messages.login} />
      </button>
    </Link>
  );

  // TODO Make all <Link><button> as separate component
  return (
    <div className={'header-wrapper'}>
      <Link to={'/'}>
        <Image
          className={'header-logo'}
          src={'http://cdn.sc.rockstargames.com/ext/li/img/logo-small.png'}
        />
      </Link>
      <div className={'header-menu'}>
        <div className={'header-menu__container'}>
          {
            props.loggedIn &&
              [
                <Link
                  to={'/'}
                  key={'home'}
                >
                  <button className={'header-menu__button'}>
                    <FormattedMessage {...messages.home} />
                  </button>
                </Link>,

                <Link
                  to={'/news'}
                  key={'news'}
                >
                  <button className={'header-menu__button'}>
                    <FormattedMessage {...messages.news} />
                  </button>
                </Link>,

                <Link
                  to={'/subscriptions'}
                  key={'subscriptions'}
                >
                  <button className={'header-menu__button'}>
                    <FormattedMessage {...messages.subscriptions} />
                  </button>
                </Link>,
              ]
          }

          <Link to={'/users'}>
            <button className={'header-menu__button'}>
              <FormattedMessage {...messages.users} />
            </button>
          </Link>

          {
            props.loggedIn ?
              buttonLogged :
              buttonNotLogged
          }
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  onLogout: PropTypes.func,
  loggedIn: PropTypes.bool,
};

export default Header;
