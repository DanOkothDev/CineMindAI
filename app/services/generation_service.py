import threading
import uuid
from datetime import datetime

from flask import current_app


class GenerationService:
    def __init__(self):
        self._jobs = {}
        self._lock = threading.Lock()

    def _job_snapshot(self, job):
        return {
            "job_id": job.get("job_id"),
            "status": job.get("status"),
            "payload": job.get("payload"),
            "result": job.get("result"),
            "error": job.get("error"),
            "created_at": job.get("created_at"),
            "updated_at": job.get("updated_at"),
        }

    def create_job(self, payload):
        job_id = str(uuid.uuid4())
        job = {
            "job_id": job_id,
            "status": "queued",
            "payload": payload or {},
            "result": None,
            "error": None,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        with self._lock:
            self._jobs[job_id] = job
        return job

    def get_job(self, job_id):
        with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return None
            return self._job_snapshot(job)

    def update_job(self, job_id, **changes):
        with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return None
            for key, value in changes.items():
                job[key] = value
            job["updated_at"] = datetime.utcnow().isoformat()
            return self._job_snapshot(job)

    def start_generation(self, job_id, payload, generation_runner=None, app=None):
        job = self.get_job(job_id)
        if not job:
            raise KeyError(job_id)

        if generation_runner is None:
            generation_runner = self._default_generation_runner

        def runner():
            try:
                self.update_job(job_id, status="running")
                if app is not None:
                    with app.app_context():
                        result = generation_runner(payload, user_id=payload.get("user_id"))
                else:
                    result = generation_runner(payload, user_id=payload.get("user_id"))
                self.update_job(job_id, status="completed", result=result)
            except Exception as exc:  # pragma: no cover - defensive path
                self.update_job(job_id, status="failed", error=str(exc))

        thread = threading.Thread(target=runner, daemon=True)
        thread.start()
        return thread

    def _default_generation_runner(self, payload, user_id=None):
        return {"status": "success", "data": {"project_id": None, "payload": payload, "user_id": user_id}}
