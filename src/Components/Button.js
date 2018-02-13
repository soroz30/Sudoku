import React from 'react';
import '../Styles/Button.css';

const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
    >{props.value}</button>
  );
}

export default Button;
