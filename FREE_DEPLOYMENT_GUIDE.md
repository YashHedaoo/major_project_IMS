# Ultimate Free Deployment Guide (Step-by-Step)

This guide will walk you through exactly how to host your entire Institute Management System for **$0.00**. 

---

## Step 1: Set Up Your Free Database (Neon.tech)
Since you are using PostgreSQL, we'll use Neon for a free cloud database.

1.  Go to [Neon.tech](https://neon.tech/) and click **Sign Up**.
2.  Log in with your GitHub account.
3.  Click **Create a Project**.
    *   **Name**: `ims-database`
    *   **Postgres Version**: 16 (or whatever is default)
    *   **Region**: Choose the one closest to you (e.g., Singapore or Mumbai if in India).
4.  Click **Create Project**.
5.  On the dashboard, you will see a box that says **Connection Details**.
6.  Look for the **Connection string** (it will look like `postgresql://admin:password@ep-cool-butterfly...`).
7.  **COPY THIS STRING** and paste it somewhere safe. You need it for the next step.

---

## Step 2: Deploy Your Backend (Render.com)
Your Node.js/Express backend needs to be running constantly. Render offers a free tier for this.

1.  Go to [Render.com](https://render.com/) and **Sign Up** using GitHub.
2.  On your Dashboard, click **New +** and select **Web Service**.
3.  Choose **Build and deploy from a Git repository**.
4.  Connect your GitHub account if asked, and select your repository: `YashHedaoo/major_project_IMS`.
5.  Fill in the configuration details exactly like this:
    *   **Name**: `ims-backend`
    *   **Region**: (Choose one close to you)
    *   **Branch**: `main`
    *   **Root Directory**: `backend` *(Crucial!)*
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  Scroll down to **Environment Variables** and add the following:
    *   Key: `DB_URL` | Value: *(Paste your connection string from Neon.tech here)*
    *   Key: `JWT_SECRET` | Value: `supersecretkey123` (or any random string)
    *   Key: `PORT` | Value: `5001`
7.  Select the **Free** instance type at the bottom.
8.  Click **Create Web Service**.
9.  Wait 2-3 minutes. When you see "✓ Live", look at the top left of the screen under your project name for the URL (e.g., `https://ims-backend-1a2b.onrender.com`).
10. **COPY THIS URL**.

---

## Step 3: Configure Frontend Settings Before Deploying
Before deploying the frontend, we must tell it where the backend lives.
1. In your local VS Code, open the file `frontend/src/context/AuthContext.jsx`.
2. Look for line 21 (or similar) where it says:
   `fetch('http://localhost:5001/api/auth/login')`
3. Change `http://localhost:5001` to use an environment variable so Vercel can inject it. It should ideally look like:
   `fetch(`${import.meta.env.VITE_API_URL}/auth/login`)`
   *(Note: This requires a code change which I can help you with if needed. Alternatively, you can just hardcode the Render URL here for now, but environment variables are better).*

---

## Step 4: Deploy Your Frontend (Vercel)
Vercel is perfect for your React (Vite) frontend.

1.  Go to [Vercel.com](https://vercel.com/) and **Sign Up** using GitHub.
2.  Click **Add New** -> **Project**.
3.  Find your repository `YashHedaoo/major_project_IMS` and click **Import**.
4.  Configure the project:
    *   **Project Name**: `institute-management`
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and type `frontend` *(Crucial!)*
5.  Click the **Environment Variables** section to expand it. Add:
    *   **Name**: `VITE_API_URL`
    *   **Value**: *(Paste your copied Render URL here, e.g., `https://ims-backend-1a2b.onrender.com/api`)*
6.  Click **Deploy**.
7.  Wait 1-2 minutes for the build to finish.
8.  You will get confetti and a live `.vercel.app` link. 

Your whole application is now live on the internet! 

Let me know if you want me to write the quick code patch for `AuthContext.jsx` (from Step 3) before you start clicking through the websites!
