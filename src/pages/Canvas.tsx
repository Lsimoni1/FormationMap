import StageDiagram from "../components/StageDiagram";
import FloatingToolbar from "../components/FloatingToolbar";
import { ToolProvider } from "../contexts/ToolContext";
import { useParams } from "react-router-dom";
import CanvasHeader from "@/components/CanvasHeader";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const Canvas = () => {
  const { projectId } = useParams<{projectId: string}>()
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    const fetchProjectName = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select()
        .eq("id", projectId)
      if(error != null) {
        return
      } else {
        setProjectName(data[0].name)
      }
    }
    fetchProjectName()
  }, [])
  

  return (
    <ToolProvider>
      <div className="flex flex-col h-screen">
        <CanvasHeader 
        projectTitle={projectName} 
        onPrev={() => {}}
        onNext={() => {}}
        onSave={() => {}}
        onMenuToggle={() => {}}
        />
        <StageDiagram projectId={projectId!}/>
        <FloatingToolbar />
      </div>
    </ToolProvider>
  );
};

export default Canvas;
