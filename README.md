# RSS Aggregator Framework 🚀

Un agrégateur de flux RSS "Serverless" conçu pour centraliser votre veille technologique.

Ce projet agrège automatiquement une liste de flux RSS (blogs, releases GitHub, news) en un **seul fichier XML unique**. Idéal pour simplifier vos pipelines d'automatisation (Make, Integromat, n8n) ou votre lecteur de flux.

## Fonctionnement

1.  **Script Node.js** : Récupère les articles de tous les flux listés dans `feeds.json`, les trie par date et génère un fichier `public/feed.xml`.
2.  **GitHub Actions** : Exécute ce script automatiquement **toutes les heures**.
3.  **GitHub Pages** : Héberge le fichier XML généré pour qu'il soit accessible publiquement.

## Installation & Utilisation locale

```bash
# Installer les dépendances
npm install

# Lancer l'agrégation manuellement (génère public/feed.xml)
npm run build
```

## Configuration

Pour ajouter ou supprimer des sources, modifiez simplement le fichier `feeds.json` à la racine :

```json
[
  "https://astro.build/rss.xml",
  "https://blog.angular.dev/feed",
  ...
]
```

## Déploiement & URL du flux

1.  Hébergez ce code sur un repository GitHub.
2.  L'action s'activera automatiquement (toutes les heures + au push).
3.  Allez dans **Settings > Pages** de votre repo et activez GitHub Pages sur la branche `gh-pages` (qui sera créée automatiquement par l'action).

Votre flux unique sera accessible ici :
> `https://<VOTRE_PSEUDO>.github.io/<NOM_DU_REPO>/feed.xml`

## Stack technique

-   **Runtime** : Node.js
-   **Libs** : `rss-parser` (lecture), `rss` (écriture)
-   **CI/CD** : GitHub Actions
