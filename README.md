# flux-rss-framework — Étape 1/3 : Collecte

Agrégateur de flux RSS serverless qui centralise **29 sources** (blogs, releases GitHub, newsletters) en un seul fichier `feed.xml`, mis à jour toutes les heures via GitHub Actions et hébergé sur GitHub Pages.

## Pipeline global

```
[1] flux-rss-framework  →  feed.xml         (GitHub Pages)
         ↓
[2] flux-rss-enricher   →  feed-enriched.json (GitHub Pages)
         ↓
[3] flux-rss-site       →  Site de veille   (Vercel)
```

Ce dépôt est la **première étape** : il produit le `feed.xml` brut consommé par l'enrichisseur.

## Fonctionnement

1. **`aggregate.js`** — Récupère les articles de toutes les sources listées dans `feeds.json`, les trie par date et génère `public/feed.xml`.
2. **GitHub Actions** — Exécute ce script automatiquement **toutes les heures** (`cron: 0 * * * *`).
3. **GitHub Pages** — Héberge le fichier XML sur la branche `gh-pages`.

## Installation & usage local

```bash
# Installer les dépendances
npm install

# Lancer l'agrégation (génère public/feed.xml)
npm run build
```

## Configuration

### Sources (`feeds.json`)

Pour ajouter ou supprimer des sources, modifiez `feeds.json` :

```json
[
  "https://astro.build/rss.xml",
  "https://react.dev/rss.xml",
  ...
]
```

### Variables d'environnement (optionnel)

| Variable | Défaut | Description |
|---|---|---|
| `ITEMS_PER_SOURCE` | `5` | Nombre maximum d'articles récupérés par source |
| `MAX_TOTAL_ITEMS` | `100` | Nombre maximum d'articles dans le feed final |

```bash
ITEMS_PER_SOURCE=10 MAX_TOTAL_ITEMS=200 npm run build
```

## Déploiement

1. Héberger ce code sur un dépôt GitHub public.
2. Aller dans **Settings > Pages** et activer GitHub Pages sur la branche `gh-pages` (créée automatiquement par l'action).
3. L'action se déclenche automatiquement toutes les heures et à chaque push sur `main`.

**URL du feed produit :**
```
https://powlair.github.io/flux-rss-framework/feed.xml
```

## Stack technique

| Outil | Rôle |
|---|---|
| Node.js 20 | Runtime |
| `rss-parser` | Lecture des feeds sources |
| `rss` | Génération du feed XML de sortie |
| GitHub Actions | Exécution horaire |
| GitHub Pages | Hébergement du `feed.xml` |

## Projets liés

| Étape | Dépôt | Rôle |
|---|---|---|
| 2 | [flux-rss-enricher](https://github.com/POWLAIR/flux-rss-enricher) | Enrichit `feed.xml` → `feed-enriched.json` |
| 3 | [flux-rss-site](https://github.com/POWLAIR/flux-rss-site) | Site de veille qui affiche le feed enrichi |
