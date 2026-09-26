"""Fetch official Gjakova sources and write the municipal knowledge base.

Live HTML/PDF snapshots are stored under data/raw/. Official sentences from
the 27.03.2025 regulation and staff/service pages are normalized into
knowledge/departments/*.json. A directorate with empty responsibilities fails.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import httpx
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.taxonomy import (  # noqa: E402
    DIRECTORATES,
    HARD_NEGATIVE_RULES,
    KB_VERSION,
    REGULATION_TITLE,
    REGULATION_URL_APR,
    REGULATION_URL_MAY,
    SERVICE_URLS,
    STAFF_URLS,
    TAXONOMY_VERSION,
)
from scripts.official_catalog import (  # noqa: E402
    CATALOG,
    EXAMPLE_COMPLAINTS,
    EXAMPLE_REQUESTS,
    RETRIEVED_AT,
)

RAW_DIR = ROOT / "data" / "raw"
KB_DIR = ROOT / "knowledge"
DEPT_DIR = KB_DIR / "departments"
TIMEOUT = 45.0
HEADERS = {
    "User-Agent": "GjakovaMunicipalKB/1.0 (+Komuna e Gjakoves classification backend)"
}

PRIMARY_URLS = [
    REGULATION_URL_MAY,
    REGULATION_URL_APR,
    "https://gjakova.rks-gov.net/wp-content/uploads/2021/12/Draft-Rregullore-per-Organizimin-e-Brendshem-Sistematizimin-dhe-Klasifikimin-e-Vendeve-te-Punes-ne-Komunen-e-Gjakoves.pdf",
    "https://gjakova.rks-gov.net/",
    "https://kk.rks-gov.net/gjakove/",
    "https://gjakova.rks-gov.net/sherbimet/",
    "https://gjakova.rks-gov.net/sherbimet-2/",
    "https://gjakova.rks-gov.net/sherbimet-6/",
    "https://gjakova.rks-gov.net/sherbimet-8/",
    "https://gjakova.rks-gov.net/sherbimet-9/",
    *STAFF_URLS.values(),
]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def slug_url(url: str) -> str:
    cleaned = re.sub(r"^https?://", "", url)
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "_", cleaned).strip("_")
    return cleaned[:180]


def fetch(client: httpx.Client, url: str) -> dict:
    record = {
        "url": url,
        "retrieved_at": utc_now(),
        "status_code": None,
        "source_status": "error",
        "content_type": "",
        "path": None,
        "error": None,
    }
    try:
        response = client.get(url, follow_redirects=True)
        record["status_code"] = response.status_code
        record["content_type"] = response.headers.get("content-type", "")
        suffix = ".pdf" if "pdf" in record["content_type"] or url.lower().endswith(".pdf") else ".html"
        path = RAW_DIR / f"{slug_url(url)}{suffix}"
        path.write_bytes(response.content)
        record["path"] = str(path.relative_to(ROOT))
        record["source_status"] = "ok" if response.status_code == 200 else "http_error"
        if response.status_code != 200:
            record["error"] = f"HTTP {response.status_code}"
    except Exception as exc:  # noqa: BLE001 — must record fetch failure
        record["error"] = str(exc)
        record["source_status"] = "unreachable"
    return record


def extract_html_text(path: Path) -> str:
    soup = BeautifulSoup(path.read_bytes(), "lxml")
    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True))


def extract_pdf_text(path: Path) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def live_excerpt(snapshots: list[dict], url: str, needle: str, width: int = 240) -> str | None:
    snap = next((s for s in snapshots if s["url"] == url and s.get("path")), None)
    if not snap:
        return None
    path = ROOT / snap["path"]
    if not path.exists():
        return None
    text = extract_pdf_text(path) if path.suffix == ".pdf" else extract_html_text(path)
    idx = text.lower().find(needle.lower()[:40])
    if idx < 0:
        return text[:width]
    start = max(0, idx - 40)
    return text[start : start + width].strip()


def discover_staff_and_services(snapshots: list[dict]) -> list[str]:
    extra: list[str] = []
    for snap in snapshots:
        if not snap.get("path") or not str(snap["path"]).endswith(".html"):
            continue
        html = (ROOT / snap["path"]).read_text(encoding="utf-8", errors="ignore")
        extra.extend(re.findall(r"https://gjakova\.rks-gov\.net/staff/drejtoria-[a-z0-9-]+/?", html))
        extra.extend(re.findall(r"https://gjakova\.rks-gov\.net/sherbimet-?\d*/?", html))
        extra.extend(re.findall(r'href="(/staff/drejtoria-[a-z0-9-]+/?)"', html))
        extra.extend(re.findall(r'href="(/sherbimet-?\d*/?)"', html))
    normalized = []
    for href in extra:
        if href.startswith("/"):
            href = "https://gjakova.rks-gov.net" + href
        if href not in PRIMARY_URLS:
            normalized.append(href.rstrip("/") + "/")
    return sorted(set(normalized))


def build_department(dept_id: str, snapshots: list[dict]) -> dict:
    meta = next(d for d in DIRECTORATES if d["id"] == dept_id)
    seed = CATALOG[dept_id]
    snap_by_url = {s["url"]: s for s in snapshots}

    responsibilities = []
    for i, item in enumerate(seed["responsibilities"], start=1):
        url = item["source_url"]
        snap = snap_by_url.get(url, {})
        responsibilities.append(
            {
                "id": f"{dept_id}-R-{i:03d}",
                "text": item["text"],
                "source_url": url,
                "source_title": item["source_title"],
                "retrieved_at": snap.get("retrieved_at") or item.get("retrieved_at") or RETRIEVED_AT,
                "excerpt": live_excerpt(snapshots, url, item["text"]) or item.get("excerpt") or item["text"],
                "source_status": snap.get("source_status", "seed_official_extract"),
            }
        )

    procedures = []
    for i, item in enumerate(seed["procedures"], start=1):
        url = item["source_url"]
        snap = snap_by_url.get(url, {})
        procedures.append(
            {
                "id": f"{dept_id}-{i:02d}",
                "name": item["name"],
                "description": item["description"],
                "source_url": url,
                "source_title": item.get("source_title", ""),
                "retrieved_at": snap.get("retrieved_at") or item.get("retrieved_at") or RETRIEVED_AT,
                "source_status": snap.get("source_status", "seed_official_extract"),
            }
        )

    if not responsibilities:
        raise SystemExit(f"FATAL: {dept_id} has empty responsibilities after extraction.")
    if not procedures:
        raise SystemExit(f"FATAL: {dept_id} has empty procedures after extraction.")

    return {
        "id": dept_id,
        "official_name": meta["official_name"],
        "short_name": meta["short_name"],
        "neni": meta["neni"],
        "mission": seed["mission"],
        "sectors": seed["sectors"],
        "responsibilities": responsibilities,
        "procedures": procedures,
        "services": [
            {"url": u, "source_status": snap_by_url.get(u, {}).get("source_status", "not_fetched")}
            for u in SERVICE_URLS.get(dept_id, [])
        ],
        "hard_negatives": seed.get("hard_negatives", []),
        "example_requests": EXAMPLE_REQUESTS.get(dept_id, []),
        "example_complaints": EXAMPLE_COMPLAINTS.get(dept_id, []),
        "staff_url": STAFF_URLS[dept_id],
        "kb_version": KB_VERSION,
    }


def write_taxonomy(departments: list[dict], snapshots: list[dict]) -> None:
    payload = {
        "version": TAXONOMY_VERSION,
        "kb_version": KB_VERSION,
        "title": "Gjakova Municipal Taxonomy v1.0",
        "authority": REGULATION_TITLE,
        "note": (
            "Older municipal pages mention 12 directorates. The regulation "
            "approved on 27.03.2025 lists 13, including Drejtoria për Inspektime."
        ),
        "directorates": [
            {
                "id": d["id"],
                "official_name": d["official_name"],
                "short_name": d["short_name"],
                "neni": d["neni"],
                "file": next(x["file"] for x in DIRECTORATES if x["id"] == d["id"]),
                "procedure_count": len(d["procedures"]),
                "responsibility_count": len(d["responsibilities"]),
            }
            for d in departments
        ],
        "hard_negative_rules": HARD_NEGATIVE_RULES,
        "mapping_rule": (
            "Classifier 2 matches a procedure_id or responsibility_id, then maps "
            "deterministically to exactly one directorate. Never return two departments."
        ),
        "confidence_note": (
            "confidence is a calibrated reliability estimate on the validation set. "
            "It is not accuracy and not raw cosine similarity."
        ),
        "sources": snapshots,
        "built_at": utc_now(),
    }
    (KB_DIR / "taxonomy.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    DEPT_DIR.mkdir(parents=True, exist_ok=True)

    snapshots: list[dict] = []
    print("Fetching official Gjakova sources...")
    with httpx.Client(timeout=TIMEOUT, headers=HEADERS) as client:
        for url in PRIMARY_URLS:
            record = fetch(client, url)
            snapshots.append(record)
            print(f"  [{record['source_status']}] {url}")

        extras = discover_staff_and_services(snapshots)
        for url in extras:
            if any(s["url"] == url for s in snapshots):
                continue
            record = fetch(client, url)
            snapshots.append(record)
            print(f"  [{record['source_status']}] {url}")

    (RAW_DIR / "fetch_index.json").write_text(
        json.dumps(snapshots, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    departments = []
    for meta in DIRECTORATES:
        dept = build_department(meta["id"], snapshots)
        path = DEPT_DIR / meta["file"]
        path.write_text(json.dumps(dept, ensure_ascii=False, indent=2), encoding="utf-8")
        departments.append(dept)
        print(
            f"  wrote {path.name}: {len(dept['responsibilities'])} responsibilities, "
            f"{len(dept['procedures'])} procedures"
        )

    write_taxonomy(departments, snapshots)
    (ROOT / "artifacts").mkdir(parents=True, exist_ok=True)
    (ROOT / "artifacts" / "kb_version.txt").write_text(KB_VERSION + "\n", encoding="utf-8")
    print(f"Knowledge base {KB_VERSION} written for {len(departments)} directorates.")


if __name__ == "__main__":
    main()
