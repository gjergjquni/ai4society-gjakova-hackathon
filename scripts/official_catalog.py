"""Official Gjakova competence catalog extracted from regulation + staff/service pages.

Every record cites source_url and official sentence. This is the seed the scraper
merges with live fetches. Do not invent duties that are not in these sources.
"""

from __future__ import annotations

from app.taxonomy import (
    REGULATION_TITLE,
    REGULATION_URL_MAY,
    STAFF_URLS,
)

REG = REGULATION_URL_MAY
REG_TITLE = REGULATION_TITLE
S8 = "https://gjakova.rks-gov.net/sherbimet-8/"
S6 = "https://gjakova.rks-gov.net/sherbimet-6/"
S2 = "https://gjakova.rks-gov.net/sherbimet-2/"
S9 = "https://gjakova.rks-gov.net/sherbimet-9/"

# Retrieved during official extraction for this build.
RETRIEVED_AT = "2026-09-26T12:00:00+00:00"


def R(text: str, neni: str, excerpt: str | None = None) -> dict:
    return {
        "text": text,
        "source_url": REG,
        "source_title": f"{REG_TITLE} — {neni}",
        "excerpt": excerpt or text,
        "retrieved_at": RETRIEVED_AT,
    }


def S(text: str, url: str, title: str, excerpt: str | None = None) -> dict:
    return {
        "text": text,
        "source_url": url,
        "source_title": title,
        "excerpt": excerpt or text,
        "retrieved_at": RETRIEVED_AT,
    }


def P(name: str, description: str, url: str, title: str) -> dict:
    return {
        "name": name,
        "description": description,
        "source_url": url,
        "source_title": title,
        "retrieved_at": RETRIEVED_AT,
    }


CATALOG: dict[str, dict] = {
    "ADM": {
        "sectors": [
            "Sektori për Gjendje Civile",
            "Sektori për Administrimin e Dokumenteve",
            "Sektori për Teknologji Informative dhe Logjistikë",
        ],
        "mission": "Ofrimi i shërbimeve të gjendjes civile, administrimit të dokumenteve, teknologjisë informative dhe logjistikës për qytetarët dhe institucionin.",
        "responsibilities": [
            R("Mbajtja dhe ruajtja e librave amëz te të lindurve, martuarve dhe vdekurve.", "Neni 9"),
            R("Regjistrimi i të porsalindurve në LAL.", "Neni 9"),
            R("Regjistrimi i të vdekurve në LAV.", "Neni 9"),
            R("Kurorëzimi i martesave brenda dhe jashtë Komunës dhe regjistrimi në LAM.", "Neni 9"),
            R("Ndryshimi dhe përmirësimi i emrit personal sipas kërkesës së palës.", "Neni 9"),
            R(
                "Lëshon certifikatat: certifikatat e lindjeve, statusit martesor, martesës, vendbanimit, vdekjes, bashkësisë familjare, shtetësisë, të qenit gjallë dhe deklaratën për mbajtjen e familjes.",
                "Neni 9",
            ),
            R("Zhvillon procedurën për fitimin dhe humbjen e shtetësisë.", "Neni 9"),
            R(
                "Zbaton procedurat për menaxhimin dhe administrimin e dokumenteve, informon mbi procedurat administrative si dhe pranon, kontrollon, klasifikon dhe evidenton dokumentet.",
                "Neni 9",
            ),
            R("Administron klasifikimin e lëndëve dhe akteve si dhe menaxhon Arkivin e Komunës.", "Neni 9"),
            R(
                "Përgjigjet pyetjeve lidhur me institucionin, orienton palët për realizimin e kërkesave të tyre, jep informacionet e duhura dhe mirëpret vizitorët në institucion.",
                "Neni 9",
            ),
            S(
                "Shërbimi i Ofiqarisë ofron lëshimin e certifikatës së gjendjes civile, regjistrimet e lindjeve, certifikatën e lindjes, certifikatën e kurorëzimit, certifikatën e vdekjes, certifikatën e vendbanimit, certifikatën e gjendjes familjare, certifikatën mbi statusin martesor, vërtetimin për vendqëndrim, ndërrimin e emrit personal.",
                STAFF_URLS["ADM"],
                "Drejtoria për punë të përgjithshme administrative — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Certifikatë lindjeje", "Pajisje e palës me certifikatë lindjeje nga librat amëz.", S6, "Shërbimet Administrata"),
            P("Certifikatë kurorëzimi", "Pajisje me certifikatë kurorëzimi.", S6, "Shërbimet Administrata"),
            P("Certifikatë statusi martesor", "Lëshimi i certifikatës së statusit martesor.", S6, "Shërbimet Administrata"),
            P("Certifikatë shtetësie", "Lëshimi i certifikatës së shtetësisë.", S6, "Shërbimet Administrata"),
            P("Certifikatë bashkësie familjare", "Lëshimi i certifikatës së bashkësisë familjare.", S6, "Shërbimet Administrata"),
            P("Certifikatë vendbanimi", "Lëshimi i certifikatës së vendbanimit.", S6, "Shërbimet Administrata"),
            P("Vërtetim vend-qëndrimi", "Lëshimi i vërtetimit për vend-qëndrim.", S6, "Shërbimet Administrata"),
            P("Dëshmi vdekjeje", "Lëshimi i dëshmisë së vdekjes.", S6, "Shërbimet Administrata"),
            P("Korrigjim apo ndërrim emri/mbiemri", "Procedura për ndërrimin ose korrigjimin e emrit personal.", S6, "Shërbimet Administrata"),
            P("Regjistrim lindjeje", "Regjistrim i rregullt ose i mëvonshëm i lindjes në librat amëz.", S6, "Shërbimet Administrata"),
            P("Kurorëzim / lidhje martese", "Kurorëzim brenda lokaleve të Komunës ose me shtetas të huaj.", S6, "Shërbimet Administrata"),
            P("Regjistrim vdekjeje", "Regjistrim i rregullt ose i mëvonshëm i vdekjes.", S6, "Shërbimet Administrata"),
        ],
        "hard_negatives": [
            {
                "confused_with": "FIN",
                "rule": "Certifikatë civile / emër / martesë → ADM. Tatim në pronë → FIN.",
            }
        ],
    },
    "FIN": {
        "sectors": [
            "Sektori për Financa",
            "Sektori për Buxhet",
            "Sektori për Tatimin në Pronë",
            "Sektori për të Hyrat Komunale",
        ],
        "mission": "Koordinimi i planifikimit të buxhetit, të hyrat komunale, tatimin në pronë dhe ekzekutimi i buxhetit të Komunës.",
        "responsibilities": [
            R("Menaxhimi dhe ekzekutimi i buxhetit komunal.", "Neni 10"),
            R("Përgatitja e Raportit vjetor Financiar me analizë mbi të hyrat dhe shpenzimet vjetore.", "Neni 10"),
            R("Regjistrimi i të gjitha të hyrave komunale, për të gjitha programet buxhetore të Komunës dhe raportimi i tyre.", "Neni 10"),
            R("Planifikimi i Buxhetit të Komunës në koordinim me Kryetarin dhe njësitë organizative.", "Neni 10"),
            R("Hartimin e Buxhetit Komunal dhe parashikimin për çdo vit.", "Neni 10"),
            R(
                "Sektori për Tatimin në Pronë është përgjegjës për administrimin e procesit të tatimit në pronë për pronat e paluajtshme që ndodhen brenda territorit të Komunës së Gjakovës.",
                "Neni 10",
            ),
            R("Zbaton Ligjin dhe aktet nënligjore që kanë të bëjnë me tatimin në pronën e paluajtshme.", "Neni 10"),
            R("Përmes regjistrimit, klasifikimit dhe inspektimin të pronave të paluajtshme.", "Neni 10"),
            R(
                "Shqyrton ankesat e tatimpaguesve për shtyrjen e afatit për pagesën e detyrimeve tatimore, korrigjimet ose vlerën e kontestuar të faturës së tatimit.",
                "Neni 10",
            ),
            R("Regjistron të hyrat e komunës në modulin e të hyrave dhe klasifikon ato sipas programeve dhe kodit ekonomik.", "Neni 10"),
            S(
                "Kjo drejtori është përgjegjëse për udhëheqjen e çështjeve financiare të Komunës, përgatitjen e buxhetit vjetor, mbajtjen e llogarive, menaxhimin e fondeve komunale dhe menaxhimin e thesarit.",
                STAFF_URLS["FIN"],
                "Drejtoria për Buxhet dhe Financa — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Administrim i tatimit në pronë", "Administrimi i procesit të tatimit në pronë për pronat e paluajtshme.", REG, REG_TITLE),
            P("Ankesë për faturë tatimi në pronë", "Shqyrtim i ankesës për vlerën e kontestuar ose korrigjim të faturës së tatimit.", REG, REG_TITLE),
            P("Shtyrje afati pagese tatimi", "Kërkesë për shtyrjen e afatit për pagesën e detyrimeve tatimore.", REG, REG_TITLE),
            P("Regjistrim të hyrash komunale", "Regjistrim dhe klasifikim i të hyrave komunale.", REG, REG_TITLE),
            P("Informim për buxhetin komunal", "Kërkesë për informata mbi buxhetin, të hyrat dhe shpenzimet komunale.", REG, REG_TITLE),
        ],
        "hard_negatives": [
            {
                "confused_with": "KAD",
                "rule": "Tatim / faturë tatimi → FIN. Fletëposedim / regjistër kadastral → KAD.",
            }
        ],
    },
    "SHP": {
        "sectors": [
            "Sektori për Hapësira Publike dhe Energjetikë",
            "Sektori për Menaxhimin e Mbeturinave",
        ],
        "mission": "Të ofrojë shërbime cilësore dhe efektive për qytetarët, duke siguruar menaxhimin, zhvillimin dhe mirëmbajtjen e hapësirave publike, si dhe mjedisit në harmoni me nevojat e komunitetit.",
        "responsibilities": [
            R(
                "Ndërtimi, rregullimi dhe menaxhimi i hapësirave publike siç janë: parqet, hapësirat e gjelbra, hapësirat rekreative, tregjet dhe varrezat.",
                "Neni 11",
            ),
            R(
                "Mbikëqyrja dhe realizimi i projekteve për mbjelljen dhe ruajtjen e pemëve, luleve dhe bimëve tjera që vendosen në hapësira publike.",
                "Neni 11",
            ),
            R(
                "Mbikëqyrja dhe realizimi i projekteve për vendosjen dhe mirëmbajtjen e mobileve urbane në parqe, trotuare, varreza, tregje dhe hapësira tjera publike.",
                "Neni 11",
            ),
            R(
                "Mbikëqyrja dhe realizimi i projekteve për zgjerimin dhe mirëmbajtjen e ndriçimit publik, efiçincës së energjisë dhe sistemeve të ngrohjes lokale.",
                "Neni 11",
            ),
            R(
                "Trajtimi i kafshëve endacake në hapësirat publike duke ju siguruar trajtim sipas standardeve të parapara me ligjet dhe rregulloret përkatëse si dhe strehimi eventual i tyre.",
                "Neni 11",
            ),
            R(
                "Në bashkëpunim me inspektorët përkatës nga Drejtoria për Inspektime lëshon leje për trajtimin e drunjtëve, luleve dhe bimëve tjera në hapësirat publike.",
                "Neni 11",
            ),
            R(
                "Mbikëqyrja dhe realizimi i projekteve që kanë të bëjnë me menaxhimin e mbeturinave, pastrimin e rrugëve (bashkë me elementet e tyre), hapësirave publike dhe trajtimin e ujërave të zeza.",
                "Neni 11",
            ),
            R(
                "Në bashkëpunim me organet kompetente organizon sistemin e grumbullimit, transportit, trajtimit dhe deponimit të mbeturinave.",
                "Neni 11",
            ),
            R(
                "Asiston në përcaktimin e pikave për grumbullimin e mbetjeve dhe përcaktimin e vendosjes së kontejnerëve në vendet e duhura.",
                "Neni 11",
            ),
            R(
                "Identifikimi dhe eliminimi i deponive ilegale të mbeturinave si dhe rehabilitimi i zonave të ndotura.",
                "Neni 11",
            ),
        ],
        "procedures": [
            P("Mirëmbajtje ndriçimi publik", "Zgjerim dhe mirëmbajtje e ndriçimit publik dhe efiçencës së energjisë.", REG, REG_TITLE),
            P("Menaxhim parqesh dhe gjelbërimi", "Rregullim i parqeve, hapësirave të gjelbra dhe mobileve urbane.", REG, REG_TITLE),
            P("Menaxhim tregjesh komunale", "Menaxhim i tregjeve komunale.", REG, REG_TITLE),
            P("Mirëmbajtje varrezash", "Mirëmbajtje e varrezave të miratuara me vendim të Kuvendit.", REG, REG_TITLE),
            P("Menaxhim mbeturinash", "Grumbullim, transport, trajtim dhe deponim i mbeturinave.", REG, REG_TITLE),
            P("Vendosje kontejnerësh", "Përcaktim i pikave dhe vendosje e kontejnerëve.", REG, REG_TITLE),
            P("Pastrimi i rrugëve dhe hapësirave publike", "Pastrimi i rrugëve dhe hapësirave publike.", REG, REG_TITLE),
            P("Trajtim ujërash të zeza", "Trajtim i ujërave të zeza.", REG, REG_TITLE),
            P("Trajtim kafshësh endacake", "Trajtim dhe strehim i kafshëve endacake në hapësira publike.", REG, REG_TITLE),
            P("Leje për trajtim drunjsh në hapësirë publike", "Leje për trajtimin e drunjve, luleve dhe bimëve në hapësira publike.", REG, REG_TITLE),
            P("Eliminim deponie ilegale", "Identifikim dhe eliminim i deponive ilegale të mbeturinave.", REG, REG_TITLE),
        ],
        "hard_negatives": [
            {
                "confused_with": "INF",
                "rule": "Gropë / dëmtim strukture rrugore → INF. Pastrimi, mbeturina, ndriçim publik, parqe → SHP (Neni 11 vs Neni 12).",
            },
            {
                "confused_with": "SHS",
                "rule": "Ujë i pijshëm / higjienë si masë shëndetësore → SHS. Ujëra të zeza / mbeturina → SHP.",
            },
        ],
    },
    "INF": {
        "sectors": [
            "Sektori për Infrastrukturë Rrugore",
            "Sektori për Transport dhe Trafik",
        ],
        "mission": "Të sigurojë një infrastrukturë rrugore dhe një sistem transporti të qëndrueshëm, funksional dhe të sigurt.",
        "responsibilities": [
            R("Hartimi i planeve afatshkurtra dhe afatgjata për ndërtimin dhe zhvillimin e rrjetit rrugor.", "Neni 12"),
            R(
                "Mbikëqyrja dhe realizimi i projekteve të ndërtimit të rrugëve, trotuareve, shtigjeve për biçikleta, urave dhe objekteve tjera përcjellëse sipas standardeve teknike dhe ligjore.",
                "Neni 12",
            ),
            R(
                "Planifikimi dhe organizimi i mirëmbajtjes së rrjetit rrugor, trotuareve, shtigjeve të biçikletave, urave dhe elementeve tjera të rrugës duke përfshirë sanimin e sipërfaqes qarkulluese të rrugës, deformimet boshtore dhe dëmtimet e tjera strukturore të rrugëve.",
                "Neni 12",
            ),
            R(
                "Menaxhimi i aktiviteteve të mirëmbajtjes së rrjetit rrugor gjatë stinës së dimrit, pastrimi i borës dhe akullit për të siguruar lëvizshmëri të sigurt.",
                "Neni 12",
            ),
            R(
                "Rregullimi teknik i trafikut në rrugët publike që janë nën administrimin e Komunës si dhe mbikëqyrja dhe realizimi i projekteve të sinjalizimit rrugor.",
                "Neni 12",
            ),
            R(
                "Lëshimi i lejeve për ushtrimin e veprimtarisë së transportit të rregullt të udhëtarëve, për transportin e lirë të udhëtarëve, për transportin taksi të udhëtarëve, për transportin e udhëtarëve për nevoja vetanake.",
                "Neni 12",
            ),
            R(
                "Lëshimi i lejeve për ndalim të përkohshëm të qarkullimit të automjeteve për shkak të punimeve në rrugë apo manifestimeve.",
                "Neni 12",
            ),
            R(
                "Lëshimi i lejeve për qarkullim të mjeteve me masë, ngarkesë ose dimensione mbi ato të lejuara.",
                "Neni 12",
            ),
            S(
                "Kompetenca e Drejtorisë për Infrastrukturë është infrastruktura rrugore dhe sistemi i transportit: rrugë, trotuare, ura, sinjalizim dhe leje transporti (Neni 12). Ndriçimi publik i takon Shërbimeve Publike sipas Neni 11.",
                STAFF_URLS["INF"],
                "Drejtoria për Infrastrukturë — Komuna e Gjakovës (kompetenca sipas rregullores 27.03.2025)",
            ),
        ],
        "procedures": [
            P("Mirëmbajtje / sanim i rrugës", "Sanim i sipërfaqes qarkulluese, deformimeve boshtore dhe dëmtimeve strukturore të rrugëve.", REG, REG_TITLE),
            P("Ndërtim / riparim trotuari", "Ndërtim dhe mirëmbajtje e trotuareve.", REG, REG_TITLE),
            P("Riparim ure", "Ndërtim dhe mirëmbajtje e urave.", REG, REG_TITLE),
            P("Mirëmbajtje dimërore e rrugës", "Pastrimi i borës dhe akullit në rrjetin rrugor.", REG, REG_TITLE),
            P("Sinjalizim rrugor", "Projekte të sinjalizimit rrugor dhe sigurisë në trafik.", REG, REG_TITLE),
            P("Leje transporti udhëtarësh / taksi", "Lëshim lejeje për transport të rregullt, të lirë, taksi ose për nevoja vetanake.", REG, REG_TITLE),
            P("Leje ndalimi të përkohshëm të qarkullimit", "Ndalim i përkohshëm i qarkullimit për punime ose manifestime.", REG, REG_TITLE),
            P("Leje për mjete mbi dimensionet e lejuara", "Leje për mjete me masë/ngarkesë/dimensione mbi të lejuarat.", REG, REG_TITLE),
        ],
        "hard_negatives": [
            {
                "confused_with": "SHP",
                "rule": "Gropë/rrugë/trotuar/ura → INF. Ndriçim publik/pastrim/mbeturina/parqe → SHP.",
            }
        ],
    },
    "SHS": {
        "sectors": [
            "Sektori për Shëndetësi",
            "Sektori për Mirëqenie Sociale",
            "Qendra për Punë Sociale",
            "Qendra Kryesore e Mjekësisë Familjare",
        ],
        "mission": "Planifikimi dhe orientimi i strategjive për të ofruar shërbime gjithëpërfshirëse të kujdesit parësor shëndetësor, shërbimeve sociale, asistencës sociale dhe mirëqenies sociale.",
        "responsibilities": [
            R("Planifikimi dhe orientimi i strategjisë së Kujdesit Parësor Shëndetësor.", "Neni 13"),
            R("Vlerësimin e nevojave lokale për shëndetësi parësore si dhe vendosjen e objektivave lokale për KPSH.", "Neni 13"),
            R("Vendosjen dhe mbledhjen e bashkë pagesave brenda kornizës së caktuar nga MSH.", "Neni 13"),
            R("Mbikëqyrjen e situatës epidemiologjike në nivel komunal.", "Neni 13"),
            R("Planifikimi dhe shpërndarja e subvencioneve shëndetësore Komunale.", "Neni 13"),
            R("Menaxhimi i programeve të strehimit social për individët dhe familjet pa kulm mbi kokë.", "Neni 13"),
            R("Organizon dhe ofron drejtpërdrejtë shërbimet sociale, vlerëson nevojat e përfituesve dhe planifikon ofrimin e shërbimeve.", "Neni 13"),
            S(
                "Përkujdeset për masat e mbrojtjes shëndetësore që kanë të bëjnë me: sigurimin e ujit të sigurt dhe higjienës, sigurimin e ushqimit të sigurt dhe nutricionit, aktivitetet e dezinfektimit, dezinsektimit, dhe deratizimit.",
                STAFF_URLS["SHS"],
                "Drejtoria për Shëndetësi dhe Mirëqenie Sociale — Komuna e Gjakovës",
            ),
            S(
                "Bashkërenditjen dhe mbikëqyrjen e punëve me QKMF, QMF dhe me Ambulanca.",
                STAFF_URLS["SHS"],
                "Drejtoria për Shëndetësi dhe Mirëqenie Sociale — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Kujdes parësor shëndetësor / QKMF", "Ofrim dhe mbikëqyrje e shërbimeve të kujdesit parësor, QKMF, QMF dhe ambulancave.", STAFF_URLS["SHS"], "Staff SHS"),
            P("Subvencion shëndetësor komunal", "Planifikim dhe shpërndarje e subvencioneve shëndetësore komunale.", REG, REG_TITLE),
            P("Strehimi social", "Programe të strehimit social për familjet pa kulm mbi kokë.", REG, REG_TITLE),
            P("Shërbime sociale / Qendra për Punë Sociale", "Vlerësim nevojash dhe ofrim i shërbimeve sociale.", REG, REG_TITLE),
            P("Mbrojtje shëndetësore e ujit dhe higjienës", "Masa për sigurimin e ujit të sigurt, higjienës, ushqimit të sigurt, dezinfektim/dezinsektim/deratizim.", STAFF_URLS["SHS"], "Staff SHS"),
            P("Mbikëqyrje epidemiologjike", "Mbikëqyrje e situatës epidemiologjike në nivel komunal.", REG, REG_TITLE),
            P("Bashkëpagesa shëndetësore", "Vendosje dhe mbledhje e bashkëpagesave sipas kornizës së MSH.", REG, REG_TITLE),
        ],
        "hard_negatives": [
            {
                "confused_with": "SHP",
                "rule": "Ujë i pijshëm / epidemi / QKMF → SHS. Kanalizim / mbeturina → SHP.",
            }
        ],
    },
    "ARS": {
        "sectors": [
            "Sektori për Arsim",
            "Sektori për Statistika, Administratë dhe Infrastrukturë Arsimore",
            "Arsimi Parauniversitar",
        ],
        "mission": "Ofrimi i shërbimeve në arsimin parauniversitar, nivelet parashkollor, fillor, të mesëm të ulët dhe të mesëm të lartë, si dhe zhvillimi i arsimit lokal dhe aftësimit profesional.",
        "responsibilities": [
            R(
                "Ofrimin e mundësive të barabarta për të ndjekur arsimin parashkollor, fillor, të mesëm të ulët dhe të mesëm të lartë në komunë si dhe zhvillimin e arsimit lokal dhe aftësimit profesional.",
                "Neni 14",
            ),
            R("Planifikimin e zhvillimit të arsimit parashkollor, fillor dhe të mesëm në Komunë, në konsultim me MASHT-in.", "Neni 14"),
            R("Shqyrtimin e vazhdueshëm të masave të marra për realizimin e arsimit special.", "Neni 14"),
            R(
                "Mirëmbajtjen dhe riparimin e ndërtesave dhe pajisjeve të institucioneve arsimore me fonde publike, si dhe sigurimin e dispozitave për mirëmbajtje të shërbimeve mbështetëse për mirëqenien fizike të nxënësve, duke përfshirë ujë të freskët, ambiente banjash dhe shërbime shëndetësore.",
                "Neni 14",
            ),
            R(
                "Marrjen e masave për të siguruar që ambienti rrethues urban apo rural në të cilin është e vendosur shkolla është në përputhje me të drejtën e nxënësve për të pasur një mjedis të sigurt në oborrin e shkollës.",
                "Neni 14",
            ),
            S(
                "Përkujdesjen e pagesave të personelit mësimdhënës dhe teknik në institucionet arsimore të Komunës.",
                STAFF_URLS["ARS"],
                "Drejtoria për Arsim, Shkencë dhe Teknologji — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Regjistrim në arsim parauniversitar", "Mundësi të barabarta për ndjekjen e arsimit parashkollor, fillor dhe të mesëm.", REG, REG_TITLE),
            P("Bursë / mbështetje arsimore", "Kërkesë për mbështetje ose bursë në kuadër të arsimit lokal.", STAFF_URLS["ARS"], "Staff ARS"),
            P("Arsim special", "Propozim dhe vlerësim profesional për arsimim special.", REG, REG_TITLE),
            P("Mirëmbajtje objekti shkollor", "Riparim i ndërtesave dhe pajisjeve të institucioneve arsimore, përfshirë çati, ujë, banja.", REG, REG_TITLE),
            P("Siguri e oborrit të shkollës", "Masa për mjedis të sigurt në oborrin e shkollës.", REG, REG_TITLE),
            P("Ankesë për disiplinë / rregullore shkolle", "Hartim dhe zbatim i rregulloreve për sjelljen dhe disiplinën e nxënësve.", REG, REG_TITLE),
            P("Pagesa personeli arsimor", "Çështje të pagesave të personelit mësimdhënës dhe teknik.", STAFF_URLS["ARS"], "Staff ARS"),
        ],
        "hard_negatives": [
            {
                "confused_with": "INF",
                "rule": "Objekt/oborr shkolle → ARS. Rrugë komunale pranë shkollës → INF.",
            }
        ],
    },
    "KRS": {
        "sectors": [
            "Sektori për Kulturë",
            "Sektori për Rini",
            "Sektori për Sport",
            "Pallati i Kulturës",
            "Teatri i Qytetit “Hadi Shehu”",
            "Biblioteka “Ibrahim Rugova”",
            "Muzeu i Qytetit",
            "Galeria e Arteve",
            "Pallati i Sporteve “Shani Nushi”",
            "Stadiumi i Qytetit",
        ],
        "mission": "Të hartojë dhe zbatojë politika zhvillimore në nxitje dhe motivim të krijimtarisë artistike, kulturore dhe sportive.",
        "responsibilities": [
            R("Mbështet, orienton, koordinon dhe ndjek ecurinë e zbatimit të projekteve kulturore dhe artistike.", "Neni 15"),
            R("Nxitë formimin e klubeve, grupeve dhe shoqatave rinore në Komunë.", "Neni 15"),
            R("Inkurajon mbështetjen financiare dhe mbështet aktivitete tjera për Sektorin e Rinisë.", "Neni 15"),
            R("Harton dhe zbaton politika zhvillimore në fushën e sportit dhe rekreacionit.", "Neni 15"),
            R("Ndihmon klubet, shoqatat sportive dhe sportistët e dalluar në arritjen e synimeve.", "Neni 15"),
            S(
                "Të menaxhojë në kuadër të kompetencave ligjore me: Teatër, Bibliotekë, Arkiv, Stadiumin e Qytetit, Palestrën e Sporteve dhe Pallatin e Kulturës.",
                STAFF_URLS["KRS"],
                "Drejtoria për Kulturë, Rini dhe Sport — Komuna e Gjakovës",
            ),
            S(
                "Çdo vit të bëjë publike buxhetin për aktivitete kulturore, të rinisë dhe sporteve, duke përfshirë grande, si dhe të përpilojë rregullore për dorëzimin e aplikacioneve për grande.",
                STAFF_URLS["KRS"],
                "Drejtoria për Kulturë, Rini dhe Sport — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Grant kulturor", "Aplikim për grant/mbështetje për aktivitet kulturor ose artistik.", STAFF_URLS["KRS"], "Staff KRS"),
            P("Grant rinor", "Aplikim për mbështetje financiare të aktiviteteve rinore.", REG, REG_TITLE),
            P("Grant / mbështetje sportive", "Mbështetje për klube, shoqata sportive dhe sportistë.", REG, REG_TITLE),
            P("Përdorim i Stadiumit të Qytetit", "Kërkesë për përdorim të stadiumit ose objektit sportiv komunal.", STAFF_URLS["KRS"], "Staff KRS"),
            P("Përdorim i Pallatit të Kulturës / Teatrit", "Kërkesë për përdorim të institucioneve kulturore komunale.", STAFF_URLS["KRS"], "Staff KRS"),
            P("Regjistër klubesh / ansambleve", "Regjistrim i grupeve, klubeve, ansambleve.", STAFF_URLS["KRS"], "Staff KRS"),
        ],
        "hard_negatives": [
            {
                "confused_with": "ARS",
                "rule": "Shkollë / bursë shkollore → ARS. Klub sportiv / teatër / grant kulturor → KRS.",
            }
        ],
    },
    "ZHE": {
        "sectors": [
            "Sektori për Ekonomi dhe Turizëm",
            "Sektori për Regjistrimin e Bizneseve",
        ],
        "mission": "Të kontribuojë në zhvillimin e qëndrueshëm ekonomik dhe përmirësimin e kushteve të jetesës, duke ofruar mbështetje për bizneset, punësimin dhe turizmin.",
        "responsibilities": [
            R(
                "Hartimi, implementimi dhe monitorimi i politikave dhe strategjive për zhvillimin ekonomik dhe turistik në nivel lokal dhe rajonal si dhe zbatimi i rregullores për taksa në firmë duke përfshirë edhe mbledhjen e taksave në fushëveprim të DZHE.",
                "Neni 16",
            ),
            R("Inkurajimi i investimeve të huaja dhe vendase, ofrimi i shërbimeve për mbështetje të ndërmarrësve dhe bizneseve të reja.", "Neni 16"),
            R("Planifikimi dhe implementimi i aktiviteteve për promovimin e turizmit dhe zhvillimi i destinacioneve turistike.", "Neni 16"),
            R("Sigurimi i regjistrimit të plotë dhe të saktë të bizneseve të reja, përfshirë individët që regjistrojnë aktivitete tregtare.", "Neni 16"),
            R("Lëshimi i certifikatave të regjistrimit për bizneset që janë regjistruar dhe përmbushin të gjitha kërkesat ligjore.", "Neni 16"),
            S(
                "Regjistrimin e bizneseve të reja dhe pajisja me certifikata të biznesit. Evidentimin e ndryshimeve në certifikatat e biznesit. Evidentimin e shuarjes së biznesit. Dhënien e lejes për zgjatje të orarit të punës për subjektet afariste.",
                STAFF_URLS["ZHE"],
                "Drejtoria për Zhvillim Ekonomik — Komuna e Gjakovës",
            ),
            S(
                "Evidentimin e të gjithë obliguesve të taksës në firmë ndaj Komunës dhe arkëtimin e të hyrave përkatëse. Pranimi i ankesave nga bizneset dhe shqyrtimi i lëndëve nga komisioni pranë drejtorisë.",
                STAFF_URLS["ZHE"],
                "Drejtoria për Zhvillim Ekonomik — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Regjistrim biznesi / certifikatë biznesi", "Regjistrim i biznesit të ri dhe pajisje me certifikatë.", STAFF_URLS["ZHE"], "Staff ZHE"),
            P("Ndryshim / shuarje e biznesit", "Evidentim i ndryshimeve ose shuarjes së biznesit.", STAFF_URLS["ZHE"], "Staff ZHE"),
            P("Taksë në firmë", "Evidentim i obliguesve dhe arkëtim i taksës në firmë.", REG, REG_TITLE),
            P("Leje për zgjatje orari pune", "Leje për zgjatje të orarit të punës për subjekte afariste dhe OJQ.", STAFF_URLS["ZHE"], "Staff ZHE"),
            P("Mbështetje për biznes të ri / investime", "Këshillim dhe mbështetje për ndërmarrës dhe investime.", REG, REG_TITLE),
            P("Promovim turizmi / pako turistike", "Aktivitete për promovimin e turizmit lokal.", STAFF_URLS["ZHE"], "Staff ZHE"),
            P("Ankesë biznesi pranë DZHE", "Pranim dhe shqyrtim i ankesave të bizneseve në komisionin e drejtorisë.", STAFF_URLS["ZHE"], "Staff ZHE"),
        ],
        "hard_negatives": [
            {
                "confused_with": "INS",
                "rule": "Regjistrim biznesi / taksë firme → ZHE. Kioskë pa leje / gjobë tregu / mall i palejuar → INS.",
            },
            {
                "confused_with": "URB",
                "rule": "Certifikatë biznesi → ZHE. Pëlqim për kioskë në hapësirë publike → URB.",
            },
        ],
    },
    "URB": {
        "sectors": [
            "Sektori për Urbanizëm",
            "Sektori për Mbrojtje të Mjedisit",
            "Sektori për Planifikim",
        ],
        "mission": "Planifikimi dhe zhvillimi hapësinor dhe urbanistik i Komunës, menaxhimi i tokës ndërtimore përmes lejimit dhe kontrollit të ndërtimit, si dhe sigurimi dhe mbrojtja e mjedisit.",
        "responsibilities": [
            R(
                "Lëshimi i kushteve ndërtimore, lejeve ndërtimore, lejeve për rrënim dhe certifikatës së përdorimit për ndërtimet e kategorisë së I-rë dhe të II-të.",
                "Neni 17",
            ),
            R(
                "Lëshon Leje të Ndërtimit për objektet e infrastrukturës (ujësjellës, kanalizim, rrjet elektrik/tensioni i ulët, rrjet rrugor) si dhe lëshon Leje për Gropim për ndërtimin e traseve për kabllo dhe ajrore.",
                "Neni 17",
            ),
            R("Shqyrton kërkesat për Leje mjedisore Komunale.", "Neni 17"),
            R("Zbaton procedurat e kontrollimit dhe miratimit të projekteve urbanistike dhe projekteve të parcelimit dhe riparcelimit.", "Neni 17"),
            R("Trajtimi i ndërtimeve pa leje për objektet e kategorisë së I-rë dhe të II-të.", "Neni 17"),
            R(
                "Vepron në parandalimin dhe uljen e ndotjes së ujit, ajrit, tokës dhe ndotjeve tjera të çfarëdo lloji.",
                "Neni 17",
            ),
            S(
                "Përpunimin e kërkesave për lëshimin e lejeve ndërtimore dhe përcaktimin e kushteve urbanistike; lëshimin e lejeve të ndërtimit dhe përdorimit; jep pëlqime urbanistike.",
                STAFF_URLS["URB"],
                "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Leje Ndërtimi", "Pajisje e palës me leje ndërtimi për objekte të ndryshme.", S8, "Shërbimet Urbanizëm"),
            P("Kushte Ndërtimore", "Vendosja e kushteve për ndërtim në një parcelë të caktuar, si dokument që i bashkangjitet dokumentacionit për leje ndërtimi.", S8, "Shërbimet Urbanizëm"),
            P("Ekstrakt nga Plani Rregullativ", "Pajisje me ekstrakt të planit rregullativ me qëllim të planifikimit të ndërtimit.", S8, "Shërbimet Urbanizëm"),
            P(
                "Pëlqim për Parcelim",
                "Pajisja me pëlqim për parcelim që garanton se ndarja e parcelës është e lejuar dhe nuk përbën shkelje të zgjidhjes urbanistike për atë zonë. Kërkohet si dokumentacion shtesë për kërkesën për ndarje të parcelës.",
                S8,
                "Shërbimet Urbanizëm",
            ),
            P("Zgjatje e afatit të Lejes së Ndërtimit", "Pajisja me dokument për zgjatjen e afatit të lejes së ndërtimit, kur ndërtimi nuk ka filluar brenda një viti.", S8, "Shërbimet Urbanizëm"),
            P("Leje për Rrënimin e Objektit", "Pajisja me leje për rrënimin e objektit që pengon ndërtimin, paraqet rrezik, ose kërkohet hapja e terrenit.", S8, "Shërbimet Urbanizëm"),
            P("Leje Mjedisore Komunale", "Pajisja me leje mjedisore komunale që garanton parandalimin dhe zvogëlimin e ndikimit negativ në mjedis.", S8, "Shërbimet Urbanizëm"),
            P("Pëlqim për shfrytëzim ditor/sezonal të hapësirave publike", "Pajisja e subjekteve me pëlqim në lokacion për shfrytëzimin e përkohshëm të hapësirës publike.", S8, "Shërbimet Urbanizëm"),
            P(
                "Pëlqim për objekte të përkohshme (kioskë, bankomat, strehë autobusi)",
                "Shfrytëzim i hapësirës së pronës publike për vendosjen e objektit montues/demontues.",
                S8,
                "Shërbimet Urbanizëm",
            ),
            P("Uzurpimi arbitrar i tokës në pronësi shoqërore", "Zbulimi dhe mënjanimi i uzurpimeve arbitrare të tokës e cila është pronë shoqërore.", S8, "Shërbimet Urbanizëm"),
            P("Leje Ndërtimi për infrastrukturë", "Leje ndërtimi për ujësjellës, kanalizim, rrjet elektrik/tension i ulët, rrjet rrugor.", S8, "Shërbimet Urbanizëm"),
            P("Pëlqim për pano/reklama", "Shfrytëzim i përkohshëm i hapësirës publike për pano reklamuese, ekrane elektronike, banera.", S8, "Shërbimet Urbanizëm"),
            P("Leje për rrëmihje/kyçje në infrastrukturë komunale", "Kyçje në ujësjellës, kanalizim, rrjet elektrik, ngrohje për objekte të pajisura me leje ndërtimi.", S8, "Shërbimet Urbanizëm"),
            P("Shfrytëzim sipërfaqesh gjatë ndërtimit", "Shfrytëzim i sipërfaqeve publike gjatë ndërtimit për material dhe makineri.", S8, "Shërbimet Urbanizëm"),
            P("Leje për antena GSM", "Leje për vendosjen/ndërtimin e antenave GSM dhe antenave të internetit.", S8, "Shërbimet Urbanizëm"),
            P("Leje për trafostacion", "Leje për vendosjen e trafostacioneve për furnizim me energji elektrike.", S8, "Shërbimet Urbanizëm"),
            P("Leje gropimi për trasa kabllovike", "Leje për gropimin/ndërtimin e rrjetit të telekomunikacionit, termofikimit dhe tensionit të lartë.", S8, "Shërbimet Urbanizëm"),
            P("Pëlqim për hapësira lojërash", "Pëlqim në lokacion për aparate, shtatore dhe lojëra argëtuese.", S8, "Shërbimet Urbanizëm"),
            P("Kërkesa të veçanta", "Trajtimi i kërkesave të veçanta sipas kërkesave të palëve.", S8, "Shërbimet Urbanizëm"),
            P(
                "Ndërtime pa leje",
                "Trajtimi i procesit të ndërtimeve pa leje — bazuar në ligjin për ndërtimet pa leje. Përdoret kur pala kërkon të fillojë procesin administrativ të legalizimit, jo kur denoncon ndërtimin e huaj për inspektim.",
                S8,
                "Shërbimet Urbanizëm",
            ),
        ],
        "hard_negatives": [
            {
                "confused_with": "INS",
                "rule": "Kërkesë lejeje ose legalizim i objektit vetjak → URB. Denoncim i ndërtimit pa leje të fqinjit / inspektim → INS.",
            },
            {
                "confused_with": "KAD",
                "rule": "Pëlqim parcelimi urbanistik → URB. Regjistrim/ndarje kadastrale, hipotekë → KAD.",
            },
        ],
    },
    "BUJ": {
        "sectors": ["Sektori për Bujqësi dhe Zhvillim Rural"],
        "mission": "Zhvillimi i sektorit të bujqësisë i harmonizuar sipas standardeve dhe praktikave të BE-së, i mbështetur nga fondet zhvillimore lokale, qeveritare dhe ndërkombëtare.",
        "responsibilities": [
            R("Hartimi, implementimi dhe monitorimi i politikave zhvillimore dhe strategjive për zhvillimin e bujqësisë.", "Neni 18"),
            R("Analiza dhe menaxhimi i buxhetit të investimeve kapitale dhe subvencioneve.", "Neni 18"),
            R("Monitorimi dhe verifikimi i gjithë subvencioneve të ndara gjatë vitit të kaluar.", "Neni 18"),
            R("Hartimi dhe implementimi i politikave për sigurinë ushqimore dhe cilësinë e produkteve ushqimore.", "Neni 18"),
            S(
                "Ruajtjen e tokave bujqësore nga degradimet fizike dhe kimike; mbikëqyrjen e veprimtarisë në lëmin e pylltarisë; hartimin e programeve për mirëmbajtjen e sistemeve të vjetra që nuk përfshihen me Hidrosistemin “Radoniqi”.",
                STAFF_URLS["BUJ"],
                "Drejtoria për Bujqësi, Pylltari dhe Zhvillim Rural — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P(
                "Shëndërrim i tokës bujqësore në jo-bujqësore",
                "Pëlqim komunal (klasa V–VIII) për ndërrimin e destinimit të tokës bujqësore. Klasa I–IV shkon në MBPZHR.",
                S2,
                "Shërbimet – Bujqësi",
            ),
            P(
                "Subvencion për kultura bujqësore dhe blegtori",
                "Aplikime për pagesa direkte që i publikon MBPZHR: grurë, misër, vreshta, pemë, perime dhe blegtori.",
                S2,
                "Shërbimet – Bujqësi",
            ),
            P("Ndërtim pendash dhe kanalesh ujitjeje", "Ndërtim i pendave dhe kanaleve për ujitjen e tokave bujqësore.", S2, "Shërbimet – Bujqësi"),
            P("Vlerësim dëmesh nga fatkeqësi natyrore në fermë", "Vlerësim i dëmeve në prodhimtari bujqësore, blegtorale, pyje nga vërshime, borë, erëra.", S2, "Shërbimet – Bujqësi"),
            P("Regjistrim elektronik i fermerëve (NIF)", "Regjistrim i fermerit dhe lëshim i numrit unik identifikues.", S2, "Shërbimet – Bujqësi"),
            P("Aplikim për gjueti të përbashkëta", "Aplikim i shoqatave të gjuetarëve për shfrytëzim të vend-gjuetisë.", S2, "Shërbimet – Bujqësi"),
            P("Kërkesë për prerje të pyjeve vetanake", "Kërkesë e pronarit për prerje të pyllit; leja lëshohet në bashkëpunim me APK.", S2, "Shërbimet – Bujqësi"),
            P("Kërkesë për pyllëzim", "Kërkesë për pyllëzim të një sipërfaqeje (minimum 10 ari).", S2, "Shërbimet – Bujqësi"),
            P("Shfrytëzim tokash pyjore", "Kërkesë për shfrytëzim të tokave pyjore në pronësi të shtetit.", S2, "Shërbimet – Bujqësi"),
            P("Transport i masës drunore", "Fletë-përcjellëse për transport të masës së prerë drunore.", S2, "Shërbimet – Bujqësi"),
        ],
        "hard_negatives": [
            {
                "confused_with": "URB",
                "rule": "Pëlqim për shëndërrim toke bujqësore → BUJ. Leje ndërtimi pas ndërrimit të destinimit → URB.",
            }
        ],
    },
    "KAD": {
        "sectors": [
            "Sektori për Kadastër dhe Gjeodezi",
            "Sektori për Çështje Pronësore Juridike",
        ],
        "mission": "Ndërlidhja me Agjencinë Kadastrale të Kosovës për përmasimin e infrastrukturës së të dhënave kadastrale në pjesën tekstuale dhe grafike, dhe administrimin e tokës.",
        "responsibilities": [
            R(
                "Përpunimin e lëndëve juridike siç janë bartjet të ndryshme shitblerje, dhurim, aktgjykime administrativë, hipoteka dhe fshirje të hipotekave, ngarkesa të tjera siç janë vërejtjet dhe barra tatimore.",
                "Neni 19",
            ),
            R(
                "Menaxhon dhe ushtron përpunimin e lëndëve teknike siç janë ndarjet fizike, bashkim i parcelave, regjistrim i objektit, regjistrim i etazhitetit, legalizim i objektit, rregullim të parcelave.",
                "Neni 19",
            ),
            R("Zhvillon procedurat e shpronësimit.", "Neni 19"),
            R("Udhëheq procedurën administrative për kompensimin e pronave.", "Neni 19"),
            R("Bënë de-eksproprijimin.", "Neni 19"),
            S(
                "Kadastra kryen matje gjeodezike sipas kërkesave të personave juridikë, fizikë si dhe kërkesave të organeve të administratës.",
                STAFF_URLS["KAD"],
                "Drejtoria për Gjeodezi, Kadastër dhe Pronë — Komuna e Gjakovës",
            ),
            S(
                "Regjistrimin e pronës së paluajtshme në regjistrin e tokës komunale; zhvillimin e procedurave të regjistrimit sipas detyrës zyrtare dhe sipas kërkesës së palëve; zbatimin e Ligjit mbi hipotekat.",
                STAFF_URLS["KAD"],
                "Drejtoria për Gjeodezi, Kadastër dhe Pronë — Komuna e Gjakovës",
            ),
            S(
                "Ndarjen e ngastrave dhe shënimin e kufijve në rastin e eksproprijimit; incizimin e sipërfaqes së ndërtesave dhe përpunimin e skicave të ndarjeve.",
                STAFF_URLS["KAD"],
                "Drejtoria për Gjeodezi, Kadastër dhe Pronë — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Regjistrim i pronës së paluajtshme", "Regjistrim i pronës në regjistrin e tokës / kadastër.", STAFF_URLS["KAD"], "Staff KAD"),
            P("Fletëposedim / kopje e planit", "Lëshim i fletëposedimit ose kopjes së planit kadastral.", STAFF_URLS["KAD"], "Staff KAD"),
            P("Hipotekë / fshirje hipoteke", "Regjistrim ose fshirje e hipotekës.", REG, REG_TITLE),
            P("Ndarje fizike / bashkim parcelash", "Ndarje ose bashkim kadastral i parcelave.", REG, REG_TITLE),
            P("Matje gjeodezike", "Matje gjeodezike sipas kërkesës së palës.", STAFF_URLS["KAD"], "Staff KAD"),
            P("Regjistrim objekti / etazhitet", "Regjistrim i objektit ose etazhitetit.", REG, REG_TITLE),
            P("Shpronësim / kompensim prone", "Procedurë shpronësimi, de-eksproprijimi ose kompensimi.", REG, REG_TITLE),
            P("Korrigjim i regjistrit kadastral", "Korrigjim i regjistrit sipas procedurave në fuqi.", STAFF_URLS["KAD"], "Staff KAD"),
        ],
        "hard_negatives": [
            {
                "confused_with": "URB",
                "rule": "Regjistrim/fletëposedim/hipotekë → KAD. Pëlqim parcelimi për të ndërtuar → URB.",
            },
            {
                "confused_with": "FIN",
                "rule": "Regjistër kadastral → KAD. Faturë tatimi në pronë → FIN.",
            },
        ],
    },
    "MSH": {
        "sectors": [
            "Sektori për Siguri dhe Emergjenca",
            "Njësia e Zjarrfikësve",
        ],
        "mission": "Reagimi në shpëtimin e jetës, të mirave materiale dhe mjedisit nga zjarret dhe fatkeqësitë tjera natyrore përmes njësisë së zjarrfikësve, dhe shërbime 24h përmes qendrës së alarmimit 112.",
        "responsibilities": [
            R(
                "Identifikimi, analiza dhe vlerësimi i rreziqeve të shkaktuara nga fatkeqësitë natyrore, tekniko-teknologjike, dhe katastrofat tjera në territorin e Komunës së Gjakovës.",
                "Neni 20",
            ),
            R("Hartimi i Planit të masave për parandalimin dhe zvogëlimin e pasojave nga fatkeqësitë natyrore.", "Neni 20"),
            R(
                "Reagon konform kërkesave zyrtare të parashtruara nga qytetarët, përgjigjet ndaj rasteve emergjente të lajmëruara nga qendra e thirrjeve 112.",
                "Neni 20",
            ),
            R(
                "Në kuadër të sektorit vepron edhe Qendra e Alarmimit dhe Koordinimit Emergjent 112 që merret me pranimin, verifikimin, evidentimin dhe shpërndarjen e informatave të natyrës emergjente.",
                "Neni 20",
            ),
            R(
                "Gatishmëria dhe reagimi në shpëtimin e jetës, të mirave materiale dhe mjedisit nga zjarret dhe fatkeqësitë tjera natyrore; shuarja e zjarreve në objekte ndërtimore, banimi, pajisje elektrike, sipërfaqe të hapura dhe mjete transporti.",
                "Neni 20",
            ),
            R("Zbatimi i masave të kërkim-shpëtimit gjatë vërshimeve dhe tërmeteve.", "Neni 20"),
            R("Dhënia e vërtetimit mbi shkaqet e zjarrit për palën e dëmtuar.", "Neni 20"),
            S(
                "Bashkërenditjen dhe mbikëqyrjen e punës së Brigadës së Zjarrfikësve; bashkërenditjen e punëve me qendrën për alarmim dhe koordinim emergjent (QAKE-112).",
                STAFF_URLS["MSH"],
                "Drejtoria për Mbrojtje dhe Shpëtim — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Reagim emergjent 112", "Pranim dhe reagim ndaj rasteve emergjente të lajmëruara në 112.", REG, REG_TITLE),
            P("Shuarje zjarri / zjarrfikës", "Intervenim i Njësisë së Zjarrfikësve për shuarje zjarri.", REG, REG_TITLE),
            P("Kërkim-shpëtim në vërshim / tërmet", "Masa kërkim-shpëtimi gjatë vërshimeve dhe tërmeteve.", REG, REG_TITLE),
            P("Vërtetim mbi shkaqet e zjarrit", "Lëshim vërtetimi mbi shkaqet e zjarrit për palën e dëmtuar.", REG, REG_TITLE),
            P("Vlerësim rreziku / fatkeqësi natyrore", "Identifikim dhe vlerësim i rreziqeve nga fatkeqësitë natyrore.", REG, REG_TITLE),
            P("Alarmim i popullsisë", "Vështrim, lajmërim dhe alarmim i popullsisë për kërcënim rreziku.", STAFF_URLS["MSH"], "Staff MSH"),
        ],
        "hard_negatives": [
            {
                "confused_with": "INS",
                "rule": "Zjarr / 112 / vërshim / rrezik jete → MSH. Inspektim pa emergjencë → INS.",
            }
        ],
    },
    "INS": {
        "sectors": [
            "Sektori i Inspektoratit të Shërbimeve Publike",
            "Sektori i Inspektoratit të Ndërtimit",
            "Sektori i Inspektoratit të Tregut",
        ],
        "mission": "Mbikëqyrja inspektuese në fushën e inspektoratit të shërbimeve publike, inspektoratit të mjedisit, inspektoratit të ndërtimit dhe inspektoratit të tregut.",
        "responsibilities": [
            R(
                "Mbikëqyrjen inspektuese me qëllim të mbrojtjes së rrugëve publike komunale, pronës së paluajtshme, aseteve, instalimeve publike, trotuareve, shesheve, parqeve, varrezave dhe hapësirave tjera publike nga uzurpimet, dëmtimet, keqpërdorimet dhe shfrytëzimet pa pëlqime.",
                "Neni 21",
            ),
            R(
                "Mbikëqyrjen inspektuese të përputhjes së ndërtimit me dokumentacionin ndërtimor dhe kodin e aplikuar ndërtimor.",
                "Neni 21",
            ),
            R(
                "Mbikëqyrjen inspektuese të ndërrimit të destinimit dhe rrënimin e çfarëdo ndërtese apo strukture pa leje përkatëse.",
                "Neni 21",
            ),
            R(
                "Nxjerrjen e akteve administrative për mënjanimin e parregullsive, për mbylljen e vend ndërtimit, për ndalimin e punimeve e deri në rrënim të objekteve.",
                "Neni 21",
            ),
            R(
                "Mbikëqyrjen inspektuese me qëllim të mbrojtjes së të drejtave të konsumatorëve, produkteve, metrologjisë, veprimtarive turistike, hoteliere dhe zejtare.",
                "Neni 21",
            ),
            S(
                "Mbikëqyrjen dhe lëshimin e pëlqimeve për lokale afariste, kushtet për të bërë biznes të cilat janë të përcaktuara me legjislacionin në fuqi.",
                STAFF_URLS["INS"],
                "Drejtoria për Inspektime — Komuna e Gjakovës",
            ),
            S(
                "Personat fizik apo juridik të cilët kanë ankesa dhe kërkesa për fushëveprimtarinë e inspektorëve mund të drejtohen në arkivin e komunës dhe të mbushin formularin e ankesës apo kërkesës. Inspektimi kryhet nëse ankesa paralajmëron shkelje të dyshuara.",
                STAFF_URLS["INS"],
                "Drejtoria për Inspektime — Komuna e Gjakovës",
            ),
        ],
        "procedures": [
            P("Ankesë / kërkesë për inspektim", "Formular ankesë/kërkesë në Arkivën e komunës; përcillet te inspektori kompetent brenda 24 orëve.", STAFF_URLS["INS"], "Staff INS"),
            P("Inspektim ndërtimi pa leje", "Mbikëqyrje e ndërtimit pa leje, ndalim punimesh, mbyllje vendndërtimi, deri në rrënim.", REG, REG_TITLE),
            P("Inspektim përputhjeje me lejen e ndërtimit", "Mbikëqyrje e përputhjes së ndërtimit me dokumentacionin dhe kodin ndërtimor.", REG, REG_TITLE),
            P("Inspektim tregu / konsumator", "Mbikëqyrje e tregut, të drejtave të konsumatorit, çmimeve, reklamimit.", REG, REG_TITLE),
            P("Pëlqim për lokal afariste", "Lëshim pëlqimi për lokale afariste dhe kushte për të bërë biznes.", STAFF_URLS["INS"], "Staff INS"),
            P("Inspektim i shfrytëzimit të hapësirës publike pa pëlqim", "Inspektim i uzurpimeve, dëmtimeve dhe shfrytëzimeve pa pëlqim të hapësirës publike.", REG, REG_TITLE),
            P("Inspektim mjedisor", "Inspektim i aktiviteteve me ndikim në mjedis.", REG, REG_TITLE),
            P("Inspektim transporti / taksi", "Mbikëqyrje inspektuese e transportit të udhëtarëve dhe taksive.", REG, REG_TITLE),
            P("Gjobë / masë administrative e inspektimit", "Akte administrative për mënjanimin e parregullsive.", REG, REG_TITLE),
        ],
        "hard_negatives": [
            {
                "confused_with": "URB",
                "rule": "Denoncim i ndërtimit të huaj pa leje → INS. Kërkesë për leje ose legalizim → URB.",
            },
            {
                "confused_with": "MSH",
                "rule": "Inspektim pa rrezik jete → INS. Zjarr/emergjencë → MSH.",
            },
        ],
    },
}


EXAMPLE_REQUESTS: dict[str, list[str]] = {
    "ADM": [
        "Dua të pajisem me certifikatë lindjeje.",
        "Dua të regjistroj martesën në gjendjen civile.",
    ],
    "FIN": [
        "Dua të paguaj tatimin në pronë.",
        "Më duhet vërtetim i tatimit në pronë.",
    ],
    "SHP": [
        "Ju lutem vendosni një kontejner në lagjen time.",
        "Dua leje për prerjen e një peme në hapësirën publike.",
    ],
    "INF": [
        "Dua leje për transport taksi në Gjakovë.",
        "Kërkoj leje për ndalim të përkohshëm të qarkullimit për një dasmë.",
    ],
    "SHS": [
        "Dua të aplikoj për strehim social.",
        "Dua të aplikoj për subvencion shëndetësor komunal.",
    ],
    "ARS": [
        "Dua të regjistroj fëmijën në shkollën fillore.",
        "Dua të aplikoj për bursë shkollore.",
    ],
    "KRS": [
        "Dua të aplikoj për grant kulturor.",
        "Dua ta përdor stadiumin e qytetit për një ndeshje.",
    ],
    "ZHE": [
        "Dua të regjistroj një biznes të ri.",
        "Dua leje për zgjatje të orarit të lokalit.",
    ],
    "URB": [
        "Dua të pajisem me leje ndërtimi për shtëpinë time.",
        "Dua pëlqim për parcelim për të ndërtuar.",
    ],
    "BUJ": [
        "Dua të aplikoj për subvencion për bujqësi.",
        "Dua të regjistrohem si fermer me NIF.",
    ],
    "KAD": [
        "Dua të regjistroj parcelën në kadastër.",
        "Më duhet fletëposedimi i tokës.",
    ],
    "MSH": [
        "Dua vërtetim për shkakun e zjarrit në shtëpinë time.",
        "Kërkoj vlerësim rreziku për shtëpinë pranë lumit.",
    ],
    "INS": [
        "Dua pëlqim sanitar / pëlqim për lokal afariste.",
        "Dua të paraqes kërkesë për inspektim të një lokali.",
    ],
}

EXAMPLE_COMPLAINTS: dict[str, list[str]] = {
    "ADM": [
        "Nuk po më lëshojnë certifikatën e lindjes edhe pse e kam kërkuar para dy javësh.",
        "Emri im në certifikatë është i gabuar dhe askush nuk po e korrigjon.",
    ],
    "FIN": [
        "Fatura e tatimit në pronë është e gabuar.",
        "Kam paguar tatimin por ende figuroj borxhli.",
    ],
    "SHP": [
        "Ndriçimi publik nuk punon në lagjen time.",
        "Kontejnerët nuk po zbrazën prej dy javësh.",
    ],
    "INF": [
        "Ka gropë të madhe në rrugën e Pejës.",
        "Trotuari është i thyer dhe i rrezikshëm.",
    ],
    "SHS": [
        "Nuk kemi ujë të pastër në lagje.",
        "Ambulanca e lagjes nuk po punon.",
    ],
    "ARS": [
        "Çatia e shkollës po merr ujë.",
        "Kam aplikuar për bursë por nuk kam marrë përgjigje.",
    ],
    "KRS": [
        "Pallati i sportit është i mbyllur pa arsye.",
        "Nuk mora përgjigje për grantin kulturor.",
    ],
    "ZHE": [
        "Nuk po ma lëshojnë certifikatën e biznesit.",
        "Më kanë ngarkuar taksë në firmë padrejtësisht.",
    ],
    "URB": [
        "Komuna nuk po më jep përgjigje për lejen e ndërtimit që e kam dorëzuar para dy muajsh.",
        "Më kanë refuzuar lejen e ndërtimit pa arsye.",
    ],
    "BUJ": [
        "Kam aplikuar për subvencion por ende nuk kam marrë përgjigje.",
        "Dëmet e vërshimit në tokën time nuk janë vlerësuar.",
    ],
    "KAD": [
        "Fletëposedimi im ka gabim në kufij.",
        "Nuk po ma regjistrojnë parcelën.",
    ],
    "MSH": [
        "Zjarrfikësit vonuan shumë në thirrjen time.",
        "Nuk mora vërtetimin e shkakut të zjarrit.",
    ],
    "INS": [
        "Fqinji po ndërton pa leje ndërtimi.",
        "Më kanë vënë gjobë të padrejtë në treg.",
    ],
}
