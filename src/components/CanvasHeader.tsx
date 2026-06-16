import { ArrowUpLeft, ChevronLeft, ChevronRight, Plus, AlignJustify, Save} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import type { Formation } from './FormationMenu';


interface CanvasHeaderProps {
    projectTitle: string
    onPrev: () => void
    onNext: () => void
    onSave: () => void
    onMenuToggle: () => void
    currentFormationIndex: number | null
    formations: Formation[]
    unsavedChanges: boolean
}

const CanvasHeader = ({projectTitle, onPrev, onNext, onSave, onMenuToggle, currentFormationIndex, formations, unsavedChanges}: CanvasHeaderProps) => {
    const navigate = useNavigate();
    let contextLabel = ""


    if(currentFormationIndex !== null && formations.length > 0) {
        contextLabel = "Editing Formation " + (formations[currentFormationIndex].order_index + 1)
    } else {
        contextLabel = "Editing New Formation"
    }

    if(unsavedChanges) {
        contextLabel += " - Unsaved Changes"
    }

    return(
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-gray-300"> {/* container for header */}

            <div className="flex gap-4 "> {/* container for back button and title*/}
                <Button /* back button */
                    title="Return to Project Dashboard"
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    size="icon-lg"
                >
                    <ArrowUpLeft />
                </Button>

                <div className="flex flex-col">
                    <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
                        {projectTitle}
                    </h1>
                    <span className="text-sm text-muted-foreground">{contextLabel}</span>
                </div>
                
            </div>

            <div className="flex gap-6"> {/* container for prev, next, save, and formation menu toggle buttons */}
                <Button /* previous formation button */
                    title="Switch to previous formation"
                    onClick={onPrev}
                    variant={currentFormationIndex === 0 || currentFormationIndex === null ? "ghost" : "outline"}
                    size="icon-lg"
                >
                    <ChevronLeft />
                </Button>

                <Button /* next formation button */
                    title="Switch to next formation"
                    onClick={onNext}
                    variant={currentFormationIndex === formations.length - 1 || currentFormationIndex === null ? "ghost" : "outline"}
                    size="icon-lg"
                >
                    <ChevronRight />
                </Button>

                <Button /* save new formation button */
                    title={currentFormationIndex === null ? "Save canvas state as new formation" : "Update current formation with canvas state"}
                    onClick={onSave}
                    variant="outline"
                    size="icon-lg"
                >
                    {currentFormationIndex === null ? <Plus /> : <Save />}
                </Button>

                <Button /* toggle formations menu button */
                    title="Toggle Formations Menu"
                    onClick={onMenuToggle}
                    variant="outline"
                    size="icon-lg"
                >
                    <AlignJustify />
                </Button>
            </div>
            
           
        </div>
    );
};

export default CanvasHeader;