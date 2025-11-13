import axios from 'axios';
import {API_BASE_URL, API_ENDPOINTS, PAGINATION} from '../constants/api';
import {Voter, PaginatedResponse, FilterParams} from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log('🔵 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  error => {
    console.error('🔴 API Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('🟢 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('🔴 API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export const voterService = {
  // Get all voters with pagination
  getVoters: async (
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginatedResponse> => {
    console.log('📋 getVoters called:', {page, limit});
    const response = await api.get(API_ENDPOINTS.VOTERS, {
      params: {page, limit},
    });
    console.log('📋 getVoters response:', response.data);
    return response.data;
  },

  // Search voters by name
  searchVotersByName: async (
    name: string,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginatedResponse> => {
    console.log('🔍 searchVotersByName called:', {name, page, limit});
    const response = await api.get(API_ENDPOINTS.VOTERS_FILTER, {
      params: {Name: name, page, limit},
    });
    console.log('🔍 searchVotersByName response:', response.data);
    return response.data;
  },

  // Filter voters by multiple fields
  filterVoters: async (
    filters: FilterParams,
  ): Promise<PaginatedResponse> => {
    console.log('🎯 filterVoters called:', filters);
    const response = await api.get(API_ENDPOINTS.VOTERS_FILTER, {
      params: filters,
    });
    console.log('🎯 filterVoters response:', response.data);
    return response.data;
  },

  // Get voters with mobile number
  getVotersWithMobile: async (
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginatedResponse> => {
    console.log('📱 getVotersWithMobile called:', {page, limit});
    const response = await api.get(API_ENDPOINTS.VOTERS_WITH_MOBILE, {
      params: {page, limit},
    });
    console.log('📱 getVotersWithMobile response:', response.data);
    return response.data;
  },

  // Update voter mobile number
  updateVoterMobile: async (
    voterId: string,
    mobileNumber: string,
  ): Promise<Voter> => {
    console.log('✏️ updateVoterMobile called:', {voterId, mobileNumber});
    const response = await api.patch(`${API_ENDPOINTS.VOTERS}/${voterId}`, {
      mobileNumber,
    });
    console.log('✏️ updateVoterMobile response:', response.data);
    return response.data;
  },

  // Get all voters (for CSV export)
  getAllVoters: async (): Promise<Voter[]> => {
    console.log('📊 getAllVoters called');
    const response = await api.get(API_ENDPOINTS.VOTERS, {
      params: {limit: 10000}, // Large limit to get all
    });
    console.log('📊 getAllVoters response:', response.data);
    return response.data.voters;
  },
};

export default api;
