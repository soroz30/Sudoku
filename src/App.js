import React, { Component } from 'react';
import './Styles/App.css';
import Board from './Components/Board';
import Button from './Components/Button';
import LoadGame from './Components/LoadGame';
import ButtonsGroup from './Components/ButtonsGroup';
import DifficultyButtons from './Components/DifficultyButtons';
import sudoku from 'sudoku-umd';
import Animate from 'react-move/Animate';

class App extends Component {
  state = {
    initialBoard: '',
    board: [...Array(81)].map((_, index) => {
      return { value: '.', index };
    }),
    previousBoards: [],
    activeLine: {},
    difficultyOpen: false,
    wrongInputs: false,
    currentIterator: 0,
    copied: false,
    loadGame: false,
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('sudoku', JSON.stringify({
      ...nextState,
      copied: false,
      loadGame: false,
      activeLine: {},
      difficultyOpen: false,
      wrongInputs: false,
    }));
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

  newGame = (difficulty, loadData) => {
    let newBoard = this.createNewBoard(difficulty, loadData);
    this.fillBoardWithBlockData(newBoard);
    this.setState({
      ...this.state,
      initialBoard: newBoard,
      previousBoards: [newBoard],
      board: newBoard,
      difficultyOpen: false,
      loadGame: false,
      currentIterator: 0,
    });
  }

  createNewBoard = (difficulty, loadData) => {
    if (difficulty) {
      return this.generateNewSudoku(difficulty);
    } else {
      return this.generateFromLoad(loadData);
    }
  }

  generateNewSudoku = (difficulty) => {
    return this.generateSudoku(sudoku.generate(difficulty));
  }

  generateFromLoad = (loadData) => {
    return this.generateSudoku(loadData);
  }

  generateSudoku = (sudokuString) => {
    return sudokuString.split('').map((value, index) => {
      const row = Math.floor(index / 9);
      const column = index % 9;

      return {value, index, row, column};
    });
  }

  processGame = (event) => {
    this.newGame(event.target.innerText.toLowerCase());
  }

  restart = () => {
    if (this.state.initialBoard) {
      this.setState({
        ...this.state,
        board: this.state.initialBoard,
        difficultyOpen: false,
        loadGame: false,
      });
    }
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
      difficultyOpen: false,
      loadGame: false,
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
      difficultyOpen: false,
      loadGame: false,
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
      loadGame: false,
      copied: false,
      wrongInputs: false,
    });
  }

  undo = () => {
    const currentIterator = this.state.currentIterator + 1;
    const previousBoard = this.state.previousBoards[currentIterator];
    if (previousBoard) {
      this.setState({
        ...this.state,
        board: previousBoard,
        currentIterator: currentIterator,
        difficultyOpen: false,
        loadGame: false,
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
        difficultyOpen: false,
        loadGame: false,
      });
    }
  }

  checkSudoku = () => {
    //Co zrobic kiedy wywala error jak plansza jest pusta
    const sudokuBoard = this.state.board.map(field => field.value).join('');
    return sudoku.solve(sudokuBoard);
  }

  solve = () => {
    let solvedSudoku = this.checkSudoku();
    if (solvedSudoku) {
      let solvedBoard = [...this.state.board];
      solvedSudoku.split('').forEach((value, index) => {
        solvedBoard[index] = Object.assign({}, solvedBoard[index], {
                               value,
                             });
      });
      this.setState({
        ...this.state,
        board: solvedBoard,
        difficultyOpen: false,
        loadGame: false,
      });
      return true;
    } else {
      this.showAndHideInputsWarning();
    }
  }

  check = () => {
    if (this.checkSudoku()) {
      this.hideButtons();
      return true
    } else {
      this.showAndHideInputsWarning();
    }
  }

  hideButtons = () => {
    this.setState({
      ...this.state,
      difficultyOpen: false,
      loadGame: false,
    });
  }

  showAndHideInputsWarning = () => {
    this.setState({
      ...this.state,
      wrongInputs: true,
      difficultyOpen: false,
      loadGame: false,
      copied: false,
    });
    setTimeout(() => {
      this.setState({
        ...this.state,
        wrongInputs: false,
      });
    }, 2000);
  }

  copied = () => {
    this.setState({
      ...this.state,
      copied: true,
      difficultyOpen: false,
      wrongInputs: false,
      loadGame: false,
    });
    setTimeout(() => {
      this.setState({
        ...this.state,
        copied: false,
      })
    }, 1500);
  }

  loadGame = () => {
    this.setState({
      ...this.state,
      loadGame: true,
      difficultyOpen: false,
      copied: false,
      wrongInputs: false,
    });
  }

  render() {
    const animateProps = {
            start: { opacity: 0 },
            enter: {
              opacity: [1],
              timing: { duration: 750 },
            },
            leave: {
              opacity: [0],
              timing: { duration: 250 },
            }
          };
    return (
      <div className='App'>
        <h1>Sudoku</h1>

          <div className='board-container'>
            <Button
              onClick={this.undo}
              value={'Undo'}
            />
            <Board 
              board={this.state.board}
              changeBoard={this.changeBoard}
              activeLine={this.state.activeLine}
              changeActiveLines={this.changeActiveLines}
            />
            <Button
              onClick={this.redo}
              value={'Redo'}
            />
          </div>
          
          <ButtonsGroup 
            showDifficulty={this.showDifficulty}
            loadGame={this.loadGame}
            board={this.state.board}
            onCopy={this.copied}
            check={this.check}
            solve={this.solve}
            restart={this.restart}
          />

          <div class="hide-container">
            <Animate
              show={this.state.difficultyOpen}
              {...animateProps}
            >
              {({ opacity }) => {
                return (
                  <div style={{opacity}}>
                    <DifficultyButtons 
                      processGame={this.processGame}
                      disabled={!this.state.difficultyOpen}  
                      animateProps={animateProps}
                    />
                  </div>
                )
              }}
            </Animate>
            <Animate
              show={this.state.loadGame}
              {...animateProps}
            >
              {({ opacity }) => {
                return (
                  <div style={{opacity}}>
                    <LoadGame 
                      disabled={!this.state.loadGame}
                      newGame={this.newGame}
                      animateProps={animateProps}
                    />
                  </div>
                )
              }}
            </Animate>
            <Animate
              show={this.state.copied}
              {...animateProps}
            >
              {({ opacity }) => <span style={{opacity}}>Copied!</span>}
            </Animate>
            <Animate
              show={this.state.wrongInputs}
              {...animateProps}
            >
              {({ opacity }) => <span style={{opacity}}>There are wrong inputs on Sudoku</span>}
            </Animate>
          </div>
      </div>
    );
  }
}

export default App;
