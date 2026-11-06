# 🚀 Sagar Singh Portfolio — Standalone Render Backend & Database

This `backend/` folder contains the **complete, self-contained Express & MySQL API backend** with real-time SSE notifications, brute-force rate limiting, and automated migrations.

You can directly deploy this folder on **Render** (Render.com) in under 3 minutes!

---

## 🏛️ What's Inside This Backend Folder

```
backend/
├── server.ts             # Express REST & SSE streaming server
├── rateLimiter.ts        # In-memory brute-force protection (HTTP 429)
├── package.json          # Standalone backend dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── render.yaml           # Render 1-click blueprint specification
├── .env.example          # Environment variables template
└── database/             # Complete MySQL Database Layer
    ├── connection.ts     # MySQL2 connection pool with SSL & auto-reconnect
    ├── auth.ts           # PBKDF2 SHA-512 hashing (100,000 rounds)
    ├── migrator.ts       # Automated startup schema migrator
    ├── cli.ts            # CLI tools (migrate, seed, status)
    ├── types.ts          # Self-contained database interfaces
    ├── services/         # Relational database services
    │   ├── adminService.ts
    │   ├── profileService.ts
    │   ├── projectService.ts
    │   ├── skillService.ts
    │   ├── educationService.ts
    │   ├── achievementService.ts
    │   ├── technologyService.ts
    │   └── messageService.ts
    ├── migrations/       # SQL migration scripts (auto-run on startup)
    ├── schema/           # Base DDL schema files
    └── seeds/            # Initial dataset seed files
```

---

## 🗄️ Step 1: Get a 100% Free Cloud MySQL Database

Render provides free Node.js hosting, but does not provide managed MySQL directly. You can use any of these **100% free Cloud MySQL providers**:

### Option A: Aiven Cloud MySQL (Recommended — Free Tier)
1. Go to [https://aiven.io](https://aiven.io) and sign up for a free account.
2. Click **Create Service** → select **MySQL** → choose the **Free Plan**.
3. Once active, copy the **Host**, **Port**, **User**, **Password**, and **Database name** (or the complete Service URI).

### Option B: TiDB Cloud Serverless (Free Forever)
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and create a free account.
2. Create a free **Serverless Cluster** (compatible with MySQL 8.0).
3. Under **Connect**, copy your Host, User, and Password.

---

## ☁️ Step 2: Deploy Backend to Render.com

1. Push your repository to **GitHub** (or push just the `backend` folder as its own repo).
2. Go to [https://dashboard.render.com](https://dashboard.render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the deployment settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `sagar-portfolio-backend` |
| **Region** | `Oregon (US West)` or `Frankfurt (EU)` |
| **Root Directory** | `backend` *(Leave blank if you deployed only the backend folder)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

---

## 🔑 Step 3: Add Environment Variables in Render Dashboard

In the **Environment** tab of your Render Web Service, add the following variables:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `MYSQL_HOST` | `mysql-xxxx.aivencloud.com` | Cloud MySQL hostname |
| `MYSQL_PORT` | `3306` (or provided port) | Cloud MySQL port |
| `MYSQL_USER` | `avnadmin` | Cloud MySQL username |
| `MYSQL_PASSWORD` | `your_mysql_password` | Cloud MySQL password |
| `MYSQL_DATABASE` | `defaultdb` | Cloud MySQL database name |
| `MYSQL_SSL` | `true` | Required for Cloud MySQL SSL |
| `JWT_SECRET` | `a_random_32_character_secret_string` | Secret key for signing admin tokens |
| `GEMINI_API_KEY` | *(Your Gemini API key)* | Optional for AI Assistant chat |

> 💡 **Shortcut**: If your cloud provider gives a full connection URI, you can simply set `MYSQL_URL=mysql://user:pass@host:port/database` instead of individual host/port/user variables!

---

## ⚡ Step 4: Automated Verification

When Render starts your backend:
1. `backend/server.ts` automatically runs `runMigrations()` on startup.
2. All tables (`admin_users`, `projects`, `skills`, `profile`, `education`, `achievements`, `contact_inquiries`, `subscribers`) and seed records are created in your cloud database automatically!
3. Render displays:
   ```
   ✅ [Startup] All database migrations are up to date.
   🚀 Render Backend API Live on Port: 10000
   📡 Health Check URL: http://0.0.0.0:10000/
   ```
4. Test your backend live in your browser:
   - `https://your-backend.onrender.com/` → Returns JSON API health status
   - `https://your-backend.onrender.com/api/profile` → Returns Sagar's profile data
   - `https://your-backend.onrender.com/api/skills` → Returns technical skills

---

## 🔗 Step 5: Connect Your Frontend to This Render Backend

In your frontend application (on Vercel, Netlify, Render, or Embarko):
Set the environment variable:
```env
VITE_API_URL=https://sagar-portfolio-backend.onrender.com/api
```
All API requests, contact inquiries, admin authentication, and real-time alerts will communicate seamlessly with your Render backend!

