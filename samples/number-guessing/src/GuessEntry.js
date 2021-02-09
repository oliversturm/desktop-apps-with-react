import { useCallback, useState } from 'react';

const GuessEntry = ({ done, submitGuess }) => {
  const [number, setNumber] = useState('');
  const changeHandler = useCallback(
    (e) => {
      setNumber(e.target.value);
    },
    [setNumber]
  );
  const clickHandler = useCallback(() => {
    submitGuess(number);
    setNumber('');
  }, [number, submitGuess]);

  const keypressHandler = useCallback(
    (e) => {
      if (e.which === 13) clickHandler();
    },
    [clickHandler]
  );

  return (
    <div>
      <input
        type="text"
        disabled={done}
        onChange={changeHandler}
        onKeyPress={keypressHandler}
        value={number}
      ></input>
      <button onClick={clickHandler} disabled={!number}>
        Submit Guess
      </button>
    </div>
  );
};

export default GuessEntry;
