// Small, pure helpers that sit between the API layer and the UI.
// Nothing in this file makes network calls — that's projectApi.js's job.

/** Triggers a browser download for a blob the export endpoints return. */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const EXPORT_EXTENSIONS = {
  json: 'json',
  pdf: 'pdf',
  finaldraft: 'fdx',
  video: 'mp4',
}

/** Builds a sensible filename for a project export, e.g. "neon-skyline.pdf". */
export function getExportFilename(project, format) {
  const ext = EXPORT_EXTENSIONS[format] || format
  const base = slugify(project?.title || project?.name || `project-${project?.id ?? ''}`)
  return `${base}.${ext}`
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'cinemindai-project'
}

/** Groups a flat dialogues array by sceneId so DialoguePage can render per scene. */
export function groupDialoguesByScene(dialogues = []) {
  const groups = new Map()
  for (const dialogue of dialogues) {
    const key = dialogue.sceneId ?? dialogue.scene_id ?? 'unassigned'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(dialogue)
  }
  return groups
}

/** Formats minutes (e.g. 95) into "1h 35m" for display. */
export function formatDuration(minutes) {
  const total = Number(minutes)
  if (!total || Number.isNaN(total)) return '—'
  const hrs = Math.floor(total / 60)
  const mins = total % 60
  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

/** Formats an ISO date string into something short and human, e.g. "Jun 28". */
export function formatShortDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
