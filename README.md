
# Hrita Solutions - Customer Portal

An elegant, AI-powered customer dashboard for architecture and interior design clients.

## 🚀 Getting Started

Follow these steps to run the application on your local machine.

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (Recommended version 18 or higher)

### 2. Setup
1. Create a project folder (e.g., `antigravity`).
2. Copy all project files (`App.tsx`, `index.tsx`, `index.html`, `types.ts`, and the `components/` & `services/` folders) into this directory.
3. Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Installation
Open your terminal in the project folder and run:
```bash
npm install
```

### 4. Running the App
Start the local development server:
```bash
npm run dev
```
Vite will provide a local URL (usually `http://localhost:5173`). Open it in your browser to view the app.

## 🛠 Project Structure
- `index.html`: Entry point.
- `index.tsx`: React mounting logic.
- `App.tsx`: Main application shell and login gate.
- `components/`: UI components (Dashboard, Timeline, Modals, Logo).
- `services/`: AI services (Gemini Search Core).
- `types.ts`: Global TypeScript definitions.

## 📦 Deployment
To build for production:
```bash
npm run build
```
The output will be in the `dist/` folder, ready for hosting.
