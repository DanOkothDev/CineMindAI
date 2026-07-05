import unittest

from app.routes.api.export_routes import _build_pdf_plaintext


class ExportRoutesTests(unittest.TestCase):
    def test_pdf_plaintext_emits_multiple_text_runs(self):
        data = {
            'project': {'title': 'Sample', 'genre': 'Drama'},
            'story': {
                'logline': 'A ' * 80,
                'structure': {'act_1': 'One ' * 60, 'act_2': 'Two ' * 60, 'act_3': 'Three ' * 60},
                'themes': ['hope'],
            },
            'characters': [],
            'scenes': [],
            'dialogues': [],
        }

        blob = _build_pdf_plaintext(data)
        self.assertIn(b'%PDF', blob)
        self.assertGreaterEqual(blob.count(b'Tj'), 2)


if __name__ == '__main__':
    unittest.main()
