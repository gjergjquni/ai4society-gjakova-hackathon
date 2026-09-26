"""Build labeled datasets from the official knowledge base + hard pairs.

Splits are by template family so near-duplicate paraphrases do not leak
across train/val/test.
"""

from __future__ import annotations

import csv
import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.services.kb import load_kb  # noqa: E402

DATA_DIR = ROOT / "data" / "datasets"
RNG = random.Random(42)

# (family, intent, department, procedure_hint, texts...)
HARD_PAIRS: list[dict] = [
    {
        "family": "urb-permit",
        "intent": "KËRKESË",
        "department_id": "URB",
        "procedure_id": "URB-01",
        "texts": [
            "Dua të pajisem me leje ndërtimi për shtëpinë time.",
            "Me duhet leje ndërtimi për shtëpi në Gjakovë.",
            "Aplikoj për leje ndërtimi të objektit banimi.",
            "Kërkoj leje ndërtimi për shtëpinë time në Çabrat.",
            "Po don me e marrë lejen e ndërtimit për shtëpi.",
        ],
    },
    {
        "family": "urb-permit-delay",
        "intent": "ANKESË",
        "department_id": "URB",
        "procedure_id": "URB-01",
        "texts": [
            "Komuna nuk po më jep përgjigje për lejen e ndërtimit që e kam dorëzuar para dy muajsh.",
            "E kam dorëzuar lejen e ndërtimit dhe ende s'kam përgjigje.",
            "Më kanë vonuar lejen e ndërtimit pa asnjë njoftim.",
            "Dy muaj pres përgjigje për lejen e ndërtimit.",
        ],
    },
    {
        "family": "urb-illegal-self",
        "intent": "KËRKESË",
        "department_id": "URB",
        "procedure_id": "URB-20",
        "texts": [
            "Dua të legalizoj ndërtimin pa leje të shtëpisë sime.",
            "Kërkoj të filloj procesin e ndërtimeve pa leje për objektin tim.",
            "Aplikoj për trajtimin e ndërtimit pa leje sipas ligjit.",
        ],
    },
    {
        "family": "ins-illegal-neighbor",
        "intent": "ANKESË",
        "department_id": "INS",
        "procedure_id": "INS-02",
        "texts": [
            "Fqinji im ka filluar të ndërtojë një shtëpi pa leje ndërtimi.",
            "Fqinji po ndërton pa leje.",
            "Po ndërtojnë objekt pa leje te unë, ju lutem inspektoni.",
            "Denoncoj ndërtim pa leje të fqinjit, ndaloni punimet.",
        ],
    },
    {
        "family": "ins-illegal-train",
        "intent": "ANKESË",
        "department_id": "INS",
        "procedure_id": "INS-02",
        "texts": [
            "Fqinji në lagjen time po ndërton mur pa leje.",
            "Po ndërtohet objekt pa leje pranë shtëpisë sime, ju lutem inspektoni.",
            "Denoncoj ndërtim të paligjshëm të një të afërmi.",
            "Kanë filluar punimet pa leje ndërtimi te unë.",
        ],
    },
    {
        "family": "kad-register",
        "intent": "KËRKESË",
        "department_id": "KAD",
        "procedure_id": "KAD-01",
        "texts": [
            "Dua të regjistroj parcelën.",
            "Më duhet të regjistroj tokën në kadastër.",
            "Kërkoj regjistrim të pronës së paluajtshme.",
            "Dua fletëposedimin e parcelës sime.",
        ],
    },
    {
        "family": "urb-parcelim",
        "intent": "KËRKESË",
        "department_id": "URB",
        "procedure_id": "URB-04",
        "texts": [
            "Dua të ndaj parcelën për të ndërtuar.",
            "Kërkoj pëlqim për parcelim se do të ndërtoj.",
            "Më duhet pëlqim urbanistik për ndarjen e parcelës.",
        ],
    },
    {
        "family": "inf-pothole-peja",
        "intent": "ANKESË",
        "department_id": "INF",
        "procedure_id": "INF-01",
        "texts": [
            "Rruga është dëmtuar / ka gropa në rrugën e Pejës.",
            "Ka gropë të madhe në rrugën e Pejës.",
            "Rruga e Pejës është dëmtuar dhe ka një gropë.",
            "Ju lutem rregulloni gropën te rruga e Pejës.",
        ],
    },
    {
        "family": "inf-pothole-prizren",
        "intent": "ANKESË",
        "department_id": "INF",
        "procedure_id": "INF-01",
        "texts": [
            "Ka gropë në rrugën e Prizrenit.",
            "Rruga e Prizrenit ka gropa të mëdha.",
        ],
    },
    {
        "family": "shp-lighting",
        "intent": "ANKESË",
        "department_id": "SHP",
        "procedure_id": "SHP-01",
        "texts": [
            "Ndriçimi publik nuk punon.",
            "Llamba e ndriçimit publik është e fikur në Lagjen e Re.",
            "S'kemi drita në rrugë, ndriçimi publik nuk punon.",
        ],
    },
    {
        "family": "shp-waste",
        "intent": "ANKESË",
        "department_id": "SHP",
        "procedure_id": "SHP-05",
        "texts": [
            "Kontejnerët nuk po zbrazën prej dy javësh.",
            "Mbeturinat janë grumbulluar në lagje.",
            "Nuk kemi kontejner për mbeturina.",
        ],
    },
    {
        "family": "shs-water",
        "intent": "ANKESË",
        "department_id": "SHS",
        "procedure_id": "SHS-05",
        "texts": [
            "Nuk kemi ujë në lagje.",
            "Uji i rubinetit është i pistë dhe i rrezikshëm.",
            "Nuk kemi ujë të pastër në lagjen time.",
        ],
    },
    {
        "family": "ins-fine",
        "intent": "ANKESË",
        "department_id": "INS",
        "procedure_id": "INS-09",
        "texts": [
            "Më kanë vënë gjobë të padrejtë në treg.",
            "Gjobë e padrejtë për kioskë.",
            "Kioskë pa leje pranë meje, ju lutem inspektoni tregun.",
        ],
    },
    {
        "family": "zhe-business",
        "intent": "KËRKESË",
        "department_id": "ZHE",
        "procedure_id": "ZHE-01",
        "texts": [
            "Dua të regjistroj një biznes të ri.",
            "Më duhet certifikatë biznesi.",
            "Dua të hap dyqan dhe ta regjistroj.",
        ],
    },
    {
        "family": "urb-kiosk",
        "intent": "KËRKESË",
        "department_id": "URB",
        "procedure_id": "URB-09",
        "texts": [
            "Dua pëlqim për vendosjen e një kioske në hapësirë publike.",
            "Kërkoj leje për objekt të përkohshëm kioskë.",
        ],
    },
    {
        "family": "msh-fire",
        "intent": "ANKESË",
        "department_id": "MSH",
        "procedure_id": "MSH-02",
        "texts": [
            "Ka zjarr në shtëpinë pranë meje, dërgoni zjarrfikësit.",
            "Emergjencë, ka filluar zjarri te Çabrati.",
            "Thirrje 112, shtëpia po digjet.",
        ],
    },
    {
        "family": "adm-birth",
        "intent": "KËRKESË",
        "department_id": "ADM",
        "procedure_id": "ADM-01",
        "texts": [
            "Dua certifikatë lindjeje.",
            "Më duhet certifikata e lindjes për fëmijën.",
            "Kërkoj të pajisem me certifikatë lindjeje.",
        ],
    },
    {
        "family": "adm-marriage",
        "intent": "KËRKESË",
        "department_id": "ADM",
        "procedure_id": "ADM-11",
        "texts": [
            "Dua të lidh martesë në komunë.",
            "Kërkoj kurorëzim në Gjakovë.",
        ],
    },
    {
        "family": "fin-tax",
        "intent": "ANKESË",
        "department_id": "FIN",
        "procedure_id": "FIN-02",
        "texts": [
            "Fatura e tatimit në pronë është e gabuar.",
            "Tatimi në pronë më ka ardhur tepricë.",
            "Ankohem për vlerën e faturës së tatimit në pronë.",
        ],
    },
    {
        "family": "fin-tax-req",
        "intent": "KËRKESË",
        "department_id": "FIN",
        "procedure_id": "FIN-01",
        "texts": [
            "Dua të paguaj tatimin në pronë.",
            "Më duhet vërtetim i tatimit në pronë.",
        ],
    },
    {
        "family": "ars-scholarship",
        "intent": "KËRKESË",
        "department_id": "ARS",
        "procedure_id": "ARS-02",
        "texts": [
            "Dua të aplikoj për bursë shkollore.",
            "Kërkoj bursë për fëmijën në shkollë të mesme.",
        ],
    },
    {
        "family": "ars-roof",
        "intent": "ANKESË",
        "department_id": "ARS",
        "procedure_id": "ARS-04",
        "texts": [
            "Çatia e shkollës po merr ujë.",
            "Shkolla 'Emin Duraku' ka çati të dëmtuar.",
            "Oborri i shkollës është i rrezikshëm.",
        ],
    },
    {
        "family": "buj-sub-req",
        "intent": "KËRKESË",
        "department_id": "BUJ",
        "procedure_id": "BUJ-02",
        "texts": [
            "Dua të aplikoj për subvencion për bujqësi.",
            "Kërkoj subvencion për grurë dhe misër.",
            "Dua të regjistrohem si fermer me NIF.",
        ],
    },
    {
        "family": "buj-sub-delay",
        "intent": "ANKESË",
        "department_id": "BUJ",
        "procedure_id": "BUJ-02",
        "texts": [
            "Kam aplikuar për subvencion por ende nuk kam marrë përgjigje.",
            "Nuk kam marrë subvencionin e bujqësisë që e kam aplikuar.",
        ],
    },
    {
        "family": "krs-grant",
        "intent": "KËRKESË",
        "department_id": "KRS",
        "procedure_id": "KRS-01",
        "texts": [
            "Dua të aplikoj për grant kulturor.",
            "Kërkoj mbështetje për klubin sportiv.",
        ],
    },
    {
        "family": "inf-taxi",
        "intent": "KËRKESË",
        "department_id": "INF",
        "procedure_id": "INF-06",
        "texts": [
            "Dua leje për transport taksi në Gjakovë.",
            "Kërkoj leje për transport të udhëtarëve.",
        ],
    },
    {
        "family": "shp-stray",
        "intent": "ANKESË",
        "department_id": "SHP",
        "procedure_id": "SHP-09",
        "texts": [
            "Ka qen endacakë që po na sulmojnë në lagje.",
            "Kafshët endacake janë të rrezikshme te parku.",
        ],
    },
    {
        "family": "adm-birth-delay",
        "intent": "ANKESË",
        "department_id": "ADM",
        "procedure_id": "ADM-01",
        "texts": [
            "Nuk po më lëshojnë certifikatën e lindjes edhe pse e kam kërkuar para dy javësh.",
            "Certifikata e lindjes ka gabim dhe askush nuk po e korrigjon.",
        ],
    },
    {
        "family": "kad-register-delay",
        "intent": "ANKESË",
        "department_id": "KAD",
        "procedure_id": "KAD-01",
        "texts": [
            "Nuk po ma regjistrojnë parcelën prej muajsh.",
            "Fletëposedimi im ka gabim në kufij dhe s'po e ndreqin.",
        ],
    },
    {
        "family": "zhe-business-delay",
        "intent": "ANKESË",
        "department_id": "ZHE",
        "procedure_id": "ZHE-01",
        "texts": [
            "Nuk po ma lëshojnë certifikatën e biznesit.",
            "Më kanë ngarkuar taksë në firmë padrejtësisht.",
        ],
    },
    {
        "family": "krs-grant-delay",
        "intent": "ANKESË",
        "department_id": "KRS",
        "procedure_id": "KRS-01",
        "texts": [
            "Nuk mora përgjigje për grantin kulturor.",
            "Pallati i sportit është i mbyllur pa arsye.",
        ],
    },
    {
        "family": "msh-fire-delay",
        "intent": "ANKESË",
        "department_id": "MSH",
        "procedure_id": "MSH-04",
        "texts": [
            "Nuk mora vërtetimin e shkakut të zjarrit.",
            "Zjarrfikësit vonuan shumë në thirrjen time.",
        ],
    },
    {
        "family": "shs-housing",
        "intent": "KËRKESË",
        "department_id": "SHS",
        "procedure_id": "SHS-03",
        "texts": [
            "Dua të aplikoj për strehim social.",
            "Kërkoj strehim social për familjen time.",
        ],
    },
    {
        "family": "shs-housing-delay",
        "intent": "ANKESË",
        "department_id": "SHS",
        "procedure_id": "SHS-03",
        "texts": [
            "Kam aplikuar për strehim social dhe s'kam përgjigje.",
            "Më kanë lënë pa strehim social pa asnjë njoftim.",
        ],
    },
]

def _paraphrases(name: str, description: str, intent: str) -> list[str]:
    name_l = name.lower()
    if intent == "KËRKESË":
        bases = [
            f"Dua të aplikoj për {name_l}.",
            f"Kërkoj {name_l}.",
            f"Më duhet {name_l}.",
            f"Dua të pajisem me {name_l}.",
            f"Aplikoj për {name_l} në Komunën e Gjakovës.",
        ]
        shorts = [f"dua {name_l}", f"me duhet {name_l}", name_l]
        gheg = [f"e marrë {name_l}", f"na jepni {name_l}"]
    else:
        bases = [
            f"E kam parashtruar {name_l} para dy muajsh dhe ende s'kam asnjë përgjigje.",
            f"Më kanë refuzuar {name_l} pa arsye dhe po ankohem.",
            f"Ankohem për vonesë dhe mosveprim të komunës te {name_l}.",
            f"Shërbimi për {name_l} është i keq, gabim dhe i padrejtë.",
            f"Ka dëmtim / padrejtësi lidhur me {name_l} dhe askush nuk po e zgjidh.",
        ]
        shorts = [
            f"nuk po e zgjidhin {name_l}",
            f"vonese e padrejte per {name_l}",
            f"ankohem per {name_l}",
        ]
        gheg = [f"s'po na e zgjidhin {name_l}, na kanë lënë në harresë"]
    out = []
    out.extend(bases)
    out.extend(s.capitalize() + "." if not s.endswith(".") else s for s in shorts)
    out.extend(f"Po don {g}." for g in gheg)
    out.append(f"Në Gjakovë, {bases[0].lower()}")
    return out


def generate_department_rows() -> list[dict]:
    kb = load_kb()
    rows: list[dict] = []
    for item in kb.items:
        if item.kind != "official_procedure":
            continue
        for intent in ("KËRKESË", "ANKESË"):
            family = f"{item.item_id}-{intent}"
            texts = _paraphrases(item.name, item.text, intent)
            for i, text in enumerate(texts):
                rows.append(
                    {
                        "family": family,
                        "split": "",
                        "text": text,
                        "intent": intent,
                        "department_id": item.department_id,
                        "procedure_id": item.item_id,
                        "hard": False,
                    }
                )
    for pair in HARD_PAIRS:
        for i, text in enumerate(pair["texts"]):
            rows.append(
                {
                    "family": pair["family"],
                    "split": "",
                    "text": text,
                    "intent": pair["intent"],
                    "department_id": pair["department_id"],
                    "procedure_id": pair["procedure_id"],
                    "hard": True,
                }
            )
    return rows


def assign_splits(rows: list[dict]) -> list[dict]:
    families = sorted({r["family"] for r in rows})
    RNG.shuffle(families)
    n = len(families)
    n_test = max(1, int(0.15 * n))
    n_val = max(1, int(0.15 * n))
    test_f = set(families[:n_test])
    val_f = set(families[n_test : n_test + n_val])
    # Force known hard families into test.
    force_test = {
        "urb-permit",
        "urb-permit-delay",
        "ins-illegal-neighbor",
        "kad-register",
        "urb-parcelim",
        "inf-pothole-peja",
        "inf-pothole-prizren",
        "shp-lighting",
        "shs-water",
        "fin-tax",
        "ars-roof",
        "buj-sub-req",
        "buj-sub-delay",
        "msh-fire",
        "adm-birth",
        "adm-birth-delay",
        "zhe-business-delay",
        "shs-housing-delay",
    }
    for fam in force_test:
        test_f.add(fam)
        val_f.discard(fam)
    for row in rows:
        if row["family"] in test_f:
            row["split"] = "test"
        elif row["family"] in val_f:
            row["split"] = "val"
        else:
            row["split"] = "train"
    return rows


def generate_duplicate_rows() -> list[dict]:
    rows = [
        {
            "id": "dup-1",
            "split": "test",
            "text_a": "Ka një gropë të madhe në rrugën e Pejës.",
            "loc_a": "Rruga e Pejës",
            "lat_a": 42.3805,
            "lon_a": 20.4308,
            "text_b": "Rruga e Pejës është dëmtuar dhe ka një gropë.",
            "loc_b": "Rruga e Pejës, Gjakovë",
            "lat_b": 42.3806,
            "lon_b": 20.4309,
            "dept_a": "INF",
            "dept_b": "INF",
            "days_apart": 2,
            "label": 1,
        },
        {
            "id": "dup-2",
            "split": "test",
            "text_a": "Ka gropë në rrugën e Pejës.",
            "loc_a": "Rruga e Pejës",
            "lat_a": 42.3805,
            "lon_a": 20.4308,
            "text_b": "Ka gropë në rrugën e Prizrenit.",
            "loc_b": "Rruga e Prizrenit",
            "lat_b": 42.3760,
            "lon_b": 20.4350,
            "dept_a": "INF",
            "dept_b": "INF",
            "days_apart": 1,
            "label": 0,
        },
        {
            "id": "dup-3",
            "split": "test",
            "text_a": "Ju lutem rregulloni gropën te rruga e Pejës.",
            "loc_a": "Rruga e Pejës",
            "lat_a": 42.3805,
            "lon_a": 20.4308,
            "text_b": "Ka një gropë të madhe në rrugën e Pejës.",
            "loc_b": "Rruga e Pejës",
            "lat_b": 42.38055,
            "lon_b": 20.43085,
            "dept_a": "INF",
            "dept_b": "INF",
            "days_apart": 5,
            "label": 1,
        },
        {
            "id": "dup-4",
            "split": "test",
            "text_a": "Ndriçimi publik nuk punon në Lagjen e Re.",
            "loc_a": "Lagjja e Re",
            "lat_a": 42.3850,
            "lon_a": 20.4280,
            "text_b": "Llamba e ndriçimit publik është e fikur në Lagjen e Re.",
            "loc_b": "Lagjja e Re",
            "lat_b": 42.3851,
            "lon_b": 20.4281,
            "dept_a": "SHP",
            "dept_b": "SHP",
            "days_apart": 3,
            "label": 1,
        },
        {
            "id": "dup-5",
            "split": "test",
            "text_a": "Ndriçimi publik nuk punon në Lagjen e Re.",
            "loc_a": "Lagjja e Re",
            "lat_a": 42.3850,
            "lon_a": 20.4280,
            "text_b": "Ndriçimi publik nuk punon te Çabrati.",
            "loc_b": "Çabrati",
            "lat_b": 42.3700,
            "lon_b": 20.4200,
            "dept_a": "SHP",
            "dept_b": "SHP",
            "days_apart": 1,
            "label": 0,
        },
        {
            "id": "dup-gps-close",
            "split": "test",
            "text_a": "Ka gropë këtu.",
            "loc_a": "",
            "lat_a": 42.38050,
            "lon_a": 20.43080,
            "text_b": "Rruga është dëmtuar keq.",
            "loc_b": "",
            "lat_b": 42.38055,
            "lon_b": 20.43088,
            "dept_a": "INF",
            "dept_b": "INF",
            "days_apart": 0,
            "label": 1,
        },
        {
            "id": "dup-gps-far",
            "split": "test",
            "text_a": "Ka gropë këtu.",
            "loc_a": "",
            "lat_a": 42.38050,
            "lon_a": 20.43080,
            "text_b": "Ka gropë këtu.",
            "loc_b": "",
            "lat_b": 42.39000,
            "lon_b": 20.45000,
            "dept_a": "INF",
            "dept_b": "INF",
            "days_apart": 0,
            "label": 0,
        },
        {
            "id": "dup-protocol",
            "split": "train",
            "text_a": "Ankesë për lëndën prot. 01-011/44521.",
            "loc_a": "Gjakovë",
            "lat_a": None,
            "lon_a": None,
            "text_b": "Vazhdim i rastit prot. 01-011/44521, ende pa përgjigje.",
            "loc_b": "Gjakovë",
            "lat_b": None,
            "lon_b": None,
            "dept_a": "URB",
            "dept_b": "URB",
            "days_apart": 10,
            "label": 1,
        },
    ]
    # Train bulk: same street merge / different street no-merge for several streets.
    streets = [
        ("Rruga e Pejës", 42.3805, 20.4308),
        ("Rruga Ismail Qemali", 42.3812, 20.4290),
        ("te spitali", 42.3780, 20.4330),
        ("te stadiumi", 42.3820, 20.4250),
    ]
    for i, (street, lat, lon) in enumerate(streets):
        rows.append(
            {
                "id": f"dup-train-same-{i}",
                "split": "train",
                "text_a": f"Ka gropë në {street}.",
                "loc_a": street,
                "lat_a": lat,
                "lon_a": lon,
                "text_b": f"Ju lutem rregulloni gropën te {street}.",
                "loc_b": street,
                "lat_b": lat + 0.00005,
                "lon_b": lon + 0.00005,
                "dept_a": "INF",
                "dept_b": "INF",
                "days_apart": 2,
                "label": 1,
            }
        )
        other = streets[(i + 1) % len(streets)]
        rows.append(
            {
                "id": f"dup-train-diff-{i}",
                "split": "train",
                "text_a": f"Ka gropë në {street}.",
                "loc_a": street,
                "lat_a": lat,
                "lon_a": lon,
                "text_b": f"Ka gropë në {other[0]}.",
                "loc_b": other[0],
                "lat_b": other[1],
                "lon_b": other[2],
                "dept_a": "INF",
                "dept_b": "INF",
                "days_apart": 1,
                "label": 0,
            }
        )
    for row in rows:
        if row["split"] == "train" and RNG.random() < 0.2:
            row["split"] = "val"
    return rows


def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_review_md() -> None:
    text = """# Udhëzues etiketimi — Arkiva / nëpunës komunal

Ky skedar i lejon një nëpunësi të Arkivës të korrigjojë etiketat e datasetit
`intent_department.csv` dhe `duplicate.csv` para ristërvitjes.

## 1. KËRKESË apo ANKESË

**KËRKESË** — qytetari do të fitojë një të drejtë, dokument, leje ose shërbim.
Fillon një proces. Shkak: nevojë ose dëshirë.

Shembuj: leje lindjeje, pasaportë (nëse do të ishte kompetencë komunale), bursë,
leje ndërtimi, regjistrim biznesi, subvencion bujqësor.

**ANKESË** — qytetari kundërshton padrejtësi, gabim, mosveprim, dëmtim ose
shërbim të keq. Reagim. Shkak: shkelje, vonesë, dëm.

Shembuj: gjobë e padrejtë, mungesë shërbimi, sjellje joetike, mos-përgjigje
ndaj një kërkese të dorëzuar.

Mos etiketoni vetëm sepse ka fjalën «dua». «Dua t’i rregulloni gropën» është
ANKESË për gjendje ekzistuese. «Dua leje ndërtimi» është KËRKESË.

## 2. Drejtoria — sipas procedurës zyrtare, jo emrit

Etiketa e drejtorisë vjen nga procedura ose përgjegjësia zyrtare, pastaj
pasqyrohet deterministikisht te një nga 13 drejtoritë.

Rregulla të detyrueshme (Rregullore 27.03.2025 + faqet e shërbimeve):

| Tekst | Jo kështu | Po kështu |
|---|---|---|
| Dua leje ndërtimi | — | URB |
| Fqinji po ndërton pa leje | URB | INS |
| Dua të legalizoj objektin tim pa leje | INS | URB (URB-20) |
| Dua të regjistroj parcelën | URB | KAD |
| Dua të ndaj parcelën për të ndërtuar | KAD | URB (pëlqim parcelimi) |
| Gropë / rrugë e dëmtuar | SHP | INF |
| Ndriçim publik | INF (faqja e vjetër e stafit) | SHP (Neni 11) |
| Mbeturina / kontejner / park / varreza | INF | SHP |
| Nuk kemi ujë të pijshëm | INF / SHP | SHS |
| Kanalizim / ujëra të zeza | SHS | SHP |
| Gjobë tregu / kioskë pa leje | URB / ZHE | INS |
| Dua pëlqim për kioskë | INS | URB |
| Dua certifikatë biznesi | INS | ZHE |
| Zjarr / 112 / vërshim | INS | MSH |
| Certifikatë lindjeje / martesë | — | ADM |
| Tatim në pronë | KAD | FIN |
| Bursë / çati shkolle | INF | ARS |

## 3. Duplikatë

Bashko vetëm nëse është **i njëjti problem real** (e njëjta rrugë/vend + i njëjti
dëmtim/kërkesë). Tekste të ngjashme në rrugë të ndryshme **nuk** bashkohen.

- «Gropë në rrugën e Pejës» dhe «Gropë në rrugën e Prizrenit» → NEW_CASE
- Tre parafrazime të gropës në rrugën e Pejës → MERGED
- GPS < ~100 m + i njëjti problem → MERGED
- GPS larg + i njëjti tekst → NEW_CASE
- Numër protokolli i njëjtë → MERGED

Gabimi më i rëndë: **bashkim i rremë** (false merge). Nëse ke dyshim, NEW_CASE.

## 4. Si të korrigjosh

1. Hap `data/datasets/intent_department.csv`
2. Ndrysho `intent`, `department_id` ose `procedure_id`
3. Mos ndrysho `family` (përdoret për ndarjen train/val/test)
4. Ruaj dhe ristërvit: `python scripts/train_intent.py` etj.
"""
    (DATA_DIR / "REVIEW.md").write_text(text, encoding="utf-8")


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    rows = assign_splits(generate_department_rows())
    write_csv(DATA_DIR / "intent_department.csv", rows)
    dups = generate_duplicate_rows()
    write_csv(DATA_DIR / "duplicate.csv", dups)
    write_review_md()
    counts = {}
    for r in rows:
        counts[r["split"]] = counts.get(r["split"], 0) + 1
    print(f"Wrote {len(rows)} intent/department rows: {counts}")
    print(f"Wrote {len(dups)} duplicate pairs.")
    print(f"Review guide: {DATA_DIR / 'REVIEW.md'}")


if __name__ == "__main__":
    main()
