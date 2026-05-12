# ETDV Église — Application Web

Application React + Node.js/Express pour l'église ETDV.  
**Frontend** → hébergé sur **Vercel**  
**Backend** → hébergé sur **Render**  
**Base de données** → **PostgreSQL** (Render Managed DB)  
**Médias** → **Cloudinary**

---

## Structure du projet

```
ETDV-Eglise/
├── frontend/          ← React + Vite + TailwindCSS + DaisyUI  (→ Vercel)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx  ← Auth connectée à l'API réelle
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.example
│   └── vercel.json
│
└── backend/           ← Express + PostgreSQL + Cloudinary  (→ Render)
    ├── config/
    │   ├── db.js           ← Pool PostgreSQL
    │   ├── cloudinary.js   ← Upload médias
    │   └── migrate.js      ← Création des tables
    ├── middleware/
    │   └── auth.js         ← Vérification JWT
    ├── routes/
    │   ├── auth.js         ← Login, register, users
    │   ├── posts.js        ← Messages, news, versets
    │   ├── media.js        ← Photos, vidéos, audio
    │   ├── programs.js     ← Programmes hebdo/mensuel/annuel
    │   ├── visitors.js     ← Visiteurs communauté
    │   ├── contact.js      ← Formulaire de contact
    │   └── stats.js        ← Statistiques dashboard
    ├── .env.example
    └── server.js
```

---

## 1. Prérequis — Comptes à créer

| Service | Gratuit | Lien |
|---------|---------|------|
| Render | ✅ (750h/mois) | https://render.com |
| Vercel | ✅ | https://vercel.com |
| Cloudinary | ✅ (25GB) | https://cloudinary.com |

---

## 2. Base de données PostgreSQL sur Render

1. Render Dashboard → **New** → **PostgreSQL**
2. Nom: `etdv-eglise-db`, Plan: **Free**
3. Copiez l'**Internal Database URL** (pour le backend) ou **External URL** (pour migrer depuis votre PC)
4. Créez un fichier `backend/.env` en copiant `.env.example` et remplissez `DATABASE_URL`

### Créer les tables
```bash
cd backend
npm install
npm run db:migrate
```

---

## 3. Backend sur Render

1. Render Dashboard → **New** → **Web Service**
2. Connectez votre dépôt GitHub
3. Configurez:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Ajoutez les **Environment Variables** (depuis votre `.env`):
   - `DATABASE_URL` → URL interne PostgreSQL Render
   - `JWT_SECRET` → votre secret (générez avec `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `ALLOWED_ORIGINS` → `https://votre-app.vercel.app`
   - `NODE_ENV` → `production`

5. Après déploiement, notez l'URL: `https://etdv-eglise-backend.onrender.com`

---

## 4. Frontend sur Vercel

1. Vercel Dashboard → **New Project** → importez votre dépôt
2. **Root Directory**: `frontend`
3. Framework: **Vite** (détecté automatiquement)
4. Ajoutez la variable d'environnement:
   - `VITE_API_URL` = `https://etdv-eglise-backend.onrender.com`
5. Déployez !

---

## 5. Développement local

### Backend
```bash
cd backend
cp .env.example .env    # remplissez les valeurs
npm install
npm run db:migrate      # première fois seulement
npm run dev             # nodemon - port 5000
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# VITE_API_URL=http://localhost:5000
npm install
npm run dev             # Vite - port 5173
```

---

## API Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/login` | ❌ | Connexion |
| GET | `/api/auth/me` | ✅ | Profil connecté |
| GET | `/api/auth/users` | ✅ | Liste des admins |
| POST | `/api/auth/register` | ✅ | Créer un admin |
| GET | `/api/posts` | ❌ | Tous les posts |
| POST | `/api/posts` | ✅ | Créer un post |
| PUT | `/api/posts/:id` | ✅ | Modifier un post |
| DELETE | `/api/posts/:id` | ✅ | Supprimer un post |
| GET | `/api/media` | ❌ | Tous les médias |
| POST | `/api/media/upload` | ✅ | Upload media (Cloudinary) |
| DELETE | `/api/media/:id` | ✅ | Supprimer média |
| GET | `/api/programs` | ❌ | Tous les programmes |
| POST | `/api/programs` | ✅ | Créer programme |
| GET | `/api/visitors` | ✅ | Liste visiteurs |
| POST | `/api/visitors` | ❌ | Enregistrer visite |
| POST | `/api/contact` | ❌ | Formulaire contact |
| GET | `/api/stats` | ✅ | Stats dashboard |
| GET | `/api/health` | ❌ | Santé du serveur |

---

## Compte admin par défaut

Après migration: **admin / Admin123!**  
⚠️ Changez le mot de passe dès la première connexion !

---

## Fichiers supprimés (inutiles)

- `backend/` (racine) → doublon du vrai backend
- `backend/server/` → doublon
- `frontend/backend/` → backend SQLite remplacé par PostgreSQL
- `frontend/api/contact.js` → remplacé par route `/api/contact`
- `backend/uploads/` → remplacé par Cloudinary
- `backend/db.json` → était pour json-server
- Tous les `node_modules/`
