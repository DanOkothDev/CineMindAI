export function extractProjectIdFromGenerationStatus(status) {
  const result = status?.result || status?.data || status
  if (!result) return null

  const project = result?.project || result?.data?.project || status?.project || null
  if (project) {
    return project?.project_id || project?.id || null
  }

  return result?.project_id || result?.data?.project_id || null
}
