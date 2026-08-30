import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from service_contract import normalize_order, choose_prompt_route, expected_job_ids

BASE = {
    "plan_id": "trial",
    "product_name": "사과대추",
    "category": "fruit",
    "product_description": "아삭한 식감의 제철 원물",
    "main_visual_style": "product_only",
    "model_shot_count": 0,
    "tone": "white",
    "copy_mood": "sales",
    "info_density": "standard",
    "highlight_points": ["taste"],
    "thumbnail_style": "strong_sales",
    "accepted_image_text_risk": True,
}

class ContractTests(unittest.TestCase):
    def test_trial_contract(self):
        o = normalize_order(BASE)
        self.assertEqual(o["output_contract"]["thumbnail_count"], 1)
        self.assertEqual(o["output_contract"]["body_count"], 8)
        self.assertEqual(o["output_contract"]["quality"], "medium")
        self.assertEqual(len(expected_job_ids(o)), 9)

    def test_standard_contract(self):
        o = normalize_order({**BASE, "plan_id": "standard", "info_density": "rich", "verified_fact_count": 7})
        self.assertEqual(o["output_contract"]["thumbnail_count"], 2)
        self.assertEqual(o["output_contract"]["body_count"], 12)
        self.assertEqual(o["output_contract"]["quality"], "high")
        self.assertEqual(len(expected_job_ids(o)), 14)

    def test_blank_optional_values_are_omitted(self):
        o = normalize_order({**BASE, "specification": "   ", "sale_price": ""})
        self.assertIsNone(o["specification"])
        self.assertIsNone(o["sale_price"])
        self.assertTrue(o["omissions"]["specification"])
        self.assertTrue(o["omissions"]["sale_price"])

    def test_disclosure_required(self):
        with self.assertRaises(ValueError):
            normalize_order({**BASE, "accepted_image_text_risk": False})

    def test_hidden_route(self):
        self.assertEqual(choose_prompt_route(confirmed_evidence_count=1, differentiated_fact_count=1), "direct_conversion_master")
        self.assertEqual(choose_prompt_route(confirmed_evidence_count=2, differentiated_fact_count=2, has_proof_document=True), "ted_autofill_then_master_v3")

if __name__ == "__main__":
    unittest.main()
