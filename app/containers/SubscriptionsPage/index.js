import React from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { makeSelectLoggedIn, makeSelectUser, makeSelectSubscriptions } from '../App/selectors';
import { loadSubscriptions, addSubscription, removeSubscription } from '../App/actions';
import * as Selectors from './selectors';
import * as actions from './actions';
import reducer from './reducer';
import './subscriptionspage.css';
import Input from '../../components/Input';
import messages from './messages';

export class SubscriptionsPage extends React.Component {
  onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey && this.props.value) {
      this.props.addSubscription(this.props.value);
      this.props.setInput('');
      event.preventDefault();
    }
  };

  render() {
    const formatMessage = this.props.intl.formatMessage;

    return (
      <div className={'page-container'}>
        <div className={'users-page'}>
          <Input
            title={formatMessage(messages.title)}
            placeholder={formatMessage(messages.placeholder)}
            value={this.props.value}
            onChange={this.props.setInput}
            onKeyDown={this.onKeyDown}
          />
          <div className={'subscriptions-list'}>
            {
              this.props.subscriptions.map((subscription) => (
                <div
                  key={subscription.uid}
                  className={'user-info-post'}
                >
                  <Link to={`user/${subscription.uid}`}>
                    <Image
                      src={subscription.photoURL}
                      className={'avatar-icon'}
                    />
                  </Link>
                  <div className={'user-post-info__text'}>
                    <Link to={`user/${subscription.uid}`}>
                      {subscription.displayName}
                    </Link>
                  </div>
                  <button
                    className={'button'}
                    onClick={() => this.props.removeSubscription(subscription)}
                  >X</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

SubscriptionsPage.propTypes = {
  intl: PropTypes.object,
  setInput: PropTypes.func,
  subscriptions: PropTypes.instanceOf(List),
  value: PropTypes.string,
  addSubscription: PropTypes.func,
  removeSubscription: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInput: actions.setInput,
    removeSubscription,
    addSubscription,
    loadSubscriptions,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  loggedIn: makeSelectLoggedIn(),
  subscriptions: makeSelectSubscriptions(),
  value: Selectors.makeSelectValue(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'SubscriptionsPage', reducer });

export default compose(
  withReducer,
  withConnect,
  injectIntl,
)(SubscriptionsPage);
