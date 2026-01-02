import StageDiagram from "../components/StageDiagram";
import FloatingToolbar from "../components/FloatingToolbar";
import { ToolProvider } from "../contexts/ToolContext";

const Dashboard = () => {
  return (
    <ToolProvider>
      <StageDiagram />
      <FloatingToolbar />
    </ToolProvider>
  );
};

export default Dashboard;
