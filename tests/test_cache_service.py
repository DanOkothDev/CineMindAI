import unittest

from app.services.cache_service import CacheService


class CacheServiceTests(unittest.TestCase):
    def test_cache_round_trip_and_ttl(self):
        cache = CacheService(ttl_seconds=0.01)
        cache.set("hello", "world")
        self.assertEqual(cache.get("hello"), "world")
        import time
        time.sleep(0.02)
        self.assertIsNone(cache.get("hello"))


if __name__ == "__main__":
    unittest.main()
