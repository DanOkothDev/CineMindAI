import { createContext, useCallback, useMemo, useState } from 'react'
import * as projectApi from '../api/projectApi.js'
import { downloadBlob, getExportFilename } from '../services/projectService.js'

export const ProjectContext = createContext(null)

/**
 * Holds every piece of state the Workspace and Dashboard pages need.
 * GET /api/project/:id now returns the full workspace payload (project + story +
 * characters + scenes + dialogues + visual_prompts), so loadWorkspace only
 * needs one request instead of five.
 */
export function ProjectProvider({ children }) {
  // Dashboard: list of all projects
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState(null)

  // Workspace: the project currently open
  const [project, setProject] = useState(null)
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectError, setProjectError] = useState(null)

  // CreateProject: in-flight generation
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState(null)

  // Characters module
  const [characters, setCharacters] = useState([])
  const [charactersLoading, setCharactersLoading] = useState(false)
  const [charactersError, setCharactersError] = useState(null)

  // Scenes module
  const [scenes, setScenes] = useState([])
  const [scenesLoading, setScenesLoading] = useState(false)
  const [scenesError, setScenesError] = useState(null)

  // Dialogues module
  const [dialogues, setDialogues] = useState([])
  const [dialoguesLoading, setDialoguesLoading] = useState(false)
  const [dialoguesError, setDialoguesError] = useState(null)

  // Visual prompts module
  const [visualPrompts, setVisualPrompts] = useState([])
  const [visualPromptsLoading, setVisualPromptsLoading] = useState(false)
  const [visualPromptsError, setVisualPromptsError] = useState(null)

  // Export
  const [exporting, setExporting] = useState(null)
  const [exportError, setExportError] = useState(null)

  // ---- Projects ----------------------------------------------------------

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError(null)
    try {
      const data = await projectApi.getProjects()
      setProjects(Array.isArray(data) ? data : data?.projects || [])
    } catch (err) {
      setProjectsError(err.message)
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  /**
   * Fetches the full workspace payload and seeds all module slices.
   * The server returns: { project, story, characters, scenes, dialogues, visual_prompts }
   */
  const fetchProject = useCallback(async (id) => {
    setProjectLoading(true)
    setProjectError(null)
    try {
      const payload = await projectApi.getProject(id)

      // payload may be a full workspace object or just the project record
      const projectData = payload?.project || payload
      setProject(projectData)

      if (payload?.characters) setCharacters(payload.characters)
      if (payload?.scenes) setScenes(payload.scenes)
      if (payload?.dialogues) setDialogues(payload.dialogues)
      if (payload?.visual_prompts) setVisualPrompts(payload.visual_prompts)

      return payload
    } catch (err) {
      setProjectError(err.message)
      throw err
    } finally {
      setProjectLoading(false)
    }
  }, [])

  const generateProject = useCallback(async (payload) => {
    setGenerating(true)
    setGenerationError(null)
    try {
      const response = await projectApi.generateFullProject(payload)
      // response: { project, story, characters, saved_characters, scenes, dialogues, visual_prompts }
      const projectData = response?.project || response
      setProject(projectData)
      if (response?.saved_characters?.length) setCharacters(response.saved_characters)
      if (response?.scenes?.length) setScenes(response.scenes)
      if (response?.dialogues?.length) setDialogues(response.dialogues)
      if (response?.visual_prompts?.length) setVisualPrompts(response.visual_prompts)
      return response
    } catch (err) {
      setGenerationError(err.message)
      throw err
    } finally {
      setGenerating(false)
    }
  }, [])

  const updateProjectInfo = useCallback(async (id, data) => {
    const updated = await projectApi.updateProject(id, data)
    setProject((prev) => (prev && prev.id === id ? { ...prev, ...updated } : prev))
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)))
    return updated
  }, [])

  const removeProject = useCallback(async (id) => {
    await projectApi.deleteProject(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // ---- Characters ----------------------------------------------------------

  const fetchCharacters = useCallback(async (projectId) => {
    setCharactersLoading(true)
    setCharactersError(null)
    try {
      const data = await projectApi.getCharacters(projectId)
      setCharacters(Array.isArray(data) ? data : data?.characters || [])
    } catch (err) {
      setCharactersError(err.message)
    } finally {
      setCharactersLoading(false)
    }
  }, [])

  const addCharacter = useCallback(async (data) => {
    const { projectId, ...rest } = data
    const created = await projectApi.createCharacter({ project_id: projectId, ...rest })
    setCharacters((prev) => [...prev, created])
    return created
  }, [])

  const editCharacter = useCallback(async (id, data) => {
    const projectId = project?.id
    const updated = await projectApi.updateCharacter(id, { project_id: projectId, ...data })
    setCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)))
    return updated
  }, [project])

  const removeCharacter = useCallback(async (id) => {
    const projectId = project?.id
    await projectApi.deleteCharacter(id, projectId)
    setCharacters((prev) => prev.filter((c) => c.id !== id))
  }, [project])

  // ---- Scenes ----------------------------------------------------------------

  const fetchScenes = useCallback(async (projectId) => {
    setScenesLoading(true)
    setScenesError(null)
    try {
      const data = await projectApi.getScenes(projectId)
      setScenes(Array.isArray(data) ? data : data?.scenes || [])
    } catch (err) {
      setScenesError(err.message)
    } finally {
      setScenesLoading(false)
    }
  }, [])

  const addScene = useCallback(async (data) => {
    const { projectId, ...rest } = data
    // Map heading→title, content→description for backend
    const payload = { ...rest }
    if (rest.heading && !rest.title) payload.title = rest.heading
    if (rest.content && !rest.description) payload.description = rest.content
    if (!payload.description) payload.description = payload.title || 'No description'
    const created = await projectApi.createScene(projectId, payload)
    setScenes((prev) => [...prev, created])
    return created
  }, [])

  const editScene = useCallback(async (id, data) => {
    const projectId = project?.id
    const updated = await projectApi.updateScene(id, { project_id: projectId, ...data })
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)))
    return updated
  }, [project])

  const removeScene = useCallback(async (id) => {
    const projectId = project?.id
    await projectApi.deleteScene(id, projectId)
    setScenes((prev) => prev.filter((s) => s.id !== id))
  }, [project])

  // ---- Dialogues ---------------------------------------------------------------

  const fetchDialogues = useCallback(async (projectId) => {
    setDialoguesLoading(true)
    setDialoguesError(null)
    try {
      const data = await projectApi.getDialogues(projectId)
      setDialogues(Array.isArray(data) ? data : data?.dialogues || [])
    } catch (err) {
      setDialoguesError(err.message)
    } finally {
      setDialoguesLoading(false)
    }
  }, [])

  const addDialogue = useCallback(async (data) => {
    const { projectId, ...rest } = data
    const created = await projectApi.createDialogue(projectId, rest)
    setDialogues((prev) => [...prev, created])
    return created
  }, [])

  const editDialogue = useCallback(async (id, data) => {
    const projectId = project?.id
    const updated = await projectApi.updateDialogue(id, { project_id: projectId, ...data })
    setDialogues((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)))
    return updated
  }, [project])

  // ---- Visual prompts -------------------------------------------------------------

  const fetchVisualPrompts = useCallback(async (projectId) => {
    setVisualPromptsLoading(true)
    setVisualPromptsError(null)
    try {
      const data = await projectApi.getVisualPrompts(projectId)
      setVisualPrompts(Array.isArray(data) ? data : data?.visualPrompts || data?.prompts || [])
    } catch (err) {
      setVisualPromptsError(err.message)
    } finally {
      setVisualPromptsLoading(false)
    }
  }, [])

  const regenerateVisualPrompts = useCallback(async (data) => {
    setVisualPromptsLoading(true)
    setVisualPromptsError(null)
    try {
      const result = await projectApi.regenerateVisualPrompts(data)
      const next = Array.isArray(result) ? result : result?.visualPrompts || result?.prompts || []
      setVisualPrompts(next)
      return next
    } catch (err) {
      setVisualPromptsError(err.message)
      throw err
    } finally {
      setVisualPromptsLoading(false)
    }
  }, [])

  // ---- Export -----------------------------------------------------------------------

  const exportProjectFile = useCallback(
    async (id, format) => {
      setExporting(format)
      setExportError(null)
      try {
        const response = await projectApi.exportProject(id, format)
        const filename = getExportFilename(project, format)
        downloadBlob(response.data, filename)
      } catch (err) {
        setExportError(err.message)
        throw err
      } finally {
        setExporting(null)
      }
    },
    [project]
  )

  /**
   * Single-request workspace load: fetches the full project payload which
   * already includes story, characters, scenes, dialogues, and visual prompts.
   */
  const loadWorkspace = useCallback(
    async (projectId) => {
      await fetchProject(projectId)
    },
    [fetchProject]
  )

  const value = useMemo(
    () => ({
      projects,
      projectsLoading,
      projectsError,
      fetchProjects,
      removeProject,

      project,
      projectLoading,
      projectError,
      fetchProject,
      updateProjectInfo,

      generating,
      generationError,
      generateProject,

      characters,
      charactersLoading,
      charactersError,
      fetchCharacters,
      addCharacter,
      editCharacter,
      removeCharacter,

      scenes,
      scenesLoading,
      scenesError,
      fetchScenes,
      addScene,
      editScene,
      removeScene,

      dialogues,
      dialoguesLoading,
      dialoguesError,
      fetchDialogues,
      addDialogue,
      editDialogue,

      visualPrompts,
      visualPromptsLoading,
      visualPromptsError,
      fetchVisualPrompts,
      regenerateVisualPrompts,

      exporting,
      exportError,
      exportProjectFile,

      loadWorkspace,
    }),
    [
      projects, projectsLoading, projectsError, fetchProjects, removeProject,
      project, projectLoading, projectError, fetchProject, updateProjectInfo,
      generating, generationError, generateProject,
      characters, charactersLoading, charactersError, fetchCharacters, addCharacter, editCharacter, removeCharacter,
      scenes, scenesLoading, scenesError, fetchScenes, addScene, editScene, removeScene,
      dialogues, dialoguesLoading, dialoguesError, fetchDialogues, addDialogue, editDialogue,
      visualPrompts, visualPromptsLoading, visualPromptsError, fetchVisualPrompts, regenerateVisualPrompts,
      exporting, exportError, exportProjectFile,
      loadWorkspace,
    ]
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
