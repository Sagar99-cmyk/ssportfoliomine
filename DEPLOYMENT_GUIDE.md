# 🚀 Deployment Guide: Sagar Singh Portfolio & Admin System

This project is fully structured for two-tier cloud deployment:
1. **Backend & MySQL Database** → Hosted on **[Render.com](https://render.com)**
2. **Frontend Portfolio** → Hosted on **[Embarko](https://embarko.app)** (or Vercel / Netlify)

---

## 📦 Step 1: Push Code to GitHub

Git and GitHub CLI (`gh`) are installed and your project is committed to the `main` branch.

### To push your repository to GitHub:
Run in your PowerShell or terminal:

```powershell
gh auth login
```
*(Select **GitHub.com** → **HTTPS** → Log in with a web browser → Enter the one-time code shown in terminal)*

Then create and push to **Myportfolio**:
```powershell
gh repo create Myportfolio --public --source=. --remote=origin --push
```
Your repository will be live at `https://github.com/<your-username>/Myportfolio`.

---

## 🐬 Step 2: Deploy Backend to Render

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and sign in.
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect your GitHub repository **`Myportfolio`**.
4. Render will automatically read [`render.yaml`](./render.yaml) and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check**: `/api/health`
5. In **Environment Variables**, provide your live credentials:
   - `MYSQL_HOST`: Your cloud MySQL host (e.g. Aiven, Railway, PlanetScale, or Render MySQL)
   - `MYSQL_PORT`: `3306`
   - `MYSQL_USER`: Your MySQL username
   - `MYSQL_PASSWORD`: Your MySQL password
   - `MYSQL_DATABASE`: Your database name
   - `JWT_SECRET`: Random secure string (generated automatically)
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SARVAM_API_KEY`: Your Sarvam AI key
   - `SMTP_USER`: `sirroshan999@gmail.com`
   - `SMTP_PASS`: Your 16-character Gmail App Password
6. Click **Apply / Deploy**.
7. Once deployed, Render will provide your public backend URL, e.g.:
   `https://ssportfoliomine.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Embarko

1. Go to **Embarko** and connect your GitHub repository **`ssportfoliomine`**.
2. Set configuration:
   - **Framework Preset**: Vite / React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Environment Variables**, add:
   ```env
   VITE_API_URL=https://ssportfoliomine.onrender.com
   ```
4. Click **Deploy**!

---

## 🔗 How Frontend & Backend Connect Seamlessly

In [`src/services/api.ts`](./src/services/api.ts), `getBaseUrl()` automatically:
- Connects to `http://localhost:3000/api` when tested locally on your machine.
- Reads `import.meta.env.VITE_API_URL` in production (e.g., on Embarko).
- Automatically falls back to `https://ssportfoliomine.onrender.com/api` for smooth online API & SSE stream calls.

