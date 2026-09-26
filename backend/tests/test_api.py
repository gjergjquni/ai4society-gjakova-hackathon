import os
from pathlib import Path

# Use an isolated SQLite file before the app imports the DB engine.
TEST_DB = Path(__file__).resolve().parent / "test_pulsi.db"
if TEST_DB.exists():
    TEST_DB.unlink()
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB}"
os.environ["AI_TIMEOUT_SECONDS"] = "0.4"
os.environ["AI_SERVICE_URL"] = "http://127.0.0.1:9"

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
        assert data["department_id"] == "INF"
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


def test_device_coordinates_are_stored():
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/reports",
            json={
                "category_id": "sidewalk",
                "lat": 42.4,
                "lon": 20.5,
                "has_photo": True,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["lat"] == 42.4
        assert data["lon"] == 20.5
        assert data["has_photo"] is True
        assert data["location_text"] == "42.40000, 20.50000"
        assert data["issue"]["coords"]["lat"] == 42.4
        assert data["issue"]["coords"]["lng"] == 20.5
        assert data["duplicate_decision"] == "NEW_CASE"


def test_update_status():
    with TestClient(app) as client:
        response = client.patch(
            "/api/v1/problems/GJK-1047/status",
            json={"status": "Në shqyrtim"},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "Në shqyrtim"
        assert response.json()["id"] == "GJK-1047"


def test_full_workflow_to_citizen_status():
    with TestClient(app) as client:
        created = client.post(
            "/api/v1/reports",
            json={
                "custom_text": "Ka një gropë të rrezikshme te Ura e Terzive",
                "place_id": "ura",
                "lat": 42.3724,
                "lon": 20.4308,
            },
        )
        assert created.status_code == 201
        body = created.json()
        case_code = body["case_code"]
        assert body["workflow_status"] == "PENDING_REVIEW"
        assert body["department_id"] in {
            "ADM", "FIN", "SHP", "INF", "SHS", "ARS", "KRS",
            "ZHE", "URB", "BUJ", "KAD", "MSH", "INS",
        }

        listed = client.get("/api/v1/cases")
        assert listed.status_code == 200
        assert any(item["id"].startswith(case_code) for item in listed.json())

        approved = client.post(
            f"/api/v1/cases/{case_code}/approve",
            json={"directorateId": body["department_id"], "priority": "E lartë"},
        )
        assert approved.status_code == 200
        assert approved.json()["workflowStatus"] == "ASSIGNED"
        assert approved.json()["directorateId"] == body["department_id"]
        assert approved.json()["directorateStatus"] == "NEW"

        directorate_id = approved.json()["directorateId"]
        queued = client.get(f"/api/v1/cases?directorate_id={directorate_id}")
        assert queued.status_code == 200
        assert any(item["id"].startswith(case_code) for item in queued.json())
        assert all(item["directorateId"] == directorate_id for item in queued.json())

        progressed = client.patch(
            f"/api/v1/cases/{case_code}/directorate-status",
            json={"status": "IN_PROGRESS"},
        )
        assert progressed.status_code == 200
        assert progressed.json()["workflowStatus"] == "IN_PROGRESS"

        resolved = client.post(
            f"/api/v1/cases/{case_code}/resolve",
            json={"workDescription": "Gropa u asfaltua sot."},
        )
        assert resolved.status_code == 200
        assert resolved.json()["workflowStatus"] == "RESOLVED"

        tracked = client.get(f"/api/v1/cases/lookup?q={case_code}")
        assert tracked.status_code == 200
        assert tracked.json()[0]["status"] == "E zgjidhur"
        assert tracked.json()[0]["workflow_status"] == "RESOLVED"
