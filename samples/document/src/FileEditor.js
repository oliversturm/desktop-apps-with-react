import { TextArea } from '@blueprintjs/core';
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const FileEditor = ({ file }) => {
  const [textContent, setTextContent] = useState();

  useEffect(() => {
    setTextContent(file.data);
  }, [file]);

  const contentChanged = useCallback(
    (e) => {
      setTextContent(e.target.value);
    },
    [setTextContent]
  );

  return (
    <div className="editorFrame">
      <TextArea value={textContent} fill={true} onChange={contentChanged} />
      <div className="bp3-running-text">
        <ReactMarkdown source={textContent} />
      </div>
    </div>
  );
};

export default FileEditor;
