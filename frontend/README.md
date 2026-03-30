# Frontend (Job Platform)

React 18 + Vite application for the Job Platform: marketing-style home page, login, and registration, styled with Tailwind CSS.

## Documentation

Project-wide architecture, ports, Docker setup, and environment variables are documented in the **[repository root README](../README.md)**.

## Local development

```bash
npm install
npm run dev
```

Optional: set `VITE_BACKEND_URL` in `.env` to the API gateway (default `http://localhost:8084`). See the root README.

## Scripts

- `npm run dev` — start Vite dev server  
- `npm run build` — production build  
- `npm run preview` — preview the production build  
- `npm run lint` — run ESLint  

This app was bootstrapped with Vite’s React template; stack details and plugins are listed in `package.json`.
