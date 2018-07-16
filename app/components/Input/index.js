import React from 'react';
import PropTypes from 'prop-types';
import './input.css';

export default function Input(props) {
  const { textarea, onChange, ...rest } = props;

  return (
    <div>
      {
        props.title &&
        <div className={'input-title'}>{props.title}</div>
      }
      {
        textarea ?
          <textarea
            className="input"
            onChange={(e) => onChange(e.target.value)}
            {...rest}
          /> :
          <input
            className="input"
            onChange={(e) => onChange(e.target.value)}
            {...rest}
          />
      }
    </div>
  );
}

Input.propTypes = {
  textarea: PropTypes.bool,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
};
