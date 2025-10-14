import React, { useState, useEffect } from 'react';
import { getEmails,fetchNewEmails, getEmailById, sendReply, generateAIResponse, checkAIHealth } from './services/api';
import './App.css';

function App() {
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
      console.log('🚀 Starting email fetch...');
      setIsFetching(true);
      try {
        console.log('🔄 About to call getEmails()...');
        const response = await getEmails();
        console.log('📧 Raw API response:', response);
        console.log('📧 Email data:', response.data);
        
        setEmails(response.data || []);
        setLastFetch(new Date().toLocaleString());
        console.log('✅ State updated with emails:', response.data?.length || 0);
      } catch (error) {
        console.error('💥 Fetch failed:', error);
        setEmails([]);
      } finally {
        setIsFetching(false);
        setLoading(false); // ✅ CRITICAL: Stop loading screen
        console.log('🏁 Loading state set to false');
      }
    };

    fetchEmails();
  }, []);

  // Update edited response when email selection changes
  useEffect(() => {
    if (selectedEmail && selectedEmail.aiResponse) {
      setEditedResponse(selectedEmail.aiResponse);
    }
  }, [selectedEmail]);

  // Check AI service health
  useEffect(() => {
    checkAIHealth()
      .then(data => {
        setAiServiceStatus(data.status === 'healthy' ? 'healthy' : 'down');
      })
      .catch(() => {
        setAiServiceStatus('down');
      });
  }, []);

  const handleSendReply = async () => {
    if (!selectedEmail) return;
    
    try {
      await sendReply(selectedEmail.id, editedResponse);
      showSuccessNotification('Reply sent successfully!');
      
      // Update email status
      setEmails(emails.map(email => 
        email.id === selectedEmail.id 
          ? { ...email, status: 'Resolved', aiResponse: editedResponse }
          : email
      ));
      
      setSelectedEmail({ ...selectedEmail, status: 'Resolved', aiResponse: editedResponse });
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const handleGenerateAIResponse = async (email) => {
    setAiLoading(true);
    try {
      const response = await generateAIResponse(email.body, email.category?.toLowerCase() || 'general');
      console.log('🎯 Full AI response:', response);  // Debug log

      const aiResponseText = response.aiResponse || response.generated_response;
      
      if (!aiResponseText) {
        throw new Error('No AI response received from service');
      }

      // Update the email with AI response
      setEmails(prevEmails => 
        prevEmails.map(e => 
          e.id === email.id 
            ? { ...e, aiResponse: aiResponseText }
            : e
        )
      );
      
      // Update selected email if it's the current one
      if (selectedEmail && selectedEmail.id === email.id) {
        setSelectedEmail(prev => ({ ...prev, aiResponse: aiResponseText }));
        setEditedResponse(aiResponseText);
      }
      
      console.log('✅ AI response generated for email:', email.id);
    } catch (error) {
      console.error('❌ Failed to generate AI response:', error);
    }
    setAiLoading(false);
  };

  const handleRegenerateAI = async () => {
    if (!selectedEmail) return;
    
    try {
      setIsRegenerating(true);
      console.log('🔄 Regenerating AI response...');
      
      const response = await generateAIResponse(selectedEmail.body, selectedEmail.category?.toLowerCase() || 'general');
      
      if (response && response.generated_response) {
        // Update the textarea with the new response
        setEditedResponse(response.generated_response);
        
        // Update the email object with new response
        const updatedEmail = { ...selectedEmail, aiResponse: response.generated_response };
        setSelectedEmail(updatedEmail);
        
        // Update the emails array to persist the new response
        setEmails(emails.map(email => 
          email.id === selectedEmail.id ? updatedEmail : email
        ));
        
        console.log('✅ AI response regenerated successfully');
        showSuccessNotification('New AI response generated!');
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('❌ Error regenerating AI response:', error);
      alert('Failed to regenerate AI response. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const refreshEmails = async () => {
    console.log('🚀 Starting email fetch...');
    setIsFetching(true);
    try {
      console.log('🔄 About to call getEmails()...');
      const response = await getEmails();
      console.log('📧 Raw API response:', response);
      console.log('📧 Email data:', response.data);
      
      setEmails(response.data || []);
      setLastFetch(new Date().toLocaleString());
      console.log('✅ State updated with emails:', response.data?.length || 0);
    } catch (error) {
      console.error('💥 Fetch failed:', error);
      setEmails([]);
    } finally {
      setIsFetching(false);
      console.log('🏁 Loading state set to false');
    }
  };

  const handleFetchEmails = async () => {
    try {
      setIsFetching(true);
      const { data } = await fetchNewEmails();          // uses prod URL
      if (data.status === "success") {
        // wait while server imports, then refresh list
        setTimeout(refreshEmails, 2000);
        showSuccessNotification(`${data.newEmailsCount} new emails imported!`);
      }
    } catch (e) {
      alert(`Error fetching emails – ${e.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const showSuccessNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <h2>🔄 Loading AI Email Assistant...</h2>
        <p>Connecting to backend services...</p>
      </div>
    );
  }

  // About Developer Modal Component
  const AboutDeveloperModal = () => {
    if (!showAboutModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
        <div className="about-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>📧 About the Developer</h2>
            <button className="close-btn" onClick={() => setShowAboutModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="profile-section">
              <div className="profile-photo">
                <img 
                  src="https://avatars.githubusercontent.com/u/181719775?s=400&u=021d888025a489910b0cb86571d24c029fe2bba3&v=4" 
                  alt="Akhilesh Yadav" 
                  className="developer-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-fallback" style={{display: 'none'}}>👨‍💻</div>
              </div>
              <h3>Akhilesh Yadav</h3>
              <p className="title">Full-Stack Developer & AI Enthusiast</p>
              <p className="subtitle">Masters in Computer Applications | Delhi NCR, India</p>
            </div>

            <div className="bio-section">
              <h4>🚀 About Me</h4>
              <p>
                Passionate full-stack developer specializing in AI-powered applications and modern web technologies. 
                Currently pursuing Computer Science with hands-on experience in building intelligent systems that solve 
                real-world business problems.
              </p>
            </div>

            <div className="skills-section">
              <h4>💻 Technical Expertise</h4>
              <div className="skills-grid">
                <div className="skill-category">
                  <h5>Frontend</h5>
                  <span className="skills">React.js, JavaScript ES6+, HTML5, CSS3, Responsive Design</span>
                </div>
                <div className="skill-category">
                  <h5>Backend</h5>
                  <span className="skills">Spring Boot, Java 17, RESTful APIs, Maven</span>
                </div>
                <div className="skill-category">
                  <h5>AI/ML</h5>
                  <span className="skills">Node.js, Natural Language Processing, Sentiment Analysis</span>
                </div>
                <div className="skill-category">
                  <h5>Database & Cloud</h5>
                  <span className="skills">PostgreSQL, SQLite, Google Cloud, Git, GitHub</span>
                </div>
              </div>
            </div>

            <div className="contact-section">
              <h4>🌐 Connect With Me</h4>
              <div className="contact-links">
                <a href="https://github.com/Akhil6242" target="_blank" rel="noopener noreferrer">
                  🔗 GitHub
                </a>
                <a href="https://linkedin.com/in/akhilesh-yadav-0b83032a5" target="_blank" rel="noopener noreferrer">
                    🤝 LinkedIn
                </a>
                <a href="mailto:akhilyadavbil@gmail.com">
                  📧  akhilyadavbil@gmail.com
                </a>
              </div>
            </div>

            <div className="footer-note">
              <p>
                <strong>This AI Communication Assistant</strong> showcases advanced full-stack development skills 
                including microservices architecture, AI integration, and enterprise-grade deployment. 
                Built with passion for solving complex business challenges through intelligent automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>🤖 AI Email Assistant Dashboard</h1>
        <div className="header-controls">
          <div className="header-tabs">
            <button 
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📧 Email Dashboard
            </button>
          </div>
          <div className="header-stats">
            <button className="about-us-btn" onClick={() => setShowAboutModal(true)}>
              About Us
            </button>
            <span className="stat">📊 Total: {emails.length}</span>
            <span className="stat">🚨 Urgent: {emails.filter(e => e.priority === 'Urgent' || e.priority === 'Critical').length}</span>
            <span className="stat">✅ Resolved: {emails.filter(e => e.status === 'Resolved').length}</span>
            <div className={`ai-status ${aiServiceStatus}`}>
              🤖 AI Service: {aiServiceStatus === 'healthy' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="email-list-section">
          <div className="email-list-header">
            <div className="header-left">
              <h2>📧 Support Emails ({emails.length})</h2>
              {lastFetch && <span className="last-fetch-info">Last sync: {lastFetch}</span>}
            </div>
            <div className="header-right">
              <button 
                onClick={handleFetchEmails} 
                className={`fetch-emails-btn ${isFetching ? 'fetching' : ''}`}
                disabled={isFetching}
              >
                {isFetching ? (
                  <span>
                    <span className="spinner"></span>
                    Fetching new emails...
                  </span>
                ) : (
                  'Check for New Emails'
                )}
              </button>
            </div>
          </div>

          <div className="email-list">
            {emails.map(email => (
              <div 
                key={email.id} 
                className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="email-sender">{email.sender}</div>
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
                  {email.category || 'General'} • {new Date(email.receivedAt).toLocaleString()}
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
                <p><strong>📊 Status:</strong> 
                  <span className={`status-${selectedEmail.status?.toLowerCase() || 'pending'}`}>
                    {selectedEmail.status || 'Pending'}
                  </span>
                </p>
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
                      className="generate-ai-btn"
                    >
                      {aiLoading ? '🔄 Generating...' : '🤖 Generate AI Response'}
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
                    <li>📧 Total Emails: {emails.length}</li>
                    <li>⏳ Pending: {emails.filter(e => e.status !== 'Resolved').length}</li>
                    <li>✅ Resolved: {emails.filter(e => e.status === 'Resolved').length}</li>
                    <li>🚨 High Priority: {emails.filter(e => e.priority === 'Urgent' || e.priority === 'Critical').length}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AboutDeveloperModal />
    </div>
  );
}

export default App;
