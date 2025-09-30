import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getEmails = () => {
    return axios.get(`${API_URL}/emails`);
};

export const getEmailById = (id) => {
    return axios.get(`${API_URL}/emails/${id}`);
};

export const sendReply = (id, replyText) => {
    return axios.post(`${API_URL}/emails/${id}/reply`, { reply: replyText });
};
