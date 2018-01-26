import React from 'react';
import Button from './Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const ButtonsGroup = (props) => {
  return (
    <div className='buttons'>
      <Button
        onClick={props.showDifficulty}
        value={'New Game'}
      />
      <Button
        onClick={props.loadGame}
        value={'Load Game'}
      />
      <CopyToClipboard 
        text={props.board.map(tile => tile.value).join('')}
        onCopy={props.onCopy}>
        <Button
          value={'Copy State'}
        />
      </CopyToClipboard>
      <Button 
        sudokuFunction={props.check}
        value={'Check'}
      />
      <Button
        sudokuFunction={props.solve}
        value={'Solve'}
      />
      <Button
        onClick={props.restart}
        value={'Restart'}
      />
    </div>
  );
}

export default ButtonsGroup;