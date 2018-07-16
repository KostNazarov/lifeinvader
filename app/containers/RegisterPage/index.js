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

import messages from './messages';
import { setError } from '../App/actions';
import reducer from './reducer';
import * as actions from './actions';
import * as Selectors from './selectors';
import saga from './saga';

export class RegisterPage extends React.Component {
  componentWillMount = () => {
    this.props.setKey('');
    this.props.setEmail('');
    this.props.setPassword('');
    this.props.setConfirmPassword('');
  };

  onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.register();
      event.preventDefault();
    }
  };

  register = () => {
    const formatMessage = this.props.intl.formatMessage;

    if (this.props.password !== this.props.confirmPassword) {
      this.props.setError(formatMessage(messages.errorPasswordDoesntMatch));
      return;
    }

    if (this.props.password.length < 6) {
      this.props.setError(formatMessage(messages.errorPasswordTooShort));
      return;
    }

    this.props.register(this.props.registerKey, this.props.email, this.props.password);
  };

  render() {
    const formatMessage = this.props.intl.formatMessage;

    return (
      <div className={'sign-page'}>
        <Input
          onChange={this.props.setKey}
          placeholder={formatMessage(messages.keyPlaceholder)}
          value={this.props.registerKey}
          onKeyDown={this.onKeyDown}
        />
        <Input
          onChange={this.props.setEmail}
          placeholder={formatMessage(messages.emailPlaceholder)}
          value={this.props.email}
          onKeyDown={this.onKeyDown}
        />
        <Input
          onChange={this.props.setPassword}
          placeholder={formatMessage(messages.passwordPlaceholder)}
          value={this.props.password}
          type={'password'}
          onKeyDown={this.onKeyDown}
        />
        <Input
          onChange={this.props.setConfirmPassword}
          placeholder={formatMessage(messages.confirmPlaceholder)}
          value={this.props.confirmPassword}
          type={'password'}
          onKeyDown={this.onKeyDown}
        />
        <div className={'buttons-block'}>
          <Link to={'/login'}>
            <button className={'button'}>
              <FormattedMessage {...messages.signin} />
            </button>
          </Link>
          <button className={'button'} onClick={this.register}>
            <FormattedMessage {...messages.register} />
          </button>
        </div>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  intl: PropTypes.object,
  setKey: PropTypes.func,
  registerKey: PropTypes.string,
  setEmail: PropTypes.func,
  setPassword: PropTypes.func,
  setConfirmPassword: PropTypes.func,
  setError: PropTypes.func,
  register: PropTypes.func,
  email: PropTypes.string,
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setEmail: actions.setEmail,
    setPassword: actions.setPassword,
    setConfirmPassword: actions.setConfirmPassword,
    register: actions.register,
    setKey: actions.setKey,
    setError,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  email: Selectors.makeSelectEmail(),
  password: Selectors.makeSelectPassword(),
  confirmPassword: Selectors.makeSelectConfirmPassword(),
  registerKey: Selectors.makeSelectKey(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'RegisterPage', reducer });
const withSaga = injectSaga({ key: 'RegisterPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(RegisterPage);
