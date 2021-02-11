import './App.css';
import { Button, Navbar, Tab, Tabs } from '@blueprintjs/core';
import { useCallback, useReducer } from 'react';
import { openFileAction, reducer, selectFilePathAction } from './state';
import FileEditor from './FileEditor';

function App() {
  const [state, dispatch] = useReducer(reducer, {
    currentFilePath: '',
    files: [],
  });

  const dummyButton = () => {
    window.api.dummyButton();
  };

  const openFile = useCallback(() => {
    window.api.openFile().then((res) => {
      if (res) {
        const { path, viewName, data } = res;
        dispatch(openFileAction(path, viewName, data));
      }
    });
  }, [dispatch]);

  const tabChange = useCallback(
    (fp) => {
      dispatch(selectFilePathAction(fp));
    },
    [dispatch]
  );

  return (
    <div className="App">
      <Navbar>
        <Navbar.Group>
          <Button icon="document-open" text="Open" onClick={openFile} />
          <Navbar.Divider />
          <Button text="More buttons here..." onClick={dummyButton} />
        </Navbar.Group>
      </Navbar>

      <Tabs id="top" selectedTabId={state.currentFilePath} onChange={tabChange}>
        {state.files.map((f, i) => (
          <Tab
            key={i}
            id={f.path}
            title={f.viewName}
            panel={<FileEditor file={f} />}
          />
        ))}
      </Tabs>
    </div>
  );
}

export default App;
