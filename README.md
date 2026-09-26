# Komuna e Gjakovës — klasifikim dhe routing i rasteve

Backend për Arkivën: qytetari dërgon tekst të lirë, sistemi kthen **gjithmonë**

- `type`: **KËRKESË** ose **ANKESË**
- **saktësisht 1** nga 13 drejtoritë zyrtare
- procedurën/përgjegjësinë zyrtare të përputhur + evidencë me `source_url`
- vendimin e duplikatit: `NEW_CASE` | `MERGED_INTO_EXISTING_PROBLEM`

Nuk ka frontend, auth, chatbot, as thirrje të paguara LLM në rrugën e klasifikimit.

## 13 drejtoritë (Taksonomia v1.0)

Rregullorja e 27.03.2025 (nr. 01-011/01-16155) liston 13 drejtori, përfshirë Inspektimet. Faqet e vjetra thonë 12 — ky sistem përdor 13.

| ID | Emri zyrtar |
|---|---|
| ADM | Drejtoria e Administratës |
| FIN | Drejtoria për Buxhet dhe Financa |
| SHP | Drejtoria për Shërbime Publike |
| INF | Drejtoria për Infrastrukturë |
| SHS | Drejtoria për Shëndetësi dhe Mirëqenie Sociale |
| ARS | Drejtoria për Arsim |
| KRS | Drejtoria për Kulturë, Rini dhe Sport |
| ZHE | Drejtoria për Zhvillim Ekonomik |
| URB | Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit |
| BUJ | Drejtoria për Bujqësi, Pylltari dhe Zhvillim Rural |
| KAD | Drejtoria për Gjeodezi, Kadastër dhe Pronë |
| MSH | Drejtoria për Mbrojtje dhe Shpëtim |
| INS | Drejtoria për Inspektime |

Routing-u **nuk** klasifikon sipas emrit të drejtorisë. Klasifikon sipas procedurës/përgjegjësisë zyrtare, pastaj e pasqyron deterministikisht te një drejtori.

## Instalimi

Python 3.11+.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Modeli lokal i embeddings (`intfloat/multilingual-e5-small`) shkarkohet një herë. Pas kësaj, `/v1/classify` punon offline.

## Ndërtimi i bazës së njohurive (hulumtim zyrtar)

```powershell
python scripts/build_knowledge_base.py
```

Shkarkon rregulloren PDF, faqet `/staff/drejtoria-*` dhe `/sherbimet-*`, i ruan në `data/raw/`, dhe shkruan 13 skedarë në `knowledge/departments/` me `source_url`, `retrieved_at`, `excerpt`. Dështon nëse ndonjë drejtori mbetet pa përgjegjësi.

## Trajnimi

```powershell
python scripts/generate_dataset.py
python scripts/train_intent.py
python scripts/train_department.py
python scripts/train_duplicate.py
python scripts/evaluate.py
```

Etiketimi për nëpunësin e Arkivës: `data/datasets/REVIEW.md`.

`confidence` është besueshmëri e kalibruar në validation, **jo** saktësi dhe **jo** cosine similarity.

Metrikat e fundit të held-out (reale, jo të rregulluara):

- Intent: accuracy **0.966**, macro-F1 **0.965**
- Directorate: accuracy **0.957**, macro-F1 **0.952**
- Duplicate: precision **1.00**, recall **1.00** (false merge = 0)

## API

```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

| Method | Path | Qëllimi |
|---|---|---|
| POST | `/v1/classify` | Klasifiko + ruaj raportin + MERGE/NEW |
| POST | `/v1/reports` | Alias i classify (pikë integrimi për frontend) |
| GET | `/v1/reports/{id}` | Lexo raportin |
| GET | `/v1/problems` | Problemet e hapura/mbyllura |
| GET | `/v1/problems/{id}` | Një problem (me `report_count`) |
| GET | `/v1/health` | Statusi i modeleve |
| GET | `/v1/taxonomy` | 13 drejtoritë + rregullat hard-negative |
| POST | `/v1/feedback` | Korrigjim i Arkivës; **nuk** ristërvit automatikisht |

`POST /v1/classify`

```json
{
  "text": "Ka gropë në rrugën e Pejës.",
  "location_text": "Rruga e Pejës",
  "lat": 42.3805,
  "lon": 20.4308,
  "citizen_ref": "optional"
}
```

SQLite lokale (`data/gjakova_cases.db`) është e përputhshme me PostgreSQL + pgvector më vonë. Tre probleme OPEN seed-ohen në startup (gropë Pejë, ndriçim Lagjja e Re, ndërtim pa leje te Hadum) që MERGE të provohet pa frontend.

## Teste dhe demo

```powershell
pytest -q
python -m scripts.demo_classify
```

## Arkitektura

```
raport → preprocess (shqip/gegë) → intent → retrieve procedura
      → reranker + rregulla hard-negative → 1 drejtori
      → detector duplikatësh (tekst+lokacion+drejtori+kohë+entitete)
      → CASE STORE (gati për Arkivë)
```

Zero kosto API në classify. As OpenAI, as Groq.
