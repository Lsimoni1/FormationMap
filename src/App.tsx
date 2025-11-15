//import { useState } from "react";
import StageDiagram from "./components/StageDiagram";
import FloatingToolbar from "./components/FloatingToolbar";
import {ToolProvider} from "./contexts/ToolContext";
import { Login } from "./pages/Login";
import "./App.css";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      {/* <ToolProvider>
        <StageDiagram/>
        <FloatingToolbar/>
      </ToolProvider>     */}
      <Login/>
    </>
  );
}

export default App;
