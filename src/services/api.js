import axios from 'axios';

// Production URLs for your deployed services
const BACKEND_URL = 'https://ai-email-assistant8n.uc.r.appspot.com/api';
const AI_SERVICE_URL = 'https://ai-email-assistant8n.vercel.app/api';

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Backend API functions
export const getEmails = async () => {
  try {
    console.log('🔍 Fetching emails from:', `${BACKEND_URL}/emails`);
    const response = await axios.get(`${BACKEND_URL}/emails`);
    console.log('✅ Emails fetched successfully:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Error fetching emails:', error.response || error.message);
    throw error;
  }
};


export const fetchNewEmails = async () => {
  try {
    console.log('🔄 Triggering new email fetch...');
    const response = await axios.post(`${BACKEND_URL}/emails/fetch-emails`);
    console.log('✅ Fetch new emails response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Error triggering new email fetch:', error.response || error.message);
    throw error;
  }
};

export const getEmailById = async (id) => {
  try {
    console.log('🔍 Fetching email by ID:', id);
    const response = await axios.get(`${BACKEND_URL}/emails/${id}`);
    console.log('✅ Email fetched successfully:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Error fetching email by ID:', error.response || error.message);
    throw error;
  }
};

export const sendReply = async (id, replyText) => {
  try {
    console.log('🔍 Sending reply for email:', id);
    const response = await axios.post(`${BACKEND_URL}/emails/${id}/reply`, { 
      reply: replyText 
    });
    console.log('✅ Reply sent successfully:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Error sending reply:', error.response || error.message);
    throw error;
  }
};

// AI Service functions
export const generateAIResponse = async (emailContent, type = 'general') => {
  try {
    console.log('🤖 Generating AI response:', { emailContent, type });
    const response = await axios.post(`${AI_SERVICE_URL}/generate-response`, {
      email_content: emailContent,
      type: type
    });
    console.log('✅ AI response generated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error generating AI response:', error.response || error.message);
    throw error;
  }
};

export const checkAIHealth = async () => {
  try {
    console.log('🔍 Checking AI service health...');
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    console.log('✅ AI service health:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error checking AI health:', error.response || error.message);
    throw error;
  }
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await axios.get(`${BACKEND_URL}/emails`);
    console.log('✅ Backend connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

// Create mock data if backend is unavailable
export const getMockEmails = () => {
  console.log('📝 Using mock data since backend is unavailable');
  return {
    data: [
      {
        id: 1,
        subject: "Cannot access my account",
        sender: "john.doe@email.com",
        content: "I've been trying to log into my account but keep getting an error message. Can you please help me reset my password?",
        category: "support",
        priority: "Normal",
        status: "Pending",
        receivedAt: new Date().toISOString(),
        aiResponse: null
      },
      {
        id: 2,
        subject: "Billing inquiry",
        sender: "jane.smith@email.com", 
        content: "I was charged twice for my subscription this month. Could you please look into this and provide a refund for the duplicate charge?",
        category: "inquiry",
        priority: "Normal", 
        status: "Pending",
        receivedAt: new Date().toISOString(),
        aiResponse: null
      },
      {
        id: 3,
        subject: "Product complaint",
        sender: "angry.customer@email.com",
        content: "The product I ordered arrived damaged and doesn't match the description. This is unacceptable! I want a full refund immediately.",
        category: "complaint",
        priority: "Urgent",
        status: "Pending", 
        receivedAt: new Date().toISOString(),
        aiResponse: null
      }
    ]
  };
};