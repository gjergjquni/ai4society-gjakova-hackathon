# Udhëzues etiketimi — Arkiva / nëpunës komunal

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
