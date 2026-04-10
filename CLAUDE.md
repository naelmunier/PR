# CLAUDE.md — PR Logistics Website

## Présentation du projet

Site vitrine pour la société **PR Logistics**, construit avec **Astro**.  
L'objectif est un site moderne, minimaliste et élégant, inspiré du design Apple : épuré, avec de belles animations, des images aux coins arrondis et une typographie soignée.

---

## Stack technique

- **Framework** : [Astro](https://astro.build/) (SSG / SSR selon besoin)
- **Styling** : TailwindCSS (à confirmer) ou CSS custom avec variables
- **Animations** : CSS transitions + potentiellement GSAP ou Framer Motion
- **Déploiement** : GitHub → (à définir : Vercel / Netlify / autre)
- **Repo GitHub** : `PR` (repository dédié au site PR Logistics)

---

## Philosophie de design

Inspiré du design Apple :

- **Minimaliste** : beaucoup d'espace blanc, pas de surcharge visuelle
- **Propre** : typographie grande et lisible, hiérarchie claire
- **Images arrondies** : `border-radius` généreux sur toutes les illustrations/photos
- **Animations fluides** : transitions douces au scroll (fade-in, slide-up), pas d'effets agressifs
- **Couleurs** : palette sobre (blanc, noir, gris clair, une couleur d'accent à définir)
- **Typographie** : sans-serif moderne (ex. Inter, SF Pro-like, ou similaire Google Fonts)

> Le style précis (couleurs, polices, sections) sera affiné au fil des échanges.

---

## Structure du projet Astro

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/       # Composants réutilisables (Header, Footer, Card, etc.)
│   ├── layouts/          # Layouts Astro (MainLayout.astro)
│   ├── pages/            # Pages du site (index.astro, about.astro, etc.)
│   ├── styles/           # CSS global, variables, animations
│   └── assets/           # Images, icônes
├── astro.config.mjs
├── package.json
└── CLAUDE.md
```

---

## Pages prévues

> À compléter selon les besoins de PR Logistics.

- `/` — Page d'accueil (hero, services, valeurs, CTA)
- `/services` — Détail des services logistiques
- `/a-propos` — Présentation de l'entreprise
- `/contact` — Formulaire de contact

---

## Conventions de code

- Langue des commentaires : **français**
- Composants Astro nommés en **PascalCase** (`HeroSection.astro`)
- Classes CSS : **kebab-case** ou utilitaires Tailwind
- Commits Git : en **français**, clairs et descriptifs  
  ex. `feat: ajout section hero`, `fix: correction menu mobile`
- Pas de `console.log` en production
- Accessibilité : attributs `alt` sur toutes les images, structure sémantique HTML5

---

## Workflow Git

```bash
# Cloner le repo
git clone https://github.com/<username>/PR.git
cd PR

# Installer les dépendances
npm install

# Lancer en dev
npm run dev

# Build
npm run build
```

Branches :
- `main` — production
- `dev` — développement actif
- `feature/<nom>` — nouvelles fonctionnalités

---

## Notes pour Claude Code

- Toujours vérifier la cohérence du design avec la charte Apple-like avant d'ajouter un composant
- Préférer les animations CSS natives avant d'introduire une librairie externe
- Demander confirmation avant de modifier la structure des pages existantes
- Le style et le design seront guidés progressivement par l'utilisateur — ne pas anticiper des choix non confirmés
- Les images doivent systématiquement avoir `border-radius` arrondi (minimum `1rem`)
