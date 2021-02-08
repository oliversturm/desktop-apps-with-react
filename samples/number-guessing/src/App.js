import './App.css';
import { useCallback, useEffect, useReducer } from 'react';

import { reducer, init, guess } from './state';
import Prompt from './Prompt';
import GuessEntry from './GuessEntry';

function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const startGame = useCallback(() => dispatch(init(100)), [dispatch]);
  const submitGuess = useCallback((number) => dispatch(guess(number)), [
    dispatch,
  ]);
  useEffect(startGame, [startGame]);

  return (
    <div className="App">
      <h1>Guess A Number</h1>
      <Prompt guesses={state.guesses} msg={state.msg} />
      <GuessEntry done={state.done} submitGuess={submitGuess} />

      <button onClick={startGame}>Start New Game</button>
    </div>
  );
}

export default App;
