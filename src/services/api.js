import axios from 'axios';

// Production URLs for your deployed services
const BACKEND_URL = 'https://ai-email-assistant8n.uc.r.appspot.com/api';
const AI_SERVICE_URL = 'https://ai-email-assistant8n-on8a7zv92.vercel.app/api';

// Backend API functions
export const getEmails = () => {
  return axios.get(`${BACKEND_URL}/emails`);
};

export const getEmailById = (id) => {
  return axios.get(`${BACKEND_URL}/emails/${id}`);
};

export const sendReply = (id, replyText) => {
  return axios.post(`${BACKEND_URL}/emails/${id}/reply`, { reply: replyText });
};

// AI Service functions (NEW)
export const generateAIResponse = async (emailContent, type = 'general') => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/generate-response`, {
      email_content: emailContent,
      type: type
    });
    return response.data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

export const checkAIHealth = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking AI health:', error);
    throw error;
  }
};
