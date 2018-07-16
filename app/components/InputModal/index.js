import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Input from '../Input';

export class InputModal extends React.Component {
  state = { text: '' };

  componentWillMount = () => this.setState({text: this.props.defaultText || ''});

  onKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      this.onSubmit();
      e.preventDefault();
    }
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.text);
    this.props.toggleModal();
  };

  setText = (text) => this.setState({ text });

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
            <h6>{this.props.title}</h6>
          </div>

          <div className={'modal-container'}>
            <Input
              onChange={this.setText}
              placeholder={this.props.placeholder}
              value={this.state.text}
              onKeyDown={this.onKeyDown}
              textarea={this.props.textarea}
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

InputModal.propTypes = {
  textarea: PropTypes.bool,
  toggleModal: PropTypes.func,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  defaultText: PropTypes.string,
};

export default injectIntl(InputModal);
