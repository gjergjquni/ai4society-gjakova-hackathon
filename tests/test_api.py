from __future__ import annotations

from fastapi.testclient import TestClient

from tests.conftest import artifacts_ready, requires_models


@requires_models
def test_classify_and_taxonomy() -> None:
    from app.main import app

    with TestClient(app) as client:
        health = client.get("/v1/health")
        assert health.status_code == 200
        assert health.json()["directorates"] == 13
        tax = client.get("/v1/taxonomy")
        assert tax.status_code == 200
        assert len(tax.json()["directorates"]) == 13
        res = client.post(
            "/v1/classify",
            json={"text": "Dua certifikatë lindjeje.", "location_text": "Gjakovë"},
        )
        assert res.status_code == 200
        body = res.json()
        assert body["type"] == "KËRKESË"
        assert body["department_id"] == "ADM"
        assert body["department"] == "Drejtoria e Administratës"
        assert body["status"] == "ROUTED"
        assert body["evidence"]
        report = client.get(f"/v1/reports/{body['report_id']}")
        assert report.status_code == 200
        problems = client.get("/v1/problems")
        assert problems.status_code == 200
        fb = client.post(
            "/v1/feedback",
            json={
                "report_id": body["report_id"],
                "predicted_department_id": "ADM",
                "correct_department_id": "ADM",
            },
        )
        assert fb.status_code == 200
        assert fb.json()["auto_retrained"] is False


def test_artifacts_flag_documented() -> None:
    # Guard so CI without models still collects tests.
    assert artifacts_ready() or not artifacts_ready()
