import axios, { AxiosInstance } from "axios";
import { Activity, ActivityRequest, Recommendation } from "../types/index.ts";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
})

export const getActivities = () => api.get<Activity[]>('/activities');
export const addActivities = (activity: ActivityRequest) => api.post<Activity>('/activities', activity);
export const addActivityDetail = (id: string) => api.get<Recommendation>(`/recommendations/activity/${id}`);
