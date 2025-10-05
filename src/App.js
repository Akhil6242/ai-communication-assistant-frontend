import React, { useState, useEffect } from 'react';
import { generateAIResponse, checkAIServiceHealth } from './services/api';
import './App.css';
import { generateAIResponse, checkAIHealth } from './services/api';


function App() {
<<<<<<< HEAD
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedResponse, setEditedResponse] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiServiceStatus, setAiServiceStatus] = useState('checking');

  
  // Fetch emails on component mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await getEmails();
        setEmails(response.data);
        setLoading(false);
        console.log('✅ Emails loaded:', response.data.length);
      } catch (error) {
        console.error('❌ Failed to fetch emails:', error);
        setLoading(false);
      }
    };
=======
  const [emailContent, setEmailContent] = useState('');
  const [emailType, setEmailType] = useState('general');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceHealth, setServiceHealth] = useState('unknown');
>>>>>>> 23f9ea65e915af9baba73d01c128f3d2d5c89ddd

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

<<<<<<< HEAD
  useEffect(() => {
    checkAIHealth()
      .then(data => setAiServiceStatus(data.status === 'healthy' ? 'healthy' : 'down'))
      .catch(() => setAiServiceStatus('down'));
  }, []);


  const handleGenerateAIResponse = async (email) => {
    setAiLoading(true);
    try {
      const response = await generateAIResponse(email.content, email.category?.toLowerCase() || 'general');
      
      // Update the email with AI response
      setEmails(prevEmails => 
        prevEmails.map(e => 
          e.id === email.id 
            ? { ...e, aiResponse: response.generated_response }
            : e
        )
      );
      
      // Update selected email if it's the current one
      if (selectedEmail && selectedEmail.id === email.id) {
        setSelectedEmail(prev => ({ ...prev, aiResponse: response.generated_response }));
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    }
    setAiLoading(false);
  };


  const handleRegenerateAI = async () => {
    if (!selectedEmail) return;
    
=======
  const handleGenerateResponse = async () => {
    if (!emailContent.trim()) {
      alert('Please enter some email content first!');
      return;
    }

    setLoading(true);
    setAiResponse('');

>>>>>>> 23f9ea65e915af9baba73d01c128f3d2d5c89ddd
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
<<<<<<< HEAD
            
            <div className="email-list">
              {emails.map(email => (
                <div 
                  key={email.id} 
                  className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="email-sender">📧 {email.sender}</div>
                  <div className="email-subject">{email.subject}</div>
                  <div className="email-tags">
                    <span className={`tag priority-${email.priority?.toLowerCase() || 'normal'}`}>
                      {email.priority || 'Normal'}
                    </span>
                    <span className={`tag sentiment-${email.sentiment?.toLowerCase() || 'neutral'}`}>
                      {email.sentiment || 'Neutral'}
                    </span>
                    <span className={`tag status-${email.status?.toLowerCase() || 'pending'}`}>
                      {email.status || 'Pending'}
                    </span>
                  </div>
                  <div className="email-meta">
                    📂 {email.category || 'General'} • ⏰ {new Date(email.receivedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="email-detail-section">
            {selectedEmail ? (
              <div className="email-detail">
                <div className="email-header">
                  <h3>📧 {selectedEmail.subject}</h3>
                  <div className={`ai-status ${aiServiceStatus}`}>
                    🤖 AI Service: {aiServiceStatus === 'healthy' ? '✅ Online' : '❌ Offline'}
                  </div>
                  <div className="email-badges">
                    <span className={`badge priority-${selectedEmail.priority?.toLowerCase() || 'normal'}`}>
                      {selectedEmail.priority || 'Normal'} Priority
                    </span>
                    <span className={`badge sentiment-${selectedEmail.sentiment?.toLowerCase() || 'neutral'}`}>
                      {selectedEmail.sentiment || 'Neutral'} Sentiment
                    </span>
                  </div>
                </div>
                
                <div className="email-info">
                  <p><strong>📤 From:</strong> {selectedEmail.sender}</p>
                  <p><strong>📂 Category:</strong> {selectedEmail.category || 'General Support'}</p>
                  <p><strong>📊 Status:</strong> <span className={`status-${selectedEmail.status?.toLowerCase() || 'pending'}`}>{selectedEmail.status || 'Pending'}</span></p>
                  <p><strong>📅 Received:</strong> {new Date(selectedEmail.receivedAt).toLocaleString()}</p>
                </div>

                <div className="email-body-section">
                  <h4>📩 Customer Message:</h4>
                  <div className="email-body">
                    {selectedEmail.body}
                  </div>
                </div>

                <div className="ai-response-section">
                  <h4>🤖 AI-Generated Response:</h4>
                  
                  {selectedEmail.aiResponse ? (
                    <div className="ai-response-container">
                      <textarea
                        value={editedResponse}
                        onChange={(e) => setEditedResponse(e.target.value)}
                        rows="12"
                        className="ai-response-textarea"
                        placeholder="AI-generated response will appear here..."
                      />
                      <div className="response-actions">
                        <button 
                          onClick={handleSendReply}
                          className="send-reply-btn"
                          disabled={selectedEmail.status === 'Resolved'}
                        >
                          {selectedEmail.status === 'Resolved' ? '✅ Reply Sent' : '📤 Send Reply'}
                        </button>
                        <button 
                          onClick={handleRegenerateAI}
                          className="reset-response-btn"
                          disabled={isRegenerating || !selectedEmail?.aiResponse}
                        >
                          {isRegenerating ? (
                            <span>
                              <span className="spinner"></span>
                              Regenerating...
                            </span>
                          ) : (
                            '🔄 Reset to AI Version'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-ai-response">
                      <p>No AI response generated yet for this email.</p>
                      <button 
                        onClick={() => handleGenerateAIResponse(selectedEmail)}
                        disabled={aiLoading || aiServiceStatus !== 'healthy'}
                        className="ai-generate-btn"
                      >
                        {aiLoading ? '🤖 Generating...' : '✨ Generate AI Response'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-email-selected">
                <h3>📬 Select an Email</h3>
                <p>Choose an email from the list to view details and AI-generated responses.</p>
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <h4>📊 Quick Stats</h4>
                    <ul>
                      <li>Total Emails: {emails.length}</li>
                      <li>Pending: {emails.filter(e => e.status !== 'Resolved').length}</li>
                      <li>Resolved: {emails.filter(e => e.status === 'Resolved').length}</li>
                      <li>High Priority: {emails.filter(e => e.priority === 'Urgent' || e.priority === 'Critical').length}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
      <AboutDeveloperModal/>
=======
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Powered by AI Communication Assistant | Backend: Google App Engine | AI: Vercel Functions</p>
      </footer>
>>>>>>> 23f9ea65e915af9baba73d01c128f3d2d5c89ddd
    </div>
  );
}

export default App;
