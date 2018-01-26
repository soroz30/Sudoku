import React, { Component } from 'react';
import '../Styles/Button.css';

class Button extends Component {
  state = {
    className: '',
  }

  handleClick = () => {
    if (!this.props.sudokuFunction) { return; }
    const result = this.props.sudokuFunction();
    if (result) {
      this.setState({className: 'correct'});
      setTimeout(() => this.setState({className: ''}), 1000);
    } else {
      this.setState({className: 'wrong'});
      setTimeout(() => this.setState({className: ''}), 1000);
    }
  } 

  render() {
    return (
      <button 
        className={`${this.state.className}`}
        onClick={this.props.onClick ? this.props.onClick : this.handleClick}
        disabled={this.props.disabled}
      >{this.props.value}</button>
    );
  }
}

export default Button;
