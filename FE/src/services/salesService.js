// FE/src/services/salesService.js
import axios from 'axios';
import { API_BASE_URL } from './api.config';

export const getSalesStats = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/sales/stats`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    throw error;
  }
};

export const getDailySales = async () => {
  const today = new Date().toISOString().split('T')[0];
  return getSalesStats(today, today);
};

export const getWeeklySales = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  
  return getSalesStats(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );
};
