import unittest
from app.rules import RULES, analyze


class RuleEngineTests(unittest.TestCase):
    def test_missing_topics_create_severity_grouped_findings(self):
        score, findings, counts, _ = analyze("Routine press operation and inspection log.")
        self.assertEqual(len(RULES), 7)
        self.assertLess(score, 100)
        self.assertEqual(len(findings), sum(counts.values()))
        self.assertTrue(all(item["reference"] == "Internal demo rule" for item in findings))
        self.assertGreater(counts["CRITICAL"], 0)

    def test_all_topics_detected_returns_full_score_and_no_findings(self):
        complete = " ".join(term for rule in RULES for term in rule["terms"])
        score, findings, counts, _ = analyze(complete)
        self.assertEqual(score, 100)
        self.assertEqual(findings, [])
        self.assertEqual(counts, {"CRITICAL": 0, "MAJOR": 0, "MINOR": 0})

    def test_empty_text_flags_every_configured_check(self):
        score, findings, counts, _ = analyze("")
        self.assertEqual(score, 0)
        self.assertEqual(len(findings), 7)
        self.assertEqual(sum(counts.values()), 7)


if __name__ == "__main__":
    unittest.main()
