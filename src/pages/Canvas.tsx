import StageDiagram from "../components/StageDiagram";
import FloatingToolbar from "../components/FloatingToolbar";
import FormationMenu from "@/components/FormationMenu";
import { ToolProvider } from "../contexts/ToolContext";
import { useParams } from "react-router-dom";
import CanvasHeader from "@/components/CanvasHeader";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import type { Formation } from "@/components/FormationMenu";
import type { DancerProps } from "@/components/Dancer";

// const MOCK_FORMATIONS: Formation[] = [
//   { id: "1", project_id: "test", order_index: 0, dancers: [] },
//   { id: "2", project_id: "test", order_index: 1, dancers: [] },
//   { id: "3", project_id: "test", order_index: 2, dancers: [] },
//   { id: "4", project_id: "test", order_index: 3, dancers: [] },
//   { id: "5", project_id: "test", order_index: 4, dancers: [] },
//   { id: "6", project_id: "test", order_index: 5, dancers: [] },
//   { id: "7", project_id: "test", order_index: 6, dancers: [] },
// ]

const Canvas = () => {
  const { projectId } = useParams<{projectId: string}>()
  const [projectName, setProjectName] = useState("")
  const [menuActive, setMenuActive] = useState(false)
  const [dancers, setDancers] = useState<DancerProps[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [currentFormationIndex, setCurrentFormationIndex] = useState<number|null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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

  useEffect(() => {
    const fetchFormations = async () => {
      const { data, error } = await supabase
        .from("formations")
        .select()
        .eq("project_id", projectId)
      if(error != null) {
        return
      } else {
        setFormations(data)
      }
    }
    fetchFormations()
  }, [])

  //some functions to determine whether the current formation has unsaved changes
  useEffect(() => {
    if(dancers.length > 0) {
      setHasUnsavedChanges(true)
    }
  }, [dancers])

  useEffect(() => {
    setHasUnsavedChanges(false)
  }, [currentFormationIndex])

  //some function to pull all formations belonging to a project,
  //that can be passed to FormationMenu and CanvasHeader 
  const handleSave = async () => {

    if(currentFormationIndex !== null) {
      const{ data, error} = await supabase
        .from("formations")
        .update({dancers: dancers})
        .eq("id", formations[currentFormationIndex].id)
      if(error) {
        console.error("Error updating formation:", error);
      } else {
        console.log("Formation updated successfully!")
        setFormations(prevFormations  => prevFormations.map(
          (prevFormation) => prevFormation.id === formations[currentFormationIndex].id
        ? {...prevFormation, dancers: dancers} :
        prevFormation))
        setHasUnsavedChanges(false)
      }
    } else {
      const { data, error } = await supabase
      .from("formations")
      .insert({
        project_id: projectId!,
        order_index: formations.length,
        dancers: dancers
      })
      .select()

      if(error) {
        console.error("Error saving formation:", error);
      } else {
        console.log("Formation saved successfully!");
        setFormations([...formations, data[0]])
        setHasUnsavedChanges(false)
      }
    }
  }

  return (
    <ToolProvider>
      <div className="flex flex-col h-screen">
        <CanvasHeader 
          projectTitle={projectName} 
          onPrev={() => setCurrentFormationIndex(currentFormationIndex === null ? null : Math.max(0, currentFormationIndex - 1))}
          onNext={() => setCurrentFormationIndex(currentFormationIndex === null ? 0 : Math.min(formations.length - 1, currentFormationIndex + 1))}
          onSave={handleSave}
          onMenuToggle={() => setMenuActive(!menuActive)}
          currentFormationIndex={currentFormationIndex}
          formations={formations}
          unsavedChanges={hasUnsavedChanges}
        />
        <div className="relative flex-1 overflow-hidden">
          <StageDiagram 
            projectId={projectId!} 
            dancers={dancers} 
            setDancers={setDancers} 
            currentFormationIndex={currentFormationIndex}
            formations={formations} 
          />
          <FormationMenu 
            isViewable={menuActive} 
            formations={formations} 
            currentFormationIndex={currentFormationIndex}
            setCurrentFormationIndex={setCurrentFormationIndex}
          />
        </div>
        <FloatingToolbar />
      </div>
    </ToolProvider>
  );
};

export default Canvas;
