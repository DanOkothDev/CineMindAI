import time
from threading import Lock


class CacheService:
    def __init__(self, ttl_seconds=300):
        self.ttl_seconds = ttl_seconds
        self._store = {}
        self._lock = Lock()

    def get(self, key):
        with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            if time.time() - entry["created_at"] > self.ttl_seconds:
                self._store.pop(key, None)
                return None
            return entry["value"]

    def set(self, key, value):
        with self._lock:
            self._store[key] = {"value": value, "created_at": time.time()}

    def delete(self, key):
        with self._lock:
            self._store.pop(key, None)
