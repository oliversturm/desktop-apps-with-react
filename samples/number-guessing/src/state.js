const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return { number: Math.floor(Math.random() * action.max + 1) };

    case 'guess':
      if (!state.number || state.done)
        throw new Error(`Wrong state ${state} for action 'guess'`);
      if (action.value == state.number)
        return {
          ...state,
          guesses: (state.guesses || 0) + 1,
          done: true,
          msg: `You got it in ${state.guesses + 1}!`,
        };
      else
        return {
          ...state,
          guesses: (state.guesses || 0) + 1,
          msg: `${action.value} is too ${
            action.value < state.number ? 'small' : 'large'
          }`,
        };

    default:
      throw new Error('Unknown action type');
  }
};

const init = (max) => ({ type: 'init', max });
const guess = (value) => ({ type: 'guess', value });

export { reducer, init, guess };
