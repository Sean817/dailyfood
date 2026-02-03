import { authApi, getToken, setToken, removeToken } from './api';

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

let currentUser: { id: number; username: string; isAdmin: boolean } | null = null;

// 检查是否已登录
export async function checkAuth(): Promise<AuthState> {
  const token = getToken();
  
  if (!token) {
    return {
      isAuthenticated: false,
      username: null,
    };
  }

  try {
    // 验证 token 是否有效
    const user = await authApi.getMe();
    currentUser = user;
    return {
      isAuthenticated: true,
      username: user.username,
    };
  } catch (error) {
    // Token 无效，清除
    removeToken();
    currentUser = null;
    return {
      isAuthenticated: false,
      username: null,
    };
  }
}

// 同步检查（用于初始化，不进行 API 调用）
export function checkAuthSync(): AuthState {
  const token = getToken();
  return {
    isAuthenticated: !!token,
    username: currentUser?.username || null,
  };
}

// 登录
export async function login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await authApi.login(username, password);
    setToken(response.token);
    currentUser = response.user;
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '登录失败',
    };
  }
}

// 修改密码
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    await authApi.changePassword(oldPassword, newPassword);
    // 修改密码后需要重新登录
    logout();
    return { success: true, message: '密码修改成功，请重新登录' };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '密码修改失败',
    };
  }
}

// 获取账号信息
export async function getAccountInfo(): Promise<{ username: string; loginTime: string | null }> {
  try {
    if (!currentUser) {
      const user = await authApi.getMe();
      currentUser = user;
    }
    
    return {
      username: currentUser.username,
      loginTime: new Date().toLocaleString('zh-CN'), // 可以从 token 中解析，这里简化处理
    };
  } catch (error) {
    console.error('获取账号信息失败:', error);
    return {
      username: '未知',
      loginTime: null,
    };
  }
}

// 登出
export async function logout(): Promise<void> {
  try {
    await authApi.logout();
  } catch (error) {
    // 忽略登出错误
  } finally {
    removeToken();
    currentUser = null;
  }
}

// 检查是否为管理员
export function isAdmin(): boolean {
  return currentUser?.isAdmin || false;
}

// 获取当前用户信息
export function getCurrentUser() {
  return currentUser;
}
