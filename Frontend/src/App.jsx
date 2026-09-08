import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose CSV File");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first!');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process data from backend.');
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Error connecting to backend server. Make sure your Python server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        <h1 style={{ color: '#1e293b', marginBottom: '10px' }}>📊 Intelligent AI & Analytics Dashboard</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Upload your customer business metrics to clean data, train a Machine Learning model, and view predictive drivers instantly.</p>

        {/* UPLOAD SECTION */}
        <div style={{ border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8fafc', marginBottom: '25px' }}>
          <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} id="csv-upload" />
          <label htmlFor="csv-upload" style={{ cursor: 'pointer', display: 'inline-block', padding: '10px 20px', backgroundColor: '#cbd5e1', borderRadius: '6px', marginRight: '15px', fontWeight: '500' }}>
            {fileName}
          </label>
          <button onClick={handleUpload} disabled={loading} style={{ padding: '10px 25px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? "Training AI Model..." : "Analyze & Predict"}
          </button>
        </div>

        {error && <p style={{ color: '#dc2626', fontWeight: '500' }}>⚠️ {error}</p>}

        {/* RESULTS PANEL */}
        {data && (
          <div style={{ marginTop: '40px' }}>
            <hr style={{ border: '0', height: '1px', backgroundColor: '#e2e8f0', marginBottom: '30px' }} />
            
            <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>📈 Executive Business Insights</h2>
            
            {/* STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <span style={{ fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', fontWeight: 'bold' }}>Data Analyst View</span>
                <h3 style={{ margin: '10px 0 0 0', fontSize: '24px', color: '#1e293b' }}>{data.analytics.total_customers.toLocaleString()} Customers</h3>
              </div>
              <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
                <span style={{ fontSize: '14px', color: '#14532d', textTransform: 'uppercase', fontWeight: 'bold' }}>AI Prediction Accuracy</span>
                <h3 style={{ margin: '10px 0 0 0', fontSize: '24px', color: '#1e293b' }}>{data.machine_learning.model_accuracy.toFixed(2)}%</h3>
              </div>
            </div>

            {/* CHART */}
            <h3 style={{ color: '#334155', marginBottom: '15px' }}>🔮 Key Drivers Triggering Churn (ML Model Insights)</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>The chart below extracts feature importance scores dynamically computed by our Random Forest algorithm.</p>
            
            <div style={{ width: '100%', height: 350, backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.machine_learning.top_drivers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="feature" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" unit="%" />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}% Weight`, 'Influence']} />
                  <Bar dataKey="influence" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

expo