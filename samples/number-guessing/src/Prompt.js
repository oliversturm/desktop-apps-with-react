import { useEffect, useState } from 'react';

const stdMsg = 'Guess a number from 1 to 100';

const Prompt = ({ guesses, msg }) => {
  const [viewMsg, setViewMsg] = useState('');

  useEffect(() => {
    if (!guesses) {
      setViewMsg('Starting new game');
      setTimeout(() => setViewMsg(stdMsg), 1000);
    } else {
      setViewMsg(msg + ` (${guesses || 0} tries)`);
    }
  }, [guesses, msg, setViewMsg]);

  return <div className="bp3-ui-text">{viewMsg}</div>;
};

export default Prompt;
