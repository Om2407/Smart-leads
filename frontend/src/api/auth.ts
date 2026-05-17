import api from './axios';
import { ApiResponse, User } from '../types';

export interface AuthData {
  user: User;
  token: string;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/login', data),

  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};
