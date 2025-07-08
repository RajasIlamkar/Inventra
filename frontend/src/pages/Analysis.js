import React, { useEffect, useState } from 'react';
import '../styles/Analysis.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analysis/groq`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAnalysisData(data);
    };

    const fetchStats = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analysis/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    };

    fetchAnalysis();
    fetchStats();
  }, [token]);

  if (!analysisData || !stats) return <p style={{ padding: '1rem' }}>Loading Insights...</p>;

  // Bar Chart Config (Top Selling Products)
  const barData = {
    labels: stats.topProducts.map((item) => item.product),
    datasets: [
      {
        label: 'Units Sold',
        data: stats.topProducts.map((item) => item.quantity),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top Selling Products',
        font: { size: 14 }
      },
    },
  };

  // Line Chart Config (Orders Over Time)
  const lineData = {
    labels: stats.salesTrend.map((item) => item.date),
    datasets: [
      {
        label: 'Orders',
        data: stats.salesTrend.map((item) => item.orders),
        fill: true,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Order Trend Over Time',
        font: { size: 14 }
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: 'Number of Orders' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="analysis-container">
      <h2>📊 Business Insights Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Orders</h4>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p>₹{stats.totalRevenue}</p>
        </div>
        <div className="stat-card">
          <h4>Low Stock Items</h4>
          <p>{stats.lowInventory.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>📦 Top Selling Products</h3>
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="dashboard-section">
        <h3>📈 Sales Trend</h3>
        <div className="chart-container">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="dashboard-section">
        <h3>💡 Price Suggestions</h3>
        <ul className="analysis-list">
          {analysisData.priceSuggestions.map((item) => (
            <li key={item.name}>
              <strong>{capitalizeFirstLetter(item.name)}</strong> — Current: ₹{item.currentPrice}, Suggested: ₹{item.suggestedPrice}
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>💬 Sentiment Feedback</h3>
        <ul className="analysis-list">
          {analysisData.sentimentFeedback.map((item) => (
            <li key={item.name}>
              <strong>{capitalizeFirstLetter(item.name)}</strong> — Sentiment:{' '}
              <span className={
                item.sentiment === 'positive'
                  ? 'sentiment-positive'
                  : item.sentiment === 'negative'
                  ? 'sentiment-negative'
                  : 'sentiment-neutral'
              }>
                {item.sentiment}
              </span>{' '}
              — {item.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Analysis;
