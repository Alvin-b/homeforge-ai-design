import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Trash2, Box } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'homeforge-projects'

function getAllProjects(): { id: string; name: string; savedAt: number }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    return Object.entries(all)
      .filter(([, v]: [string, any]) => v && typeof v === 'object')
      .map(([id, v]: [string, any]) => ({
        id,
        name: v.projectName || 'Untitled',
        savedAt: v.savedAt || 0,
      }))
      .sort((a, b) => b.savedAt - a.savedAt)
  } catch {
    return []
  }
}

function deleteProject(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    delete all[id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {}
}

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = React.useState(getAllProjects())

  const handleNewProject = () => navigate(`/editor/${uuidv4()}`)

  React.useEffect(() => {
    const interval = setInterval(() => setProjects(getAllProjects()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this project?')) {
      deleteProject(id)
      setProjects(getAllProjects())
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Box className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">HomeForge</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">
            My Projects
          </h1>
          <button
            onClick={handleNewProject}
            className="inline-flex items-center gap-2 bg-highlight text-highlight-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/editor/${p.id}`}
                className="block group bg-card border border-border rounded-xl p-5 hover:border-highlight/50 hover:shadow-medium transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-highlight/10 transition-colors">
                    <FolderOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, p.id)}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground mt-3 truncate">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.savedAt
                    ? `Saved ${new Date(p.savedAt).toLocaleDateString()}`
                    : 'Not saved'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No projects yet</p>
            <button
              onClick={handleNewProject}
              className="inline-flex items-center gap-2 mt-4 text-highlight font-medium hover:underline"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
