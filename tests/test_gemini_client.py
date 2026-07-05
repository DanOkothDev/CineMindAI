import unittest
from unittest.mock import patch

from app.ai.gemini_client import GeminiClient


class GeminiClientTests(unittest.TestCase):
    def test_generate_passes_richer_config(self):
        client = GeminiClient.__new__(GeminiClient)
        client.client = type('ClientStub', (), {})()

        with patch.object(client.client, 'models', create=True) as models:
            models.generate_content.return_value = type('Response', (), {'text': 'ok'})()
            client.generate('prompt')

            kwargs = models.generate_content.call_args.kwargs
            self.assertEqual(kwargs['model'], 'gemini-2.5-flash')
            self.assertEqual(kwargs['config']['maxOutputTokens'], 8192)
            self.assertEqual(kwargs['config']['temperature'], 0.9)


if __name__ == '__main__':
    unittest.main()
