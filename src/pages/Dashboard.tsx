import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, AlignJustify, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Columns follow Tailwind breakpoints (sm: 640px, lg: 1024px)
// Rows collapse to 1 on short viewports so the page scroller stays visible
function useResponsiveItemsPerPage() {
  const calculate = () => {
    const cols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
    const rows = window.innerHeight >= 700 ? 2 : 1
    return cols * rows
  }

  const [itemsPerPage, setItemsPerPage] = useState(calculate)

  useEffect(() => {
    const handler = () => setItemsPerPage(calculate)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return itemsPerPage
}

interface Project {
  id: string
  title: string
  lastEdited: string
  formationCount: number
}

const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'Spring Show 2026', lastEdited: '2026-02-20', formationCount: 12 },
  { id: '2', title: 'Fall Recital', lastEdited: '2026-02-15', formationCount: 8 },
  { id: '3', title: 'Competition Piece', lastEdited: '2026-02-10', formationCount: 5 },
  { id: '4', title: 'Workshop Demo', lastEdited: '2026-02-05', formationCount: 3 },
  { id: '5', title: 'Summer Camp', lastEdited: '2026-01-30', formationCount: 7 },
  { id: '6', title: 'Showcase Finale', lastEdited: '2026-01-25', formationCount: 15 },
  { id: '7', title: 'Test Project', lastEdited: '2026-01-20', formationCount: 2 },
]

function getVisibleProjects(projects: Project[], currentPage: number, itemsPerPage: number): Project[] {
  let targetIndex = itemsPerPage * currentPage
  return projects.slice(targetIndex, targetIndex + itemsPerPage)
}

interface ProjectCardProps {
  project: Project
  onClick: () => void
  isMenuOpen: boolean
  onMenuToggle: () => void
}

const ProjectCard = ({ project, onClick, isMenuOpen, onMenuToggle }: ProjectCardProps) => (
  <div
    className="relative border-2 rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Project options"
      className="absolute top-2 right-2"
      onClick={(e) => { e.stopPropagation(); onMenuToggle() }}
    >
      <AlignJustify />
    </Button>
    {isMenuOpen && (
      <div className="absolute top-10 right-2 w-32 bg-background border-2 rounded-md shadow-lg z-10">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm rounded-b-none"
          onClick={(e) => e.stopPropagation()}
        >
          Rename
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sm text-destructive rounded-t-none hover:text-destructive"
          onClick={(e) => e.stopPropagation()}
        >
          Delete
        </Button>
      </div>
    )}
    <div className="w-full aspect-[4/3] rounded bg-gray-200 flex items-center justify-center">
      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h3 className="font-bold mt-3">{project.title}</h3>
    <p className="text-sm text-muted-foreground mt-0.5">Last Edited: {project.lastEdited}</p>
    <p className="text-sm text-muted-foreground">Number of Formations: {project.formationCount}</p>
  </div>
)

interface NewProjectModalProps {
  onClose: () => void
}

const NewProjectModal = ({ onClose }: NewProjectModalProps) => {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState('')

  // TODO(human): Update handleCreate — instead of silently returning when the
  // name is empty, call setError() with a helpful message so the user knows
  // what went wrong. The error display and clearing are already wired up below.
  const handleCreate = () => {
    const trimmed = projectName.trim()
    if(trimmed === "") { 
      setError("Project names cannot be empty")
      return 
    }
    navigate('/canvas', {state: { projectName: trimmed} })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border-2 rounded-md p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">New Project</h2>
        <Field>
          <FieldLabel htmlFor="project-name">Project Name</FieldLabel>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => { setProjectName(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. Spring Show 2026"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </Field>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [currCardSelected, setCurrCardSelected] = useState('')
  const itemsPerPage = useResponsiveItemsPerPage()

  // Reset to first page whenever the grid layout changes
  useEffect(() => {
    setCurrentPage(0)
  }, [itemsPerPage])

  const totalPages = Math.ceil(MOCK_PROJECTS.length / itemsPerPage)
  const visibleProjects = getVisibleProjects(MOCK_PROJECTS, currentPage, itemsPerPage)
  const avatarLetter = user?.email?.[0].toUpperCase() ?? '?'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative pt-10 pb-6 px-12">
        <h1 className="text-5xl text-center text-bold">Your Projects</h1>

        <div className="absolute top-8 left-10">
          <Button onClick={() => setShowNewProjectModal(true)}>
            <Plus /> New Project
          </Button>
        </div>

        {/* Avatar / account menu */}
        <div className="absolute top-8 right-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            {avatarLetter}
          </Button>
          {showAccountMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-background border-2 rounded-md shadow-lg z-10">
              <p className="px-3 py-2 text-xs text-muted-foreground truncate border-b">
                {user?.email}
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-t-none text-sm"
                onClick={signOut}
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="flex flex-col items-center px-4 pb-12">
        <div className="flex items-center gap-4 w-full max-w-5xl">
          <Button
            variant="ghost"
            size="icon-lg"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => p - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft strokeWidth={1.5} />
          </Button>

          {/* Project grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.length > 0
              ? visibleProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => navigate('/canvas')}
                    isMenuOpen={currCardSelected === project.id}
                    onMenuToggle={() => {
                      setCurrCardSelected(currCardSelected === project.id ? '' : project.id)
                    }}
                  />
                ))
              : (
                <p className="col-span-full text-center text-muted-foreground py-24">
                  No projects yet.
                </p>
              )
            }
          </div>

          <Button
            variant="ghost"
            size="icon-lg"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(p => p + 1)}
            aria-label="Next page"
          >
            <ChevronRight strokeWidth={1.5} />
          </Button>
        </div>

        {/* Page number scroller */}
        {totalPages > 1 && (
          <div className="flex gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? 'default' : 'outline'}
                size="icon-sm"
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}
    </div>
  )
}

export default Dashboard
