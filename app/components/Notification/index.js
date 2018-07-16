import React from 'react';
import PropTypes from 'prop-types';

const CANCEL_SYMBOL = 'X';
export default function Notification(props) {
  return (
    <div className={'modal-fullscreen'}>
      <div className={'modal-wrapper'}>
        <div className={'modal-title'}>
          <h6>{props.title}</h6>
        </div>

        <div className={'modal-body'}>
          {props.text}
        </div>

        <div className={'modal-container'}>
          <div className={'buttons-block'}>
            <button onClick={props.onClick}>
              {props.buttonText || CANCEL_SYMBOL}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Notification.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.any,
  title: PropTypes.string,
  buttonText: PropTypes.string,
};
