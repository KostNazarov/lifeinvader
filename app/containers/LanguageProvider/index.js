/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import PropTypes from 'prop-types';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import './languageprovider.css';
import * as Selectors from './selectors';
import reducer from './reducer';
import * as actions from './actions';
import saga from './saga';

const locales = ['en', 'ru', 'os', 'uk'];

export class LanguageProvider extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <IntlProvider
          locale={this.props.locale}
          key={this.props.locale}
          messages={this.props.messages[this.props.locale]}
        >
          {React.Children.only(this.props.children)}
        </IntlProvider>
        <div className={'language-list'}>
          {
            locales.map((lang) => (
              <button
                key={lang}
                onClick={() => this.props.changeLocale(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))
          }
        </div>
      </div>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
  changeLocale: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeLocale: actions.changeLocale,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  locale: Selectors.makeSelectLocale(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'language', reducer });
const withSaga = injectSaga({ key: 'language', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LanguageProvider);
