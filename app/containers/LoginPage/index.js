import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import { setError } from '../App/actions';
import saga from './saga';
import reducer from './reducer';
import * as actions from './actions';
import * as Selectors from './selectors';
import messages from './messages';

export class LoginPage extends React.Component {
  componentWillMount = () => {
    this.props.setEmail('');
    this.props.setPassword('');
  };

  onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.login();
      event.preventDefault();
    }
  };

  login = () => this.props.login(this.props.email, this.props.password);

  render() {
    const formatMessage = this.props.intl.formatMessage;

    return (
      <div className={'sign-page'}>
        <Input
          onChange={this.props.setEmail}
          value={this.props.email}
          placeholder={formatMessage(messages.emailPlaceholder)}
          onKeyDown={this.onKeyDown}
        />
        <Input
          onChange={this.props.setPassword}
          value={this.props.password}
          placeholder={formatMessage(messages.passwordPlaceholder)}
          type={'password'}
          onKeyDown={this.onKeyDown}
        />
        <div className={'buttons-block'}>
          <Link to={'/register'}>
            <button className={'button'}>
              <FormattedMessage {...messages.signup} />
            </button>
          </Link>
          <button className={'button'} onClick={this.login}>
            <FormattedMessage {...messages.login} />
          </button>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  intl: PropTypes.object,
  setEmail: PropTypes.func,
  setPassword: PropTypes.func,
  login: PropTypes.func,
  email: PropTypes.string,
  password: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setEmail: actions.setEmail,
    setPassword: actions.setPassword,
    login: actions.login,
    setError,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  email: Selectors.makeSelectEmail(),
  password: Selectors.makeSelectPassword(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'LoginPage', reducer });
const withSaga = injectSaga({ key: 'LoginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(LoginPage);
