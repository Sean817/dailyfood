// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token 存储键
const TOKEN_KEY = 'dailyfood_token';

// 获取存储的 token
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

// 保存 token
export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

// 删除 token
export function removeToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// API 请求封装
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// GET 请求
export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// POST 请求
export function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT 请求
export function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE 请求
export function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// 认证相关 API
export const authApi = {
  login: (username: string, password: string) =>
    apiPost<{ token: string; user: any }>('/auth/login', { username, password }),
  
  logout: () => apiPost('/auth/logout'),
  
  getMe: () => apiGet<any>('/auth/me'),
  
  changePassword: (oldPassword: string, newPassword: string) =>
    apiPost('/auth/change-password', { oldPassword, newPassword }),
};

// 用户管理 API（管理员）
export const userApi = {
  getUsers: () => apiGet<any[]>('/users'),
  
  createUser: (username: string, password: string, isAdmin?: boolean) =>
    apiPost('/users', { username, password, isAdmin }),
  
  updateUser: (id: number, data: { username?: string; password?: string; isAdmin?: boolean }) =>
    apiPut(`/users/${id}`, data),
  
  deleteUser: (id: number) => apiDelete(`/users/${id}`),
};

// 食物记录 API
export const foodApi = {
  getFoodItems: (date?: string) => {
    const query = date ? `?date=${date}` : '';
    return apiGet<any[]>(`/food${query}`);
  },
  
  addFoodItem: (item: any) => apiPost('/food', item),
  
  updateFoodItem: (id: string, item: any) => apiPut(`/food/${id}`, item),
  
  deleteFoodItem: (id: string) => apiDelete(`/food/${id}`),
};

// 血糖记录 API
export const bloodSugarApi = {
  getBloodSugarRecords: (date?: string) => {
    const query = date ? `?date=${date}` : '';
    return apiGet<any[]>(`/blood-sugar${query}`);
  },
  
  addBloodSugarRecord: (record: any) => apiPost('/blood-sugar', record),
  
  updateBloodSugarRecord: (id: string, record: any) => apiPut(`/blood-sugar/${id}`, record),
  
  deleteBloodSugarRecord: (id: string) => apiDelete(`/blood-sugar/${id}`),
};

// 食物数据库 API（全局共享）
export const foodDatabaseApi = {
  getFoodDatabase: () => apiGet<any[]>('/food-database'),
  
  addFood: (food: any) => apiPost('/food-database', food),
  
  updateFood: (id: number, food: any) => apiPut(`/food-database/${id}`, food),
  
  deleteFood: (id: number) => apiDelete(`/food-database/${id}`),
};

