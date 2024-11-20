import React, { useEffect, useRef } from 'react';
import { createMarimoNotebook } from '../utils/marimo';

interface MarimoNotebookProps {
  assistantCode: string;
  onExecutionComplete?: (result: string) => void;
}

export const MarimoNotebook: React.FC<MarimoNotebookProps> = ({
  assistantCode,
  onExecutionComplete
}) => {
  const notebookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (assistantCode) {
      createMarimoNotebook(assistantCode, notebookRef.current)
        .then(result => onExecutionComplete?.(result));
    }
  }, [assistantCode]);

  return (
    <div className="marimo-container">
      <div ref={notebookRef} className="marimo-notebook" />
    </div>
  );
}; 