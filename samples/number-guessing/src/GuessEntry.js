import { Button, ControlGroup, NumericInput } from '@blueprintjs/core';
import { useCallback, useState } from 'react';

const GuessEntry = ({ done, submitGuess }) => {
  const [number, setNumber] = useState('');
  const changeHandler = useCallback(
    (val) => {
      setNumber(val);
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
    <ControlGroup>
      <NumericInput
        disabled={done}
        onValueChange={changeHandler}
        onKeyPress={keypressHandler}
        value={number}
      />
      <Button onClick={clickHandler} disabled={!number} intent="success">
        Submit Guess
      </Button>
    </ControlGroup>
  );
};

export default GuessEntry;
