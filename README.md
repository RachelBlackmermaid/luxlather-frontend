# 🧼 LuxLather – Frontend

**LuxLather** is a modern eCommerce web app for artisanal liquid soaps and scented oils.  
This is the **frontend** built using **Vite**, **React**, and **TypeScript**, and it's optimized for performance, scalability, and developer experience.

**Live Site**: [luxlather.store](https://luxlather.store)

---

## ✨ Features

- 🛍️ Product listing with responsive detail pages  
- 🛒 Full cart + checkout flow with quantity selector and state persistence  
- 💳 Stripe-powered payment integration with success page and email confirmation  
- 🔐 JWT-based authentication and admin-only dashboard  
- 🧑‍💼 Admin dashboard for product CRUD, image upload via Cloudinary, and UX enhancements (scroll position, toast feedback, icons)  
- 🧪 Form validation with **Zod**, global state with **Zustand**  
- ⚡ Built with **Vite** for lightning-fast development & builds  
- 🎨 Styled with **Tailwind CSS** and modern UI patterns  

---

## 🛠 Tech Stack

| Tech                | Purpose                              |
|---------------------|---------------------------------------|
| [Vite](https://vitejs.dev/)              | Build tool for fast DX         |
| [React](https://react.dev/)             | UI Library                     |
| [TypeScript](https://typescriptlang.org/) | Type-safe development          |
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management   |
| [Zod](https://zod.dev/)                 | Type-safe schema validation    |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling          |
| [Cloudinary](https://cloudinary.com/)   | Image uploads in Admin UI      |
| [Stripe](https://stripe.com/)           | Secure payment processing      |
| [PNPM](https://pnpm.io/)                | Preferred package manager      |

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
pnpm install
```

### 2.Set up environment variables
```bash
cp .env.example .env
```
Edit .env 
```bash
VITE_API_URL=https://luxlather-backend.onrender.com/api
```
### 3. Start development server
```bash
pnpm dev
```
Then open: http://localhost:5173
---
## 🧱 Build & Preview
```bash
pnpm build     # Builds for production
pnpm preview   # Previews the built app
```
---
## 🌍 Deployment
The frontend is fully static after build (/dist). Deployable to:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Docker (for containerized deployments)

---
## 📁 Project Structure
```bash
luxlather-frontend/
├── public/                # Static assets
├── src/                   # Application code
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level views
│   ├── store/             # Zustand state slices
│   ├── lib/               # API clients, helpers
│   └── types/             # Shared TS types
├── .env.example           # Example environment file
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
└── index.html             # HTML entry
```
---
### 🧼 About the Project

LuxLather was built with a focus on clean code, production-ready structure, and real-world eCommerce flows. It's optimized for performance and maintainability, and includes:
* Secure JWT-based authentication
* Stripe Checkout integration
* Cloudinary for image management
* Admin-only product management dashboard
* Fully responsive and mobile-friendly design
* Strong separation of concerns (routes, components, state, API)
This frontend pairs with the LuxLather backend (Node.js + Express + MongoDB) to deliver the full-stack experience.

---
### 👩🏾‍💻 Author
Made by [Kibirigi Rachel](https://www.kibirigirachel.dev/)
