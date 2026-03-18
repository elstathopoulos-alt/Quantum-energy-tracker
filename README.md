# ⚡ Quantum Energy Tracker

> Real-time electrical network monitoring dashboard built with React + Lucide icons.



![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)




![License](https://img.shields.io/badge/License-MIT-green)




![Version](https://img.shields.io/badge/Version-1.0.0-a855f7)



---

## 📸 Overview

A live dashboard that simulates and monitors an electrical grid with 6 nodes — generators, consumers, and a substation. Data updates every 700ms using sine wave + noise simulation.

---

## ✨ Features

- **6 Network Nodes** — 2 Generators, 3 Consumers, 1 Sub-station
- **Live Updates** every 700ms with sine wave + random noise simulation
- **Status Alerts** — Normal 🟢 / Warning 🟡 / Critical 🔴
- **Sparkline Charts** per node (SVG, custom-built)
- **Bar Chart** in detail view (last 20 readings)
- **KPI Row** — Total Generation, Consumption, Grid Balance
- **Node Detail Panel** — Current / Peak / Min / Avg stats
- **Pause / Resume** live data feed

---

## 🛠️ Tech Stack

- React 18 (hooks: `useState`, `useEffect`, `useRef`)
- [Lucide React](https://lucide.dev/) icons
- Custom SVG sparkline & barchart components
- No external charting library — pure SVG

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) v16 or higher
- npm (comes with Node.js)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/elstathopoulos-alt/Quantum-energy-tracker.git
cd Quantum-energy-tracker
2. Create the React project structure
If you're starting from just the App.js file, first create a new React app and replace the default App.js:
npx create-react-app quantum-energy-tracker
cd quantum-energy-tracker
Then copy App.js from this repo into the src/ folder, replacing the existing one.
3. Install dependencies
npm install lucide-react
4. Start the development server
npm start
The app will open at http://localhost:3000
📁 Project Structure
quantum-energy-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   └── index.js
├── package.json
├── .gitignore
└── README.md
📦 Build for Production
npm run build
🌐 Deploy to Vercel (optional)
npm install -g vercel
vercel
📄 License
MIT © 2026 Eleftherios Stathopoulos — Marine Engineer
