# 📊 Intelligent AI Predictive Analytics & Full-Stack Dashboard

An end-to-end full-stack SaaS web application that automates data processing pipelines, executes predictive Machine Learning classification models on file upload, and integrates a context-aware AI assistant to query data insights using plain natural English.

## 🌟 Core Features & Architecture Demonstrated

This portfolio piece demonstrates the convergence of four distinct engineering domains, operating across a decoupled client-server architecture:

*   **Data Analyst:** Ingests raw business CSV records, handles programmatic columns cleaning (e.g., stripping text-locked numeric fields like `TotalCharges`), and calculates macro-level data profiling summaries.
*   **Data Scientist:** Implements an automated Supervised Machine Learning classification pipeline using **Scikit-Learn**. Dynamically executes train/test splits, trains a **Random Forest Classifier**, evaluates accuracy metrics (~80% predictive precision), and isolates model feature importances.
*   **Full-Stack Developer:** Features a modern decoupled structure consisting of a blazing-fast **Vite + React** single-page user interface communicating with an asynchronous **Python FastAPI REST engine** configured with secure Cross-Origin Resource Sharing (CORS) middleware.
*   **AI Engineer:** Implements a logical context-aware intelligence layer that translates abstract mathematical algorithm weights into structured corporate business advisories using natural text queries.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React.js, Vite, Recharts (Dynamic Visualization Graphics), HTML5, Vanilla CSS3 |
| **Backend API Server** | Python 3.12+, FastAPI, Uvicorn, Pydantic |
| **Data & ML Pipelines** | Pandas, NumPy, Scikit-Learn (Random Forest) |

---

## 📂 Project Directory Structure

```text
ai-predictive-analytics-dashboard/
├── backend/
│   ├── main.py              # FastAPI server, endpoints, and ML logic
│   └── ml_brain.py          # Core exploratory model prototyping
└── frontend/
    ├── src/
    │   ├── App.jsx          # Interactive React dashboard view layer
    │   └── main.jsx         # Web entry point configuration
    ├── package.json         # Node.js dependency manager
    └── vite.config.js       # Vite bundler options
```

---

## 🚀 Local Installation & Setup

Follow these steps to spin up the local development ecosystem on your machine:

### 1. Initialize the Python Backend API
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  
pip install fastapi uvicorn pandas scikit-learn
python -m uvicorn main:app --reload
```

### 2. Initialize the React Frontend Client
Open a second terminal window and execute:
```bash
cd frontend
npm install
npm install recharts
npm run dev
```

---

## 📈 Testing Guide (Dataset Used)
This application is fully optimized for the classic **IBM Telco Customer Churn dataset**. 
1. Open the frontend browser client.
2. Select and upload the raw dataset `.csv` file.
3. Click **"Analyze & Predict"** to view real-time data science model tracking metrics and interactive graph overlays.
4. Use the custom integrated chat bar at the footer to query your data in plain text (e.g., *"Why are my clients leaving?"*).
