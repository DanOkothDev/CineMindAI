from app.services.cache_service import CacheService


class AIOrchestrator:
    def __init__(self, cache_service=None):
        self.cache_service = cache_service or CacheService()

    def run(self, engine_name, prompt_builder, generator, *args, **kwargs):
        cache_key = f"{engine_name}:{prompt_builder(*args, **kwargs)}"
        cached = self.cache_service.get(cache_key)
        if cached is not None:
            return cached

        result = generator(*args, **kwargs)
        self.cache_service.set(cache_key, result)
        return result
