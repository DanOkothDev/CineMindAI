import threading
import unittest

from flask import Flask, current_app

from app.services.generation_service import GenerationService


class GenerationServiceTests(unittest.TestCase):
    def test_start_generation_updates_job_status(self):
        service = GenerationService()
        job = service.create_job({"idea": "A test idea"})
        started = threading.Event()

        def runner(payload, user_id=None):
            started.set()
            return {"status": "success", "data": {"project_id": 42}}

        service.start_generation(job["job_id"], {"idea": "A test idea"}, generation_runner=runner)

        self.assertTrue(started.wait(2))
        completed_job = service.get_job(job["job_id"])
        self.assertEqual(completed_job["status"], "completed")
        self.assertEqual(completed_job["result"]["data"]["project_id"], 42)

    def test_start_generation_supports_flask_app_context(self):
        service = GenerationService()
        job = service.create_job({"idea": "A test idea"})
        app = Flask(__name__)
        started = threading.Event()

        def runner(payload, user_id=None):
            started.set()
            self.assertEqual(current_app.name, app.name)
            return {"status": "success", "data": {"project_id": 7}}

        service.start_generation(job["job_id"], {"idea": "A test idea"}, generation_runner=runner, app=app)

        self.assertTrue(started.wait(2))
        completed_job = service.get_job(job["job_id"])
        self.assertEqual(completed_job["status"], "completed")
        self.assertEqual(completed_job["result"]["data"]["project_id"], 7)


if __name__ == "__main__":
    unittest.main()
