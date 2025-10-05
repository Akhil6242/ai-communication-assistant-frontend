import React, { useState, useEffect } from 'react';
import { generateAIResponse, checkAIServiceHealth } from './services/api';
import './App.css';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [emailType, setEmailType] = useState('general');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceHealth, setServiceHealth] = useState('unknown');

  // Check AI service health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await checkAIServiceHealth();
      setServiceHealth(health.status === 'healthy' ? 'healthy' : 'down');
    } catch (error) {
      setServiceHealth('down');
    }
  };

  const handleGenerateResponse = async () => {
    if (!emailContent.trim()) {
      alert('Please enter some email content first!');
      return;
    }

    setLoading(true);
    setAiResponse('');

    try {
      const response = await generateAIResponse(emailContent, emailType);
      setAiResponse(response.generated_response);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Error: Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setEmailContent('');
    setAiResponse('');
    setEmailType('general');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AI Communication Assistant</h1>
        <div className={`health-status ${serviceHealth}`}>
          AI Service: {serviceHealth === 'healthy' ? '✅ Online' : '❌ Offline'}
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="input-section">
            <h2>📧 Email Content Analysis</h2>
            
            <div className="form-group">
              <label htmlFor="emailType">Email Type:</label>
              <select 
                id="emailType" 
                value={emailType} 
                onChange={(e) => setEmailType(e.target.value)}
                className="select-input"
              >
                <option value="general">General</option>
                <option value="complaint">Complaint</option>
                <option value="inquiry">Inquiry</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="emailContent">Email Content:</label>
              <textarea
                id="emailContent"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter the email content that needs an AI-generated response..."
                className="textarea-input"
                rows="6"
              />
            </div>

            <div className="button-group">
              <button 
                onClick={handleGenerateResponse} 
                disabled={loading || !emailContent.trim()}
                className="generate-btn"
              >
                {loading ? '🤖 Generating...' : '✨ Generate AI Response'}
              </button>
              
              <button 
                onClick={clearAll}
                className="clear-btn"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>

          {aiResponse && (
            <div className="response-section">
              <h2>🎯 AI Generated Response</h2>
              <div className="response-content">
                <p>{aiResponse}</p>
              </div>
              <div className="response-actions">
                <button onClick={() => navigator.clipboard.writeText(aiResponse)}>
                  📋 Copy Response
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Powered by AI Communication Assistant | Backend: Google App Engine | AI: Vercel Functions</p>
      </footer>
    </div>
  );
}

export default App;
