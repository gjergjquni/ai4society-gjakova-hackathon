# Gjakova Connect 🏛️

Platforma Dixhitale për Qytetarët e Gjakovës - Digital Civic Engagement Platform

## Rreth Projektit / About

**Gjakova Connect** është një platformë dixhitale e zhvilluar për Ai4Society Hackathon në Tiranë 2026, e organizuar nga BONEVET. Platforma synon të përmirësojë komunikimin midis qytetarëve dhe Komunës së Gjakovës duke ofruar:

- 📢 **Raportim të Problemeve**: Qytetarët mund të raportojnë probleme urbane dhe të gjurmojnë statusin e tyre
- 🤖 **Asistent AI**: Përgjigje të menjëhershme për pyetje mbi shërbimet komunale
- 🏛️ **Direktori i Shërbimeve**: Informacion i plotë për të gjitha shërbimet komunale
- 📰 **Njoftime**: Lajme dhe njoftime të rëndësishme për komunitetin
- 💬 **Angazhim Qytetar**: Konsultime publike dhe feedback nga komuniteti

## Veçoritë Kryesore / Key Features

### 1. Raportimi i Problemeve
Qytetarët mund të raportojnë:
- Probleme me infrastrukturën
- Çështje të pastrimit urban
- Dëmtime në rrugë
- Çdo problem tjetër komunal

Çdo raport i ka tre statuse: **e-hapur**, **në-proces**, **e-zgjidhur**

### 2. Asistenti AI
Teknologji e inteligjencës artificiale që përgjigjet për:
- Si të merrni dokumente të ndryshme
- Orare të shërbimeve
- Procedura administrative
- Informacion mbi shërbimet komunale

### 3. Shërbimet Komunale
Informacion i detajuar për:
- Regjistri Civil
- Departamenti i Urbanizmit
- Shërbimi i Pastrimit
- Drejtoria e Arsimit
- Dhe shumë të tjera...

### 4. Njoftime Publike
- Njoftimet urgjente
- Ngjarje komunitare
- Konsultime publike
- Lajme nga komuna

## Teknologjitë e Përdorura / Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **AI Integration** - Smart responses

## Si të Ekzekutoni Projektin / How to Run

### Parakushtet / Prerequisites

- Node.js 20+ 
- npm or yarn

### Instalimi / Installation

```bash
# Klononi repository
git clone [repository-url]
cd gjakova-connect

# Instaloni dependencies
npm install

# Startoni development server
npm run dev
```

Hapni [http://localhost:3000](http://localhost:3000) në shfletuesin tuaj.

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Struktura e Projektit / Project Structure

```
gjakova-connect/
├── app/
│   ├── layout.tsx          # Main layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
└── README.md
```

## Zhvillime të Ardhshme / Future Enhancements

- 🔐 Autentifikim i përdoruesve
- 📱 Aplikacion mobil
- 🗺️ Integrimi me harta (Google Maps)
- 📊 Dashboard administrative për komunën
- 🔔 Njoftime push për qytetarët
- 📸 Ngarkimi i fotove për problemet
- 🗳️ Votim elektronik për konsultime publike
- 📈 Analitikë dhe raporte

## Kontributi / Contributing

Ky projekt është zhvilluar për Ai4Society Hackathon. Kontributet janë të mirëpritura!

## Licensa / License

MIT License - Zhvilluar për qëllime edukative dhe sociale

## Kontakt / Contact

Për pyetje ose sugjerime:
- 📧 Email: info@komuna-gjakove.org
- 📞 Tel: +383 39 123 456

---

**Zhvilluar me ❤️ për qytetarët e Gjakovës**

**Ai4Society Hackathon - Tiranë 2026 | Organizuar nga BONEVET**

---

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
