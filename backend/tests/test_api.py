import os
from pathlib import Path

# Use an isolated SQLite file before the app imports the DB engine.
TEST_DB = Path(__file__).resolve().parent / "test_pulsi.db"
if TEST_DB.exists():
    TEST_DB.unlink()
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB}"

from fastapi.testclient import TestClient
from app.main import app


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_list_seeded_problems():
    with TestClient(app) as client:
        response = client.get("/api/v1/problems")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 4
        assert data[0]["id"].startswith("GJK-")
        assert "categoryId" in data[0]
        assert "coords" in data[0]


def test_create_report():
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/reports",
            json={
                "category_id": "traffic",
                "place_id": "cabrati",
                "custom_text": "",
                "has_photo": False,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["category"] == "Trafik"
        assert data["category_id"] == "traffic"
        assert data["department_id"] == "SHP"
        assert data["duplicate_decision"] == "NEW_CASE"
        assert data["case_code"].startswith("GJK-")
        assert data["issue"]["id"] == data["case_code"]
        assert data["issue"]["categoryId"] == "traffic"
        assert data["issue"]["status"] == "Monitorim"
        assert data["issue"]["coords"]["lng"] == 20.4198


def test_same_problem_merges():
    with TestClient(app) as client:
        first = client.post(
            "/api/v1/reports",
            json={
                "category_id": "pothole",
                "place_id": "qender",
                "has_photo": False,
            },
        )
        second = client.post(
            "/api/v1/reports",
            json={
                "category_id": "pothole",
                "place_id": "qender",
                "has_photo": True,
            },
        )
        assert first.status_code == 201
        assert second.status_code == 201
        assert first.json()["duplicate_decision"] == "MERGED_INTO_EXISTING_PROBLEM"
        assert second.json()["duplicate_decision"] == "MERGED_INTO_EXISTING_PROBLEM"
        assert second.json()["problem_id"] == first.json()["problem_id"]
        assert second.json()["case_code"] == "GJK-1031"
        assert second.json()["issue"]["reports"] >= 19


def test_custom_request_never_merges():
    with TestClient(app) as client:
        first = client.post(
            "/api/v1/reports",
            json={
                "custom_text": "Kërkoj pastrim të rrugës",
                "place_id": "sheshi",
            },
        )
        second = client.post(
            "/api/v1/reports",
            json={
                "custom_text": "Kërkoj pastrim të rrugës",
                "place_id": "sheshi",
            },
        )
        assert first.status_code == 201
        assert second.status_code == 201
        assert first.json()["duplicate_decision"] == "NEW_CASE"
        assert second.json()["duplicate_decision"] == "NEW_CASE"
        assert first.json()["problem_id"] != second.json()["problem_id"]
        assert first.json()["category_id"] == "custom"


def test_empty_payload_rejected():
    with TestClient(app) as client:
        response = client.post("/api/v1/reports", json={})
        assert response.status_code == 422


def test_update_status():
    with TestClient(app) as client:
        response = client.patch(
            "/api/v1/problems/GJK-1047/status",
            json={"status": "Në shqyrtim"},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "Në shqyrtim"
        assert response.json()["id"] == "GJK-1047"
