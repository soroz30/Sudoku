import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../Styles/Tile.css';

class Tile extends Component {
  state = {
    value: this.props.value,
  }

  componentWillReceiveProps(newProps) {
    this.setState({ value: newProps.value });
  }

  handleTileChange = (event) => {
    let value = event.target.value;
    if (value.match(/^[1-9]$/) || !value) {
      const index = this.props.index;
      value = value || '.';
      this.props.changeBoard({
        value,
        index,
      });
    }
  }

  handleAccept = (event) => {
    if (['Escape', 'Enter'].indexOf(event.key) !== -1) {
      ReactDOM.findDOMNode(this).blur();
    }
  }

  clearActiveLine = () => {
    this.props.changeActiveLines({});
  }

  changeActive = () => {
    this.props.changeActiveLines(this.props.position);
  }

  render() {
    return(
      <input
        className={`input ${this.props.tileClass || ''}`}
        type='number'
        onChange={this.handleTileChange}
        onKeyDown={this.handleAccept}
        onFocus={this.changeActive}
        onBlur={this.clearActiveLine}
        value={this.state.value}
      />
    )
  }
}

export default Tile;
