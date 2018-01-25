import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board';
import Button from './Button'
import sudoku from 'sudoku-umd';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class App extends Component {
  state = {
    initialBoard: '',
    board: [...Array(81)].map((_, index) => {
      return { value: '.', index } 
    }),
    previousBoards: [],
    activeLine: {},
    difficultyOpen: false,
    wrongInputs: false,
    flowButtons: false,
    currentIterator: 0,
    copied: false,
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('sudoku', JSON.stringify(nextState));
  }

  componentWillMount() {
    localStorage.getItem('sudoku') && this.setState(JSON.parse(localStorage.getItem('sudoku')));
  }

  fillBoardWithBlockData = (board) => {
    for (let i = 0; i < 81; i += 27) {
      for (let index = i; index < i + 27; index++) {
        const column = board[index].column;
        if (column < 3) {
          board[index].block = 0 + (i / 27) * 3;
        } else if (column < 6) {
          board[index].block = 1 + (i / 27) * 3;
        } else {
          board[index].block = 2 + (i / 27) * 3;
        }
      }
    }
  }

  newGame = (difficulty) => {
    let newBoard = sudoku.generate(difficulty).split('').map((value, index) => {
      const row = Math.floor(index / 9);
      const column = index % 9;

      return {value, index, row, column}
    });
    this.fillBoardWithBlockData(newBoard);
    this.setState({
      ...this.state,
      initialBoard: newBoard,
      previousBoards: [newBoard],
      board: newBoard,
      difficultyOpen: false,
      flowButtons: true,
      currentIterator: 0,
    });
  }

  restart = () => {
    if (this.state.initialBoard) {
      this.setState({
        ...this.state,
        board: this.state.initialBoard,
        flowButtons: true,
      });
    }
  }

  checkSudoku = () => {
    //spytac sie co zrobic kiedy wywala error jak plansza jest pusta
    const actualSudoku = this.state.board.map(field => field.value).join('');
    return sudoku.solve(actualSudoku);
  }

  solve = () => {
    let solvedSudoku = this.checkSudoku();
    if (solvedSudoku) {
      let solvedBoard = [...this.state.board];
      solvedSudoku.split('').forEach((value, index) => {
        solvedBoard[index] = Object.assign({}, solvedBoard[index], {
                                value,
                              })
      });
      this.setState({
        ...this.state,
        board: solvedBoard,
        flowButtons: false,
      });
      return true;
    } else {
      this.showAndHideWrongInputs();
    }
  }

  check = () => {
    if (this.checkSudoku()) {
      return true
    } else {
      this.showAndHideWrongInputs();
    }
  }

  showAndHideWrongInputs = () => {
    this.setState({
      ...this.state,
      wrongInputs: true,
    });
    setTimeout(() => {
      this.setState({
        ...this.state,
        wrongInputs: false
      });
    }, 1250)
  }

  changeBoard = (attrs) => {
    const newBoard = [...this.state.board];
    newBoard[attrs.index] = Object.assign({}, newBoard[attrs.index], {
                              value: attrs.value,
                              index: attrs.index,
                            });
    const previousBoards = this.setPreviousBoards();
    this.setState({
      ...this.state,
      board: newBoard,
      previousBoards: [newBoard,...previousBoards],
      currentIterator: 0,
    });
  }

  setPreviousBoards = () => {
    if (this.state.currentIterator === 0) {
      return this.state.previousBoards;
    } else {
      const currentIterator = this.state.currentIterator;
      return this.state.previousBoards.slice(currentIterator);
    }
  }

  changeActiveLines = (active) => {
    this.setState({
      ...this.state,
      activeLine: {
        row: active.row,
        column: active.column,
        block: active.block,
      }
    });
  }

  showDifficulty = () => {
    this.setState({
      ...this.state,
      difficultyOpen: true,
      flowButtons: false,
    })
  }

  processGame = (event) => {
    this.newGame(event.target.innerText.toLowerCase());
  }

  undo = () => {
    const currentIterator = this.state.currentIterator + 1;
    const previousBoard = this.state.previousBoards[currentIterator];
    if (previousBoard) {
      this.setState({
        ...this.state,
        board: previousBoard,
        currentIterator: currentIterator,
      });
    }
  }

  redo = () => {
    const currentIterator = this.state.currentIterator - 1;
    const nextBoard = this.state.previousBoards[currentIterator];
    if (nextBoard) {
      this.setState({
        ...this.state,
        board: nextBoard,
        currentIterator: currentIterator,
      })
    }
  }

  copied = () => {
    this.setState({
      ...this.state,
      copied: true,
    });
    setTimeout(() => {
      this.setState({
        ...this.state,
        copied: false,
      })
    }, 2000);
  }

  render() {
    return (
      <div className='App'>
        <h1>Sudoku</h1>
        <Board 
          board={this.state.board}
          changeBoard={this.changeBoard}
          activeLine={this.state.activeLine}
          changeActiveLines={this.changeActiveLines}
        />
          <div className='buttons'>
            <div className={this.state.flowButtons ? 'show' : 'hide'}>
                <Button 
                   sudokuFunction={this.check}
                   value={'Check'}
                />
                <Button
                  onClick={this.undo}
                  value={'Undo'}
                  upperButton={'upperButton'}
                />
                <Button
                  onClick={this.redo}
                  value={'Redo'}
                  upperButton={'upperButton'}
                />
                <CopyToClipboard 
                  text={this.state.board.map(tile => tile.value).join('')}
                  onCopy={this.copied}>
                  <Button
                    value={'Copy state'}
                    upperButton={'upperButton'}
                  />
                </CopyToClipboard>
            </div>
            {this.state.copied ?  <span className="copied">Copied!</span> : null}
            <Button
              onClick={this.showDifficulty}
              value={'New Game'}
            />
            <Button
              onClick={this.loadState}
              value={'Load State'}
            />
            <Button
              sudokuFunction={this.solve}
              value={'Solve'}
            />
            <Button
              onClick={this.restart}
              value={'Restart'}
            />
        </div>
        <p className={this.state.wrongInputs ? 'show' : 'hide'}>There are wrong inputs on Sudoku</p>
        <div className={this.state.difficultyOpen ? 'show' : 'hide'}>
          <Button 
            onClick={this.processGame}
            value={'Easy'}
          />
          <Button 
            onClick={this.processGame}
            value={'Medium'}
          />
          <Button
            onClick={this.processGame}
            value={'Hard'}
          />
        </div>
      </div>
    );
  }
}

export default App;
