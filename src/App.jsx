import { ReactFlowProvider } from '@xyflow/react';
import FlowCanvas from './components/FlowCanvas.jsx';
import '@xyflow/react/dist/style.css';

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
