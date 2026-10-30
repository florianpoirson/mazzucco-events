# Mazzucco Events — site vitrine

Site de Mazzucco Events, traiteur italien événementiel de Lorenzo Mazzucco (entreprise depuis 2005, concept Mazzucco depuis 2015).

## Contenu du dépôt

| Dossier | Rôle |
|---|---|
| `docs/` | Le site en ligne, servi tel quel par GitHub Pages (accueil `index.html`, page devis `devis.html`, styles, scripts, images, `robots.txt`, `sitemap.xml`, `llms.txt`). |
| `source/` | Les fichiers de travail : textes des pages (`index.body.html`, `devis.body.html`), éléments communs et script de construction (`build.py`). |

## Modifier le site

1. Modifier les textes dans `source/index.body.html` ou `source/devis.body.html`, les styles dans `source/style.css`, les éléments communs (en-tête, pied de page, contact, personnage Lorenzo, radio) dans `source/build.py`.
2. Reconstruire : `cd source && python3 build.py`
3. Copier le résultat dans `docs/` : `cp -r source/out/deploy/. docs/`

## Radio Mazzucco

Par défaut, le poste joue une tarentelle originale synthétisée dans le navigateur (sans droits à payer). Pour diffuser un flux en direct sous licence (droits SACEM/SCPP couverts), coller son adresse dans `RADIO_STREAM` en haut de la section radio de `site.js`.

## Mise en ligne et nom de domaine

1. GitHub : Settings → Pages → Source « Deploy from a branch », branche `main`, dossier `/docs`.
2. Une fois `mazzucco.fr` acquis : ajouter le domaine dans Settings → Pages → Custom domain (crée le fichier `docs/CNAME`), puis chez le registrar :
   - enregistrements `A` de `mazzucco.fr` vers 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` de `www` vers `florianpoirson.github.io`
3. Cocher « Enforce HTTPS » une fois le certificat émis.
4. Rediriger `mazzucco.com` et `mazzucco-events.fr` vers `https://www.mazzucco.fr` (redirection 301 chez le registrar).

## À valider avec Lorenzo avant la mise en ligne

- Accord des clients cités (SNCF, Potel & Chabot, Audi France, Traiteur T, Les Camionneuses)
- Provenances des produits, mention AOP éventuelle
- Délai « catalogue sous 24 h ouvrées »
- Tarifs pour les catalogues, photos d'événements, logo vectoriel
- Flux radio sous licence (facultatif)
