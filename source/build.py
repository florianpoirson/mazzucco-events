"""Assemble Mazzucco Events pages from shared partials.
out/artifact : index.html without document skeleton (the artifact host adds it), devis.html complete
out/deploy   : both pages complete + robots.txt, sitemap.xml, llms.txt — ready for mazzucco.fr
"""
import json, os, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://www.mazzucco.fr"

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=Yellowtail&family=Courier+Prime:wght@400;700&display=swap">\n'
         '<link rel="stylesheet" href="style.css">')

def head(title, desc, path):
    return f'''<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/{path}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/{path}">
<meta property="og:image" content="{SITE}/assets/logo-round.png">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="assets/logo-round.png">
{FONTS}'''

def header(active):
    def cur(k): return ' aria-current="page"' if k == active else ''
    return f'''<header class="site">
  <div class="wrap nav">
    <a class="logo" href="./"><img src="assets/logo-black.png" alt="Mazzucco, Mozza &amp; Pizza" width="934" height="300"></a>
    <ul id="navList">
      <li><a href="./#maison">La maison</a></li>
      <li><a href="./#animations">Animations</a></li>
      <li><a href="./#produits">Produits</a></li>
      <li><a href="./#catalogues">Catalogues</a></li>
      <li><a href="./#presse">Presse</a></li>
      <li><a href="./#faq">FAQ</a></li>
      <li><a href="devis.html"{cur("devis")}>Devis</a></li>
    </ul>
    <a class="btn btn-ink" href="devis.html">Demander un devis</a>
    <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="navList">Menu</button>
  </div>
</header>'''

CONTACT = '''<section class="section black contact" id="contact">
  <div class="wrap contact-grid">
    <div style="display:grid;gap:26px">
      <img class="logo-w" src="assets/logo-white.png" alt="Mazzucco, Mozza &amp; Pizza" width="934" height="300" loading="lazy">
      <h2>Parlons de votre événement</h2>
      <p class="lede">Envoyez la date, le lieu et le nombre d'invités. Lorenzo vous répond personnellement avec une proposition.</p>
      <div class="ctas"><a class="btn btn-white" href="devis.html">Composer mon événement</a><a class="btn btn-line" href="https://wa.me/33618700482" target="_blank" rel="noopener">WhatsApp</a></div>
    </div>
    <div class="lines">
      <div class="cline"><span class="k">Téléphone &amp; WhatsApp</span><span class="v">06 18 70 04 82</span></div>
      <div class="cline"><span class="k">Demandes &amp; devis</span><span class="v">contact@mazzucco.fr</span></div>
      <div class="cline"><span class="k">Lorenzo Mazzucco</span><span class="v">lorenzo@mazzucco.fr</span></div>
      <div class="cline"><span class="k">Instagram</span><span class="v"><a href="https://instagram.com/mazzucco_events" target="_blank" rel="noopener">@mazzucco_events</a></span></div>
    </div>
  </div>
</section>'''

FOOTER = '''<footer>
  <div class="wrap foot">
    <div><p><b style="color:#fff">Mazzucco Events</b> · Traiteur italien événementiel, Paris, Île-de-France et toute la France. Concept Mazzucco depuis 2015.</p><p>Bars à pizza et focaccia, bar à mozzarella, pâtes fraîches dans la roue de parmesan, bar à tiramisu.</p></div>
    <div><p>Mentions légales : Monsieur Lorenzo Mazzucco, entrepreneur individuel. SIREN 480 403 211 · TVA FR38480403211 · NAF 5621Z.</p><p>Siège : 40 B promenade Marx Dormoy, 93460 Gournay-sur-Marne. © 2026 Mazzucco Events.</p></div>
  </div>
</footer>'''

WA = '''<a class="wa-fab" href="https://wa.me/33618700482?text=Bonjour%20Lorenzo%2C%20je%20souhaite%20un%20devis%20pour%20un%20%C3%A9v%C3%A9nement." target="_blank" rel="noopener" aria-label="Écrire à Mazzucco Events sur WhatsApp">
  <span class="tip">Une question ? WhatsApp</span>
  <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M16 3.5C9.1 3.5 3.5 9 3.5 15.8c0 2.4.7 4.6 1.9 6.5L3.6 28.5l6.4-1.7c1.8 1 3.9 1.5 6 1.5 6.9 0 12.5-5.5 12.5-12.3S22.9 3.5 16 3.5zm0 22.6c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8 1 1-3.6-.2-.4c-1.1-1.6-1.7-3.5-1.7-5.5 0-5.6 4.6-10.2 10.4-10.2s10.4 4.6 10.4 10.2S21.8 26.1 16 26.1zm5.7-7.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
</a>'''

RADIO = '''<div class="radio kraft" id="radio" role="region" aria-label="Radio Mazzucco">
  <span class="grille" aria-hidden="true"></span>
  <button class="radio-btn" id="radioPlay" type="button" aria-pressed="false" aria-label="Écouter Radio Mazzucco"></button>
  <div class="radio-info"><span class="onair"><i></i>On air</span><span class="station">Radio Mazzucco</span><span class="track" id="radioTrack"></span></div>
  <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
  <input type="range" id="radioVol" min="0" max="1" step="0.05" value="0.6" aria-label="Volume de la radio">
</div>'''

SK = 'stroke="#111" stroke-width="3"'
SKIN = "#EBC9A0"
LORENZO = f'''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="lorenzo" viewBox="0 0 300 430">
  <path d="M168 40q-10 30 4 58M290 46q10 28-4 54" fill="none" stroke="#111" stroke-width="2.5" stroke-linecap="round" opacity=".45"/>
  <path d="M78 432C80 340 100 272 150 264C200 272 220 340 222 432Z" fill="#fff" {SK}/>
  <path d="M106 306H194L204 432H96Z" fill="#111"/>
  <path d="M112 306L134 266M188 306L166 266" stroke="#111" stroke-width="6"/>
  <text x="150" y="360" text-anchor="middle" font-family="Yellowtail, Brush Script MT, cursive" font-size="25" fill="#fff" transform="rotate(-6 150 358)" textLength="78" lengthAdjust="spacingAndGlyphs">Mazzucco</text>
  <path d="M110 377L192 366" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M94 286L66 336L104 362" fill="none" stroke="#111" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M94 286L82 308" stroke="#fff" stroke-width="21" stroke-linecap="round"/>
  <path d="M82 308L66 336L104 362" fill="none" stroke="{SKIN}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M77 300L91 309" stroke="#111" stroke-width="2.5"/>
  <path d="M206 286L240 210L230 122" fill="none" stroke="#111" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M206 286L226 240" stroke="#fff" stroke-width="21" stroke-linecap="round"/>
  <path d="M226 240L240 210L230 122" fill="none" stroke="{SKIN}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M216 235L236 245" stroke="#111" stroke-width="2.5"/>
  <path d="M230 118L229 100" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <path d="M230 117L229.3 101" stroke="{SKIN}" stroke-width="4" stroke-linecap="round"/>
  <g>
    <animateTransform attributeName="transform" type="rotate" from="0 229 70" to="360 229 70" dur="1.4s" repeatCount="indefinite"/>
    <circle cx="229" cy="70" r="44" fill="#D9A15A" {SK}/>
    <circle cx="229" cy="70" r="35" fill="#C2311B"/>
    <circle cx="216" cy="59" r="7" fill="#FBF6EA"/><circle cx="243" cy="61" r="6" fill="#FBF6EA"/><circle cx="237" cy="83" r="7.5" fill="#FBF6EA"/><circle cx="213" cy="80" r="5" fill="#FBF6EA"/><circle cx="229" cy="70" r="5" fill="#FBF6EA"/>
    <ellipse cx="227" cy="52" rx="6" ry="3.2" fill="#2F7A3A" transform="rotate(-25 227 52)"/><ellipse cx="250" cy="76" rx="6" ry="3.2" fill="#2F7A3A" transform="rotate(50 250 76)"/><ellipse cx="221" cy="90" rx="6" ry="3.2" fill="#2F7A3A" transform="rotate(10 221 90)"/>
    <circle cx="207" cy="45" r="2" fill="#7A3A12"/><circle cx="256" cy="54" r="2.4" fill="#7A3A12"/><circle cx="250" cy="100" r="2" fill="#7A3A12"/><circle cx="198" cy="84" r="2.2" fill="#7A3A12"/>
  </g>
  <rect x="136" y="228" width="28" height="42" rx="6" fill="{SKIN}" {SK}/>
  <path d="M124 262H176L150 294Z" fill="#B48D5C" {SK} stroke-linejoin="round"/>
  <circle cx="150" cy="265" r="7" fill="#B48D5C" {SK}/>
  <ellipse cx="110" cy="198" rx="8" ry="12" fill="{SKIN}" {SK}/>
  <ellipse cx="190" cy="198" rx="8" ry="12" fill="{SKIN}" {SK}/>
  <ellipse cx="150" cy="192" rx="40" ry="48" fill="{SKIN}" {SK}/>
  <path d="M112 170q-3 14 1 26M188 170q3 14-1 26" stroke="#111" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M106 166C104 134 128 122 152 122C178 122 198 134 196 160C196 164 194 166 192 168Z" fill="#111"/>
  <path d="M102 164C124 155 178 153 200 162C206 166 202 175 195 175C170 168 130 168 107 175C99 175 96 168 102 164Z" fill="#111"/>
  <path d="M114 158C134 150 168 149 190 156" stroke="#5A5650" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/>
  <path d="M124 181q10-6 20 0M156 181q10-6 20 0" stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <circle cx="134" cy="195" r="12" fill="#fff" fill-opacity=".3" {SK}/>
  <circle cx="166" cy="195" r="12" fill="#fff" fill-opacity=".3" {SK}/>
  <path d="M146 194q4-3 8 0M122 193L112 191M178 193L188 191" stroke="#111" stroke-width="3" fill="none"/>
  <circle cx="135" cy="196" r="3.3" fill="#111"/><circle cx="167" cy="196" r="3.3" fill="#111"/>
  <circle cx="136.2" cy="194.8" r="1" fill="#fff"/><circle cx="168.2" cy="194.8" r="1" fill="#fff"/>
  <path d="M151 202C146 211 144 216 150 218C154 219 157 216 156 213" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/>
  <circle cx="121" cy="215" r="6" fill="#DE9774" opacity=".55"/><circle cx="179" cy="215" r="6" fill="#DE9774" opacity=".55"/>
  <path d="M150 222C140 215 124 217 115 228C113 233 118 235 122 231C130 224 140 228 150 230C160 228 170 224 178 231C182 235 187 233 185 228C176 217 160 215 150 222Z" fill="#111"/>
  <path d="M139 237Q150 247 161 237Z" fill="#7A2E1E" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
</symbol>
</svg>'''

LD = {
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "Person", "@id": SITE + "/#lorenzo", "name": "Lorenzo Mazzucco",
     "jobTitle": "Fondateur et chef traiteur, Mazzucco Events",
     "alumniOf": {"@type": "EducationalOrganization", "name": "École Ferrandi Paris"},
     "description": "Né entre Venise et les Dolomites, Lorenzo Mazzucco travaille dans la restauration depuis plus de trente ans. Il dirige son entreprise de traiteur et d'organisation événementielle depuis 2005 et a créé le concept Mazzucco Mozza & Pizza en 2015 à Paris (7 rue d'Enghien).",
     "worksFor": {"@id": SITE + "/#business"}},
    {"@type": ["FoodEstablishment", "Organization"], "@id": SITE + "/#business",
     "name": "Mazzucco Events", "alternateName": ["Mazzucco", "Mazzucco Mozza & Pizza", "Mazzucco Pizza & Mozza"],
     "legalName": "Monsieur Lorenzo Mazzucco (entrepreneur individuel)",
     "url": SITE + "/", "logo": SITE + "/assets/logo-black.png", "image": SITE + "/assets/logo-round.png",
     "email": "contact@mazzucco.fr", "telephone": "+33618700482",
     "foundingDate": "2005-01-03", "founder": {"@id": SITE + "/#lorenzo"},
     "taxID": "480403211", "vatID": "FR38480403211",
     "servesCuisine": ["Italienne", "Pizza", "Mozzarella"],
     "slogan": "Pizza & mozzarella pour vos événements",
     "description": "Traiteur italien événementiel, concept Mazzucco depuis 2015 : bar à pizza et focaccia cuites sur place, bar à mozzarella di bufala, pâtes fraîches dans la roue de parmesan et bar à tiramisu, pour séminaires, salons, soirées d'entreprise, mariages et réceptions privées. Activité exclusivement traiteur et événementiel.",
     "address": {"@type": "PostalAddress", "streetAddress": "40 B promenade Marx Dormoy", "postalCode": "93460", "addressLocality": "Gournay-sur-Marne", "addressRegion": "Île-de-France", "addressCountry": "FR"},
     "areaServed": [{"@type": "AdministrativeArea", "name": "Île-de-France"}, {"@type": "Country", "name": "France"}],
     "sameAs": ["https://instagram.com/mazzucco_events", "https://www.mazzucco-events.fr/"],
     "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Animations culinaires italiennes", "itemListElement": [
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bar à pizza et focaccia", "description": "Pâte maturée cinq jours, pizzas cuites sur place devant les invités."}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bar à mozzarella", "description": "Mozzarella di bufala Campana nature, fumée ou à la truffe, burrata, antipasti maison."}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Pâtes fraîches dans la roue de parmesan"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bar à tiramisu"}}]}},
    {"@type": "FAQPage", "mainEntity": [
      {"@type": "Question", "name": "Qui est derrière Mazzucco Events ?", "acceptedAnswer": {"@type": "Answer", "text": "Lorenzo Mazzucco, restaurateur italien formé à l'École Ferrandi, à la tête de son entreprise de traiteur et d'organisation événementielle depuis 2005. Il gère chaque événement lui-même, du devis au service."}},
      {"@type": "Question", "name": "Depuis quand existe le concept Mazzucco ?", "acceptedAnswer": {"@type": "Answer", "text": "Depuis 2015. Lorenzo a lancé le concept Mazzucco Mozza & Pizza au 7 rue d'Enghien, à Paris, salué par Time Out, Le Bonbon et le Petit Futé. Aujourd'hui, Mazzucco se consacre uniquement au traiteur et à l'événementiel."}},
      {"@type": "Question", "name": "Où intervient Mazzucco Events ?", "acceptedAnswer": {"@type": "Answer", "text": "Basé en Île-de-France, Mazzucco Events intervient à Paris, dans toute l'Île-de-France et partout en France."}},
      {"@type": "Question", "name": "Les produits viennent-ils d'Italie ?", "acceptedAnswer": {"@type": "Answer", "text": "Oui. Mozzarella di bufala de Campanie, burrata des Pouilles, jambon de Parme 16 mois, Parmigiano Reggiano, olives de Gaeta, 'nduja de Calabre, speck et scamorza. Les antipasti, la pâte et les desserts sont faits maison."}},
      {"@type": "Question", "name": "Travaillez-vous avec les agences et les traiteurs ?", "acceptedAnswer": {"@type": "Answer", "text": "Oui, Mazzucco Events intervient aux côtés de traiteurs et d'agences événementielles, y compris en marque blanche."}}]}
  ]
}
LD_DEVIS = {"@context": "https://schema.org", "@type": "WebPage", "name": "Configurateur de devis Mazzucco Events",
            "url": SITE + "/devis.html", "isPartOf": {"@type": "WebSite", "name": "Mazzucco Events", "url": SITE + "/"},
            "about": {"@id": SITE + "/#business"}}

def ld(obj): return '<script type="application/ld+json">\n' + json.dumps(obj, ensure_ascii=False, indent=1) + '\n</script>'

def body(name, active):
    b = open(os.path.join(ROOT, name)).read()
    return (LORENZO + "\n" + b.replace("{{HEADER}}", header(active)).replace("{{CONTACT}}", CONTACT)
            + "\n" + FOOTER + "\n" + WA + "\n" + RADIO)

PAGES = {
  "index.html": dict(
    title="Mazzucco Events",
    desc="Mazzucco Events : traiteur italien événementiel de Lorenzo Mazzucco. Concept Mazzucco depuis 2015, entreprise depuis 2005. Bars à pizza, mozzarella, pâtes fraîches et tiramisu pour vos événements à Paris, en Île-de-France et partout en France.",
    path="", ld=LD, body=lambda: body("index.body.html", "home"), scripts=["site.js"]),
  "devis.html": dict(
    title="Devis Mazzucco Events",
    desc="Composez votre événement italien avec Lorenzo : occasion, nombre d'invités, animations pizza, mozzarella, pâtes et tiramisu. Estimation des quantités et demande de devis en un clic.",
    path="devis.html", ld=LD_DEVIS, body=lambda: body("devis.body.html", "devis"), scripts=["site.js", "devis.js"]),
}

def full(meta, inner):
    return ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + meta + '\n</head>\n<body>\n' + inner + '\n</body>\n</html>\n')

def build():
    for target in ("artifact", "deploy"):
        out = os.path.join(ROOT, "out", target)
        shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
        shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(out, "assets"))
        for f in ("style.css", "site.js", "devis.js"): shutil.copy(os.path.join(ROOT, f), out)
        for name, p in PAGES.items():
            meta = head(p["title"], p["desc"], p["path"]) + "\n" + ld(p["ld"])
            scripts = "\n".join(f'<script src="{s}"></script>' for s in p["scripts"])
            inner = p["body"]() + "\n" + scripts
            if target == "artifact" and name == "index.html":
                html = meta + "\n" + inner + "\n"
            else:
                html = full(meta.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '') if target == "deploy" else meta, inner)
            open(os.path.join(out, name), "w").write(html)
        if target == "deploy":
            open(os.path.join(out, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
            open(os.path.join(out, "sitemap.xml"), "w").write(
                '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                f'  <url><loc>{SITE}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n'
                f'  <url><loc>{SITE}/devis.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>\n')
            open(os.path.join(out, "llms.txt"), "w").write(f"""# Mazzucco Events

> Traiteur italien événementiel fondé par Lorenzo Mazzucco. Entreprise créée en 2005 (SIREN 480 403 211, NAF 5621Z), concept Mazzucco Mozza & Pizza depuis 2015. Activité exclusivement traiteur et événementiel, au départ de l'Île-de-France et partout en France.

## Faits clés
- Fondateur : Lorenzo Mazzucco, né entre Venise et les Dolomites, diplômé de l'École Ferrandi Paris, plus de 30 ans de métier.
- 2015 : lancement du concept Mazzucco Mozza & Pizza au 7 rue d'Enghien, Paris 10e (cité par Time Out, Le Bonbon, Petit Futé, Sortir à Paris).
- Aujourd'hui : animations culinaires italiennes pour entreprises, agences, traiteurs et particuliers.
- Animations : bar à pizza et focaccia (pâte maturée 5 jours, cuisson sur place), bar à mozzarella di bufala Campana et burrata, pâtes fraîches dans la roue de Parmigiano Reggiano, bar à tiramisu.
- Produits italiens : bufala de Campanie, burrata des Pouilles, jambon de Parme 16 mois, olives de Gaeta, 'nduja de Calabre, speck et scamorza.
- Références : SNCF, Potel & Chabot, Audi France, Traiteur T, Les Camionneuses.
- Contact : contact@mazzucco.fr · lorenzo@mazzucco.fr · +33 6 18 70 04 82 · Instagram @mazzucco_events

## Pages
- [Accueil]({SITE}/): présentation, animations, produits, catalogues, presse, FAQ
- [Devis]({SITE}/devis.html): configurateur de devis
""")

if __name__ == "__main__":
    build(); print("built")
