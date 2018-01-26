import React from 'react';
import Button from './Button';
import '../Styles/DifficultyButtons.css'

const difficultyButtons = (props) => {
  return (
    <div className='difficulty-buttons'>
      <Button 
        onClick={props.processGame}
        value={'Easy'}
        disabled={props.disabled}
        className={props.klass}
      />
      <Button 
        onClick={props.processGame}
        value={'Medium'}
        disabled={props.disabled}
      />
      <Button
        onClick={props.processGame}
        value={'Hard'}
        disabled={props.disabled}
      />
    </div>
  )
}

export default difficultyButtons;
