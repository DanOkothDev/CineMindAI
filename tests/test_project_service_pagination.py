import unittest

from app.services.project_service import ProjectService


class ProjectServicePaginationTests(unittest.TestCase):
    def test_paginate_items_returns_expected_slice(self):
        service = ProjectService()
        items = list(range(10))

        result = service._paginate_items(items, page=2, per_page=3)

        self.assertEqual(result["items"], [3, 4, 5])
        self.assertEqual(result["page"], 2)
        self.assertEqual(result["per_page"], 3)
        self.assertEqual(result["total"], 10)
        self.assertEqual(result["pages"], 4)


if __name__ == "__main__":
    unittest.main()
