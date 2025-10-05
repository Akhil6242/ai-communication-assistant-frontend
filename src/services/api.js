// API Service Configuration
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'https://ai-email-assistant8n-on8a7zv92.vercel.app';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://ai-email-assistant8n.uc.r.appspot.com';

// AI Service Functions
export const generateAIResponse = async (emailContent, type = 'general') => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/generate-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_content: emailContent,
        type: type
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// Health Check Function
export const checkAIServiceHealth = async () => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking AI service health:', error);
    throw error;
  }
};

// Backend Functions (for future use)
export const fetchEmails = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/emails`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

export const createEmail = async (emailData) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating email:', error);
    throw error;
  }
};
