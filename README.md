# compsync-portfolio

Vue 3 + Vite project for the CompSync portfolio site.

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm (comes with Node.js)

## Installation and Setup

1. Open terminal and clone the repo:

```bash
git clone git@github.com:compsync-ai/compsync-portfolio.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

This creates the production output in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - generate production build
- `npm run preview` - preview production build locally

## Optional: Bootstrap This Project From Scratch

If you want to recreate the same setup from terminal:

```bash
npm create vite@latest compsync-portfolio -- --template vue
cd compsync-portfolio
npm install
npm run dev
```
