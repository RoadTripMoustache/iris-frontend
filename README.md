# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Iris Front

Application Nuxt pour gérer des idées avec authentification Firebase (email/mot de passe et Google).

## Configuration

Définissez les variables d'environnement (par exemple via un fichier .env.local) :

- NUXT_PUBLIC_API_BASE_URL (ex: http://localhost:8080)
- NUXT_PUBLIC_FIREBASE_API_KEY
- NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NUXT_PUBLIC_FIREBASE_PROJECT_ID
- NUXT_PUBLIC_FIREBASE_APP_ID
- NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

Côté Firebase, pour l'admin, ajoutez une custom claim `admin: true` aux utilisateurs administrateurs.

## Démarrage

- `npm install`
- `npm run dev` (appli sur http://localhost:3002)

## Fonctionnalités

- Connexion par email/mot de passe et Google
- Liste des idées avec recherche, tri (date ou votes), et chargement infini
- Vote/Retrait de vote
- Détail d'une idée, commentaires (ajout/modification/suppression)
- Création d'idée
- Admin: ouvrir/fermer une idée

Palette moderne et claire, menu fixe en haut avec logo.

---
- Permettre à l'utilisateur ayant ouvert l'idée de retirer des images ou de les retirer lors de la création de l'idée (et de la supprimer côté serveur)
- Lors de la création d'une idée, ne pas avoir la liste des urls affichées pour les images, mais les images en miniature
- Test sur docker pour vérifier le changement de langue
- Tester l'ouverture/fermeture d'une idée
- Tester le chargement de plusieurs pages
- Implémenter récupération des configurations du backend