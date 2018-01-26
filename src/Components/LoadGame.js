import React, { Component } from 'react';
import Animate from 'react-move/Animate';
import '../Styles/App.css'
import '../Styles/LoadGame.css'


class LoadGame extends Component {
  state = {
    input: '',
    error: false,
  }

  handleChange = (event) => {
    this.setState({input: event.target.value});
  }

  loadGame = (event) => {
    event.preventDefault();
    this.validateData() ? this.props.newGame(null, this.state.input) : this.showError();
  }

  validateData = () => {
    return this.state.input.split('')
                    .filter(tile => tile.match(/^[1-9.]$/))
                    .length === 81;
  }

  showError = () => {
    this.setState({...this.state, error: true});
    setTimeout(() => this.setState({ ...this.state, error: false }), 2000);
  }

  render() {
    return (
      <div className='load-game'>
        <form 
          onSubmit={this.loadGame}
        >
          <input className='load-input' type='text' onChange={this.handleChange}/>
          <input className='load-submit' type='submit' value='Send' />
        </form>
        <Animate
          show={this.state.error}
          {...this.props.animateProps}
        >
          {({ opacity }) => <span style={{opacity}}>Wrong Sudoku data</span>}
        </Animate>
      </div>
    )
  }
}

export default LoadGame;
