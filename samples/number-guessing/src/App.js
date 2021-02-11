import './App.css';
import { useCallback, useEffect, useReducer } from 'react';

import { reducer, init, guess } from './state';
import Prompt from './Prompt';
import GuessEntry from './GuessEntry';
import { Button, H1 } from '@blueprintjs/core';

function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const startGame = useCallback(() => dispatch(init(100)), [dispatch]);
  const submitGuess = useCallback((number) => dispatch(guess(number)), [
    dispatch,
  ]);
  useEffect(startGame, [startGame]);

  return (
    <div className="App">
      <H1>Guess A Number</H1>
      <Prompt guesses={state.guesses} msg={state.msg} />
      <GuessEntry done={state.done} submitGuess={submitGuess} />

      <Button
        intent={
          state.done || !state.guesses || state.guesses === 0
            ? 'primary'
            : 'warning'
        }
        onClick={startGame}
      >
        Start New Game
      </Button>
    </div>
  );
}

export default App;
