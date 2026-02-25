import StageDiagram from "../components/StageDiagram";
import FloatingToolbar from "../components/FloatingToolbar";
import { ToolProvider } from "../contexts/ToolContext";

const Canvas = () => {
  return (
    <ToolProvider>
      <StageDiagram />
      <FloatingToolbar />
    </ToolProvider>
  );
};

export default Canvas;
