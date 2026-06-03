import StageDiagram from "../components/StageDiagram";
import FloatingToolbar from "../components/FloatingToolbar";
import FormationMenu from "@/components/FormationMenu";
import { ToolProvider } from "../contexts/ToolContext";
import { useParams } from "react-router-dom";
import CanvasHeader from "@/components/CanvasHeader";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import type { Formation } from "@/components/FormationMenu";

const MOCK_FORMATIONS: Formation[] = [
  { id: "1", project_id: "test", order_index: 0, dancers: [] },
  { id: "2", project_id: "test", order_index: 1, dancers: [] },
  { id: "3", project_id: "test", order_index: 2, dancers: [] },
  { id: "4", project_id: "test", order_index: 3, dancers: [] },
  { id: "5", project_id: "test", order_index: 4, dancers: [] },
  { id: "6", project_id: "test", order_index: 5, dancers: [] },
  { id: "7", project_id: "test", order_index: 6, dancers: [] },
]

const Canvas = () => {
  const { projectId } = useParams<{projectId: string}>()
  const [projectName, setProjectName] = useState("")
  const [menuActive, setMenuActive] = useState(false)

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
  
  //some function to pull all formations belonging to a project,
  //that can be passed to FormationMenu and CanvasHeader 

  return (
    <ToolProvider>
      <div className="flex flex-col h-screen">
        <CanvasHeader 
        projectTitle={projectName} 
        onPrev={() => {}}
        onNext={() => {}}
        onSave={() => {}}
        onMenuToggle={() => setMenuActive(!menuActive)}
        />
        <div className="relative flex-1 overflow-hidden">
          <StageDiagram projectId={projectId!}/>
          <FormationMenu isViewable={menuActive} formations={MOCK_FORMATIONS} />
        </div>
        <FloatingToolbar />
      </div>
    </ToolProvider>
  );
};

export default Canvas;
