import api from './api.js'

/** POST /api/project/generate-full */
export const generateFullProject = (payload) =>
  api.post('/api/project/generate-full', payload).then((res) => res.data.data)

/** GET /api/project/<id> — returns full workspace payload (project + story + characters + scenes + dialogues + visual_prompts) */
export const getProject = (id) =>
  api.get(`/api/project/${id}`).then((res) => res.data.data)

/** GET /api/projects */
export const getProjects = () =>
  api.get('/api/projects').then((res) => res.data.data)

/** PUT /api/project/<id> */
export const updateProject = (id, data) =>
  api.put(`/api/project/${id}`, data).then((res) => res.data.data)

/** DELETE /api/project/<id> */
export const deleteProject = (id) =>
  api.delete(`/api/project/${id}`).then((res) => res.data)


/** GET /api/project/<id>/characters */
export const getCharacters = (projectId) =>
  api.get(`/api/project/${projectId}/characters`).then((res) => res.data.data)

/** POST /api/character/create */
export const createCharacter = (data) =>
  api.post('/api/character/create', data).then((res) => res.data.data)

/** PUT /api/character/<id> */
export const updateCharacter = (id, data) =>
  api.put(`/api/character/${id}`, data).then((res) => res.data.data)

/** DELETE /api/character/<id>?project_id=X */
export const deleteCharacter = (id, projectId) =>
  api.delete(`/api/character/${id}?project_id=${projectId}`).then((res) => res.data)


/** GET /api/project/<id>/scenes */
export const getScenes = (projectId) =>
  api.get(`/api/project/${projectId}/scenes`).then((res) => res.data.data)

/** POST /api/project/<id>/scene */
export const createScene = (projectId, data) =>
  api.post(`/api/project/${projectId}/scene`, data).then((res) => res.data.data)

/** PUT /api/scene/<id> */
export const updateScene = (id, data) =>
  api.put(`/api/scene/${id}`, data).then((res) => res.data.data)

/** DELETE /api/scene/<id>?project_id=X */
export const deleteScene = (id, projectId) =>
  api.delete(`/api/scene/${id}?project_id=${projectId}`).then((res) => res.data)


/** GET /api/project/<id>/dialogues */
export const getDialogues = (projectId) =>
  api.get(`/api/project/${projectId}/dialogues`).then((res) => res.data.data)

/** POST /api/project/<id>/dialogue */
export const createDialogue = (projectId, data) =>
  api.post(`/api/project/${projectId}/dialogue`, data).then((res) => res.data.data)

/** PUT /api/dialogue/<id> */
export const updateDialogue = (id, data) =>
  api.put(`/api/dialogue/${id}`, data).then((res) => res.data.data)


/** GET /api/project/<id>/visual-prompts */
export const getVisualPrompts = (projectId) =>
  api.get(`/api/project/${projectId}/visual-prompts`).then((res) => res.data.data)

/** POST /api/visual-prompts/regenerate */
export const regenerateVisualPrompts = (data) =>
  api.post('/api/visual-prompts/regenerate', data).then((res) => res.data.data)


export const exportProject = (id, format) =>
  api.get(`/api/project/${id}/export/${format}`, { responseType: 'blob' })
