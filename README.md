# React + TypeScript + Vite

# 🧼 LuxLather – Frontend

LuxLather is a modern eCommerce platform for liquid soaps and scented oils.  
This is the **frontend** built with **Vite**, **React**, and **TypeScript**.

It supports:
- 🛍️ Product catalog & details
- 🛒 Cart and checkout flow
- 🧑‍💼 Admin dashboard for managing products (CRUD)
- 💨 Fast performance with Vite
- 🎨 Styled using Tailwind CSS (optional)

---

## 🛠 Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PNPM](https://pnpm.io/) (preferred package manager)
- Zustand or Redux (state management)
- Tailwind CSS (optional)

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
pnpm install
```
You can also use npm install or yarn if you prefer.

### 2. Set up environment variables
```bash
cp .env.example .env
Set your API URL:
```bash
VITE_API_URL=https://luxlather-backend.onrender.com/api
```
### 3. Run the development server 
```bash
pnpm dev
```
Open http://localhost:5173 in your browser.

## 🧱 Build & Preview
```bash
pnpm build       # builds the app for production
pnpm preview     # locally preview the production build
```
## 🌍 Deployment
This app is fully static after build(/dist folder)
You can deploy to:
- Netfly
- Vercel
- Cloudflare Pages
- S3 + CloudFront
- Docker(if neeed)

## 📁 Project Structure
```bash
luxlather-frontend/
├── public/              # Static assets
├── src/                 # React app code
├── index.html           # Main HTML template
├── vite.config.ts       # Vite config
├── tsconfig.json        # TypeScript config
├── .env.example         # Example env vars
```
---
## 🧼 About the Project
LuxLather is designed for simplicity, speed, and real-world functionality.
This frontend pairs with the LuxLather backend for full eCommerce functionality including:
- JWT-based authentication
- Image uploads (Cloudinary or similar)
- Admin dashboard with secure routes

## 👩🏾‍💻 Author
Made by [Rachel Kibirigi](https://github.com/RachelBlackmermaid)
