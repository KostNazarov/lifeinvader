import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import './modal.css';
import Input from '../Input';
import messages from './messages';

export class ChangePhotoModal extends React.Component {
  state = { url: this.props.url || '' };

  componentWillMount = () => this.setState({ url: this.props.defaultText });

  onSubmit = () => {
    this.props.onSubmit(this.state.url);
    this.props.toggleModal();
  };

  setURL = (url) => this.setState({ url });

  render() {
    return (
      <div
        className={'modal-fullscreen'}
        onClick={(e) => e.target === e.currentTarget && this.props.toggleModal()}
        role={'button'}
        tabIndex={0}
      >
        <div className={'modal-wrapper'}>
          <div className={'modal-title'}>
            <h6>
              <FormattedMessage {...messages.title} />
            </h6>
          </div>
          <div className={'modal-container'}>
            <img
              src={this.state.url || this.props.url}
              className={'avatar modal-image'}
              alt={'Current avatar'}
            />
            <Input
              onChange={this.setURL}
              value={this.state.url}
              placeholder={this.props.intl.formatMessage(messages.inputPlaceholder)}
              textarea
            />
            <div className={'buttons-block'}>
              <button onClick={this.props.toggleModal}>
                <FormattedMessage id={'cancel'} />
              </button>
              <button onClick={this.onSubmit}>
                <FormattedMessage id={'submit'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChangePhotoModal.propTypes = {
  intl: PropTypes.object,
  toggleModal: PropTypes.func,
  onSubmit: PropTypes.func,
  url: PropTypes.string,
  defaultText: PropTypes.string,
};

export default injectIntl(ChangePhotoModal);
