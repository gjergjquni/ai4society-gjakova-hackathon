# PULSI Backend

Backend for the PULSI citizen reporting form.

## Request contract

```json
{
  "category_id": "pothole",
  "custom_text": "",
  "place_id": "qender",
  "has_photo": false
}
```

- `category_id` is one of: `pothole`, `waste`, `light`, `water`, `sidewalk`, `traffic`
- `custom_text` alone is enough for a free-form request (`category_id` may be null)
- `place_id` is optional: `sheshi`, `qender`, `carshia`, `spitali`, `ura`, `cabrati`
- Without a place, location becomes `Lokacion i pacaktuar`
- Custom requests never merge into existing problems

## Response

```json
{
  "report_id": "uuid",
  "problem_id": "uuid",
  "case_code": "GJK-1031",
  "duplicate_decision": "MERGED_INTO_EXISTING_PROBLEM",
  "issue": {
    "id": "GJK-1031",
    "rank": 1,
    "title": "Gropë e rrezikshme në rrugë",
    "category": "Gropë",
    "categoryId": "pothole",
    "location": "Rr. Nënë Tereza · Qendër",
    "reports": 18,
    "priority": 89,
    "trend": 10,
    "severity": "E lartë",
    "status": "Në shqyrtim",
    "department": "Drejtoria e Shërbimeve Publike",
    "age": "1d 4h",
    "impact": "≈ 3,200 kalime/ditë",
    "recommendation": "...",
    "reasons": [{ "label": "Trafik i lartë", "value": 27 }],
    "coords": { "lat": 42.3801, "lng": 20.4304 },
    "color": "#ff9f43"
  }
}
```

## API

- `POST /api/v1/reports`
- `GET /api/v1/reports/{report_id}`
- `GET /api/v1/problems`
- `GET /api/v1/problems/{problem_id_or_case_code}`
- `PATCH /api/v1/problems/{problem_id_or_case_code}/status`
- `GET /api/v1/health`

Public statuses: `Eskaluar`, `Në shqyrtim`, `Monitorim`.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open:

```text
http://localhost:8000/docs
```

If the schema changed and SQLite already exists, delete `data/pulsi.db` once.

## Test

```bash
pytest -q
```

## Docker

```bash
docker compose up --build
```
