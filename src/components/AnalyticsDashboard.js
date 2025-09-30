import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsDashboard = ({ emails }) => {
  // Calculate priority distribution
  const priorityCounts = emails.reduce((acc, email) => {
    const key = email.priority || 'Normal';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const priorityData = Object.entries(priorityCounts).map(([key, value]) => ({ 
    name: key, 
    count: value,
    percentage: Math.round((value / emails.length) * 100)
  }));

  // Calculate sentiment distribution
  const sentimentCounts = emails.reduce((acc, email) => {
    const key = email.sentiment || 'Neutral';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sentimentData = Object.entries(sentimentCounts).map(([key, value]) => ({ 
    name: key, 
    value: value,
    percentage: Math.round((value / emails.length) * 100)
  }));

  // Calculate category distribution
  const categoryCounts = emails.reduce((acc, email) => {
    const key = email.category || 'General';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([key, value]) => ({ 
    name: key, 
    count: value 
  }));

  // Calculate status distribution
  const resolvedCount = emails.filter(e => e.status === 'Resolved').length;
  const pendingCount = emails.length - resolvedCount;

  // Colors for charts
  const SENTIMENT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
  const PRIORITY_COLORS = ['#FF4757', '#FFA502', '#2ED573'];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Email Analytics Dashboard</h2>
        <div className="quick-stats">
          <div className="stat-box">
            <div className="stat-number">{emails.length}</div>
            <div className="stat-label">Total Emails</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{resolvedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{Math.round((resolvedCount / emails.length) * 100)}%</div>
            <div className="stat-label">Resolution Rate</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Priority Distribution */}
        <div className="chart-container">
          <h3>🔥 Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Emails' : name]} />
              <Legend />
              <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        <div className="chart-container">
          <h3>😊 Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={sentimentData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80}
                label={({name, percentage}) => `${name}: ${percentage}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Emails']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-container">
          <h3>📂 Support Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Status */}
        <div className="chart-container">
          <h3>✅ Resolution Status</h3>
          <div className="status-chart">
            <div className="status-item">
              <div className="status-bar">
                <div 
                  className="status-fill resolved"
                  style={{width: `${(resolvedCount / emails.length) * 100}%`}}
                ></div>
              </div>
              <div className="status-info">
                <span className="status-label">Resolved: {resolvedCount}</span>
                <span className="status-percentage">{Math.round((resolvedCount / emails.length) * 100)}%</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-bar">
                <div 
                  className="status-fill pending"
                  style={{width: `${(pendingCount / emails.length) * 100}%`}}
                ></div>
              </div>
              <div className="status-info">
                <span className="status-label">Pending: {pendingCount}</span>
                <span className="status-percentage">{Math.round((pendingCount / emails.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
