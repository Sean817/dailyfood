import { useState, useEffect } from 'react';
import { getAccountInfo, changePassword, logout } from '../utils/auth';

interface AccountManagerProps {
  onClose: () => void;
  onLogout: () => void;
}

export function AccountManager({ onClose, onLogout }: AccountManagerProps) {
  const [accountInfo, setAccountInfo] = useState({ username: '', loginTime: null as string | null });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const info = getAccountInfo();
    setAccountInfo(info);
  }, []);

  const handleChangePassword = () => {
    setMessage(null);
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: '请填写所有字段' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: '新密码长度至少4位' });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const result = changePassword(oldPassword, newPassword);
      setIsLoading(false);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onLogout();
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    }, 300);
  };

  const handleLogout = () => {
    if (confirm('确定要登出吗？')) {
      logout();
      onLogout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 头部 */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">账号管理</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {!showChangePassword ? (
            /* 账号信息 */
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">账号信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">用户名</span>
                    <span className="text-sm text-gray-800">{accountInfo.username}</span>
                  </div>
                  {accountInfo.loginTime && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">登录时间</span>
                      <span className="text-sm text-gray-800">{accountInfo.loginTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  修改密码
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  登出
                </button>
              </div>
            </div>
          ) : (
            /* 修改密码表单 */
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setMessage(null);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm mb-4 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">修改密码</h3>
              </div>

              {message && (
                <div
                  className={`px-4 py-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    原密码
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    style={{ color: '#111827' }}
                    placeholder="请输入原密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新密码
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    style={{ color: '#111827' }}
                    placeholder="请输入新密码（至少4位）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    style={{ color: '#111827' }}
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setMessage(null);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  取消
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? '修改中...' : '确认修改'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

