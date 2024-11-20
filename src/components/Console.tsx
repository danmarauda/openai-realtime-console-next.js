import { MarimoNotebook } from './MarimoNotebook';

export const Console: React.FC = () => {
  const handleExecution = (result: string) => {
    // Handle execution results
    console.log('Code execution result:', result);
  };

  return (
    <div className="console">
      <MarimoNotebook 
        assistantCode={generatedCode}
        onExecutionComplete={handleExecution}
      />
    </div>
  );
}; 