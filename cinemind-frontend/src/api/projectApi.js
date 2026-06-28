import api from './api.js'

// Every function here maps 1:1 to an endpoint from the architecture doc.
// Nothing here fabricates data — if the backend is down or returns an
// error, the promise rejects and the calling page shows that real error.

// ---- Project -------------------------------------------------------------

/** POST /api/project/generate-full — kicks off a full movie package generation. */
export const generateFullProject = (payload) =>
  api.post('/api/project/generate-full', payload).then((res) => res.data.data)

/** GET /api/project/<id> */
export const getProject = (id) =>
  api.get(`/api/project/${id}`).then((res) => res.data)

/** GET /api/projects */
export const getProjects = () =>
  api.get('/api/projects').then((res) => res.data)

/** PUT /api/project/<id> */
export const updateProject = (id, data) =>
  api.put(`/api/project/${id}`, data).then((res) => res.data)

/** DELETE /api/project/<id> */
export const deleteProject = (id) =>
  api.delete(`/api/project/${id}`).then((res) => res.data)

// ---- Characters -----------------------------------------------------------

/** GET /api/project/<id>/characters */
export const getCharacters = (projectId) =>
  api.get(`/api/project/${projectId}/characters`).then((res) => res.data)

/** POST /api/character */
export const createCharacter = (data) =>
  api.post('/api/character', data).then((res) => res.data)

/** PUT /api/character/<id> */
export const updateCharacter = (id, data) =>
  api.put(`/api/character/${id}`, data).then((res) => res.data)

/** DELETE /api/character/<id> */
export const deleteCharacter = (id) =>
  api.delete(`/api/character/${id}`).then((res) => res.data)

// ---- Scenes ----------------------------------------------------------------

/** GET /api/project/<id>/scenes */
export const getScenes = (projectId) =>
  api.get(`/api/project/${projectId}/scenes`).then((res) => res.data)

/** POST /api/scene */
export const createScene = (data) =>
  api.post('/api/scene', data).then((res) => res.data)

/** PUT /api/scene/<id> */
export const updateScene = (id, data) =>
  api.put(`/api/scene/${id}`, data).then((res) => res.data)

/** DELETE /api/scene/<id> */
export const deleteScene = (id) =>
  api.delete(`/api/scene/${id}`).then((res) => res.data)

// ---- Dialogues --------------------------------------------------------------

/** GET /api/project/<id>/dialogues */
export const getDialogues = (projectId) =>
  api.get(`/api/project/${projectId}/dialogues`).then((res) => res.data)

/** POST /api/dialogue */
export const createDialogue = (data) =>
  api.post('/api/dialogue', data).then((res) => res.data)

/** PUT /api/dialogue/<id> */
export const updateDialogue = (id, data) =>
  api.put(`/api/dialogue/${id}`, data).then((res) => res.data)

// ---- Visual prompts -----------------------------------------------------------

/** GET /api/project/<id>/visual-prompts */
export const getVisualPrompts = (projectId) =>
  api.get(`/api/project/${projectId}/visual-prompts`).then((res) => res.data)

/** POST /api/visual-prompts/regenerate */
export const regenerateVisualPrompts = (data) =>
  api.post('/api/visual-prompts/regenerate', data).then((res) => res.data)

// ---- Export -------------------------------------------------------------------

/**
 * GET /api/project/<id>/export/<format>
 * format is one of: 'json' | 'pdf' | 'finaldraft' | 'video'
 * Returns the raw response so the caller can read headers (e.g.
 * Content-Disposition for a suggested filename) as well as the blob body.
 */
export const exportProject = (id, format) =>
  api.get(`/api/project/${id}/export/${format}`, { responseType: 'blob' })
