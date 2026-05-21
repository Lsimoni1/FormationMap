import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, AlignJustify, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'

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

function getVisibleProjects(projects: Project[], currentPage: number, itemsPerPage: number): Project[] {
  let targetIndex = itemsPerPage * currentPage
  return projects.slice(targetIndex, targetIndex + itemsPerPage)
}

interface ProjectCardProps {
  project: Project
  onClick: () => void
  isMenuOpen: boolean
  onMenuToggle: () => void
  onDelete: () => void 
  onRename: (projectId: string, newName: string) => void
}

const ProjectCard = ({ project, onClick, isMenuOpen, onMenuToggle, onDelete, onRename }: ProjectCardProps) => {
  const [renameActive, setRenameActive] = useState(false)
  const [newName, setNewName] = useState(project.title)

  return (
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
            onClick={(e) => {e.stopPropagation(); setRenameActive(true)}}
          >
            Rename
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-destructive rounded-t-none hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
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
    {renameActive ? 
      <Input
        className='font-bold mt-3'
        value={newName}
        onChange={(e) =>  setNewName(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if(e.key === "Enter") {onRename(project.id, newName); setRenameActive(false)}}}
      /> 
      : < h3 className="font-bold mt-3">{project.title}</h3> }
    <p className="text-sm text-muted-foreground mt-0.5">Last Edited: {project.lastEdited}</p>
    <p className="text-sm text-muted-foreground">Number of Formations: {project.formationCount}</p>
  </div>
  )
}

interface NewProjectModalProps {
  onClose: () => void
}

const NewProjectModal = ({ onClose }: NewProjectModalProps) => {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async () => {
    const trimmed = projectName.trim()
    if(trimmed === "") { 
      setError("Project names cannot be empty")
      return 
    }
    const { data, error } = await supabase
      .from ("projects")
      .insert({ name: trimmed})
      .select()
    if (error != null) {
      setError("New project creation failed")
    } else {
      navigate(`/canvas/${data[0].id}`, {state: { projectName: trimmed} })
    }
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
  const [projects , setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = useResponsiveItemsPerPage()

  // Reset to first page whenever the grid layout changes
  useEffect(() => {
    setCurrentPage(0)
  }, [itemsPerPage])

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const {data, error} = await supabase
        .from("projects")
        .select()
      if(error != null) {
        setLoading(false)
        return
      } else {
        setProjects(data.map(row =>({
            id: row.id, 
            title: row.name,
            lastEdited: "",
            formationCount: 1
          })))
          setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const deleteProjects = async (projectId: string) => {
    const { error } = await supabase 
      .from("projects")
      .delete()
      .eq('id', projectId)

    if(error != null) {
      return
    } else {
      setProjects(projects.filter((project) => project.id !== projectId)) 
    }
  }

  const renameProjects = async (projectId: string, newName: string) => {
    const { error } = await supabase
      .from("projects")
      .update({name: newName})
      .eq('id', projectId)

    if(error != null) {
      console.log(error)
      return

    } else {
      setProjects(projects.map((project) => project.id === projectId ? {...project, title: newName} : project))
    }
  }

  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const visibleProjects = getVisibleProjects(projects, currentPage, itemsPerPage)
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
              <Button
                variant="ghost"
                className="w-full justify-start rounded-t-none text-sm rounded-b-none"
                onClick={() => navigate('/settings')}>
                  Settings
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

          { loading ?
                <div className="flex-1 flex items-center justify-center">                                                                                                                                                
                  <Spinner className="h-10 w-10" />                                                                                                                                                                   
                </div>    
          :
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.length > 0
              ? visibleProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => navigate(`/canvas/${project.id}`)}
                    isMenuOpen={currCardSelected === project.id}
                    onMenuToggle={() => {
                      setCurrCardSelected(currCardSelected === project.id ? '' : project.id)
                    }}
                    onDelete={() => deleteProjects(project.id)}
                    onRename={renameProjects}
                  />
                ))
              : (
                <p className="col-span-full text-center text-muted-foreground py-24">
                  No projects yet.
                </p>
              )
            }
          </div>}

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
