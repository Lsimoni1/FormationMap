import type { DancerProps } from "./Dancer"
import { cn } from "@/lib/utils"

export interface Formation {
    id: string
    project_id: string
    order_index: number
    dancers: DancerProps[]
}

interface FormationPreviewProps {
    formation: Formation
    index: number
    isActive: boolean
    onClick: () => void
}

const FormationPreview = ({formation, index, isActive, onClick}:FormationPreviewProps) => {
    //some code to pull formation, index, and isActive

    return (
        <div className="relative">
            <div className={cn("bg-gray-200 rounded-md aspect-[4/3] flex items-end justify-end p-2", isActive ? "border-2 border-green-400" : "")} 
                onClick={onClick}>
                {/* thumbnail content */}
                <span className="text-s text-gray-500">{index + 1}</span>
            </div>
        </div>
    )
}

interface FormationMenuProps {
    isViewable: boolean
    formations: Formation[]
    currentFormationIndex: number | null
    setCurrentFormationIndex: React.Dispatch<React.SetStateAction<number | null>>
}

const FormationMenu = ({ isViewable, formations, currentFormationIndex, setCurrentFormationIndex }: FormationMenuProps) => {
    if(formations.length === 0 && isViewable) {
        return (
            <div className="absolute right-0 top-0 h-full w-48 p-3 bg-background border-2">
                <h4 className="scroll-m-20 text-xl font-bold tracking-tight">
                    No Formations Currently Saved
                </h4>
            </div>
        )
    }

    return(
        isViewable && <div className="absolute right-0 top-0 h-full w-48 p-3 bg-background border-2 overflow-y-auto">
            <div className="flex flex-col gap-3">
                {formations.map((formation, i) => (
                <FormationPreview 
                    key = {formation.id}
                    formation={formation}
                    index={formation.order_index}
                    isActive={i === currentFormationIndex}
                    onClick={() => i === currentFormationIndex ? setCurrentFormationIndex(null) : setCurrentFormationIndex(i)}
                />
                ))}
            </div>
        </div>
    )
}

export default FormationMenu;