const STORAGE_KEY = 'dailyfood_auth';
const PASSWORD_STORAGE_KEY = 'dailyfood_password';
const ADMIN_USERNAME = '高蛋白';
const DEFAULT_PASSWORD = 'tshhw';

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

// 检查是否已登录
export function checkAuth(): AuthState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const auth = JSON.parse(data);
      // 验证token是否有效（简单的时间戳验证，24小时有效）
      if (auth.token && Date.now() - auth.timestamp < 24 * 60 * 60 * 1000) {
        return {
          isAuthenticated: true,
          username: auth.username,
        };
      }
    }
  } catch (error) {
    console.error('检查认证状态失败:', error);
  }
  return {
    isAuthenticated: false,
    username: null,
  };
}

// 获取当前密码
function getCurrentPassword(): string {
  try {
    const savedPassword = localStorage.getItem(PASSWORD_STORAGE_KEY);
    return savedPassword || DEFAULT_PASSWORD;
  } catch (error) {
    return DEFAULT_PASSWORD;
  }
}

// 登录
export function login(username: string, password: string): boolean {
  const currentPassword = getCurrentPassword();
  if (username === ADMIN_USERNAME && password === currentPassword) {
    const auth = {
      username: ADMIN_USERNAME,
      token: generateToken(),
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    return true;
  }
  return false;
}

// 修改密码
export function changePassword(oldPassword: string, newPassword: string): { success: boolean; message: string } {
  const currentPassword = getCurrentPassword();
  
  if (oldPassword !== currentPassword) {
    return { success: false, message: '原密码错误' };
  }
  
  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: '新密码长度至少4位' };
  }
  
  try {
    localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
    // 修改密码后需要重新登录
    logout();
    return { success: true, message: '密码修改成功，请重新登录' };
  } catch (error) {
    return { success: false, message: '密码修改失败' };
  }
}

// 获取账号信息
export function getAccountInfo(): { username: string; loginTime: string | null } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const auth = JSON.parse(data);
      const loginTime = auth.timestamp ? new Date(auth.timestamp).toLocaleString('zh-CN') : null;
      return {
        username: auth.username || ADMIN_USERNAME,
        loginTime,
      };
    }
  } catch (error) {
    console.error('获取账号信息失败:', error);
  }
  return {
    username: ADMIN_USERNAME,
    loginTime: null,
  };
}

// 登出
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// 生成简单token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 检查是否为管理员
export function isAdmin(): boolean {
  const auth = checkAuth();
  return auth.isAuthenticated && auth.username === ADMIN_USERNAME;
}

