const reducer = (state, action) => {
  switch (action.type) {
    case 'openFile':
      return {
        ...state,
        currentFilePath: action.path,
        files: state.files.concat({
          path: action.path,
          viewName: action.viewName,
          data: action.data,
        }),
      };

    case 'selectFilePath':
      return { ...state, currentFilePath: action.filePath };

    default:
      throw new Error(`Undefined action type ${action.type}`);
  }
};

const openFileAction = (path, viewName, data) => ({
  type: 'openFile',
  path,
  viewName,
  data,
});

const selectFilePathAction = (filePath) => ({
  type: 'selectFilePath',
  filePath,
});

export { reducer, openFileAction, selectFilePathAction };
