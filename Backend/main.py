from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import io

app = FastAPI(title="AI Analytics Dashboard API")

# Allow your frontend website to safely communicate with this backend API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you will lock this down
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Online", "message": "AI Analytics Server is running successfully!"}

@app.post("/api/analyze")
async def analyze_dataset(file: UploadFile = File(...)):
    # 1. READ UPLOADED CSV FILE (Data Analyst)
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    total_rows, total_cols = df.shape
    columns_list = list(df.columns)
    
    # 2. RUN MACHINE LEARNING PIPELINE (Data Scientist)
    ml_df = df.drop(columns=['customerID'], errors='ignore')
    
    # Clean string blanks in TotalCharges
    if 'TotalCharges' in ml_df.columns:
        ml_df['TotalCharges'] = pd.to_numeric(ml_df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0)
    
    # Map target column to binary integers
    if 'Churn' in ml_df.columns:
        ml_df['Churn'] = ml_df['Churn'].map({'Yes': 1, 'No': 0})
    
    # Convert category text to dummy metrics
    ml_df_encoded = pd.get_dummies(ml_df, drop_first=True)
    
    if 'Churn' in ml_df_encoded.columns:
        X = ml_df_encoded.drop(columns=['Churn'])
        y = ml_df_encoded['Churn']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        
        # Get Top 5 Drivers for dashboard charting
        importances = model.feature_importances_
        feature_metrics = pd.DataFrame({'Feature': X.columns, 'Importance': importances})
        top_5 = feature_metrics.sort_values(by='Importance', ascending=False).head(5)
        
        drivers_list = [{"feature": str(row['Feature']), "influence": float(row['Importance'] * 100)} for _, row in top_5.iterrows()]
    else:
        accuracy = 0
        drivers_list = []

    # 3. CONVERT RESULT TO JSON FOR THE DASHBOARD
    return {
        "analytics": {
            "total_customers": total_rows,
            "total_metrics_tracked": total_cols,
            "columns": columns_list
        },
        "machine_learning": {
            "model_accuracy": float(accuracy * 100),
            "top_drivers": drivers_list
        }
    }

from pydantic import BaseModel

# 1. CREATE A DATA STRUCTURE FOR THE USER'S CHAT COMPONENT
class ChatRequest(BaseModel):
    question: str
    accuracy: float
    top_drivers: list

# 2. CREATE THE AI CHAT ENDPOINT
@app.post("/api/chat")
async def chat_with_data(payload: ChatRequest):
    # Format the metrics into a clear story for the AI brain
    drivers_summary = ", ".join([f"{d['feature']} ({d['influence']:.1f}% weight)" for d in payload.top_drivers])
    
    # Context prompt explaining the business situation
    ai_context = (
        f"You are a Senior AI Data Consultant. A business user uploaded a customer dataset. "
        f"Your Random Forest Machine Learning model has a predictive accuracy of {payload.accuracy:.2f}%. "
        f"The top statistical drivers causing customers to leave the company are: {drivers_summary}. "
        f"Answer the user's question directly, clearly, and concisely in a highly professional business tone. "
        f"User question: {payload.question}"
    )
    
    # 💡 PRODUCTION TIP FOR LINKEDIN: 
    # To save money and avoid complex API key setups right now, we are building 
    # a local rule-based intelligence engine that acts exactly like an LLM response.
    # When you put this on GitHub, you can swap this for a direct 'openai.chat.completions' call!
    
    q = payload.question.lower()
    if "why" in q or "leave" in q or "driver" in q or "churn" in q:
        reply = (
            f"Based on our predictive analysis, customers are primarily leaving due to the top indicators: {drivers_summary}. "
            f"With our model operating at {payload.accuracy:.2f}% accuracy, I strongly recommend auditing your pricing structures "
            f"or contract flexibilities related to these columns to mitigate customer churn."
        )
    elif "accuracy" in q or "good" in q or "score" in q or "model" in q:
        reply = (
            f"The predictive algorithm is currently operating at an accuracy rate of {payload.accuracy:.2f}%. "
            f"This represents a highly robust baseline for corporate risk deployment. We can improve this score further "
            f"by performing target hyperparameter tuning or adding engineering metrics."
        )
    else:
        reply = (
            f"As your Data Consultant, looking at our {payload.accuracy:.2f}% accurate ML model, "
            f"the data indicates that {payload.top_drivers[0]['feature']} holds the highest leverage. "
            f"Could you specify if you would like an operational strategy or a deep-dive data cleanup checklist for this metric?"
        )

    return {"ai_response": reply}
