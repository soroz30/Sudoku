import React, { Component } from 'react';
import Tile from './Tile';
import './Board.css';
import pick from 'lodash/pick';

const checkPosition = (position, activeLine) => {
  const checkIfActive = Object.keys(position).some(pos => {
    return position[pos] === activeLine[pos]
  })
  if (!checkIfActive) { return; }
  if (position.row === activeLine.row 
      && position.column === activeLine.column) {
      return 'targeted';
  } else {
      return 'active';
  }
}

const Board = ({ board, changeBoard, changeActiveLines, activeLine }) => {
  return (
    <div className='board'>{board.map(field => {
      const value = field.value === '.' ? '' : field.value;
      const position = pick(field, ['column', 'row', 'block']);
      const tileClass = checkPosition(position, activeLine);
      return <Tile
               key={field.index}
               index={field.index}
               value={value}
               position={position}
               tileClass={tileClass}
               changeBoard={changeBoard}
               changeActiveLines={changeActiveLines}
              />
      })}
      </div>
  )
}

export default Board;
