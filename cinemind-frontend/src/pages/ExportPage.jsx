import { useParams } from 'react-router-dom'
import { FileJson, FileText, Clapperboard, Video, Loader2, Download } from 'lucide-react'
import useProject from '../hooks/useProject.js'

const FORMATS = [
  { format: 'json', label: 'JSON', detail: 'Full project data, for backups or other tools', icon: FileJson },
  { format: 'pdf', label: 'PDF', detail: 'A readable script-style document', icon: FileText },
  { format: 'finaldraft', label: 'Final Draft', detail: 'Open and keep editing in Final Draft (.fdx)', icon: Clapperboard },
  { format: 'video', label: 'Video', detail: 'Rendered MP4, once video generation is wired up', icon: Video },
]

export default function ExportPage() {
  const { projectId } = useParams()
  const { exportProjectFile, exporting, exportError } = useProject()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="slug-line">Deliverables</p>
        <h1 className="mt-1 font-display text-2xl text-paper">Export</h1>
        <p className="mt-2 max-w-lg text-sm text-paper-dim">
          Download this project in the format you need. Each export is generated fresh from
          the latest version of your story, cast, scenes, and dialogue.
        </p>
      </div>

      {exportError && (
        <p className="rounded-md border border-crimson/40 bg-crimson/10 px-3.5 py-2.5 text-sm text-crimson">
          {exportError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FORMATS.map(({ format, label, detail, icon: Icon }) => {
          const isExporting = exporting === format
          return (
            <div key={format} className="panel flex flex-col gap-3 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-raised text-amber">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-base text-paper">{label}</h3>
                <p className="mt-1 text-sm text-paper-dim">{detail}</p>
              </div>
              <button
                onClick={() => exportProjectFile(projectId, format)}
                className="btn-secondary mt-1 self-start text-sm"
                disabled={Boolean(exporting)}
              >
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {isExporting ? 'Preparing…' : `Download ${label}`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
