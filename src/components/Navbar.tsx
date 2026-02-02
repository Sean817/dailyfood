import { FoodItem } from '../types';
import { AuthState } from '../utils/auth';

interface NavbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onShowCalendar: () => void;
  onShowDatabaseManager: () => void;
  onShowAccountManager: () => void;
  authState: AuthState;
  foodItems: FoodItem[];
}

export function Navbar({ selectedDate, onDateChange, onShowCalendar, onShowDatabaseManager, onShowAccountManager, authState, foodItems }: NavbarProps) {
  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;

  // 获取有记录的日期数量
  const datesWithRecords = new Set(foodItems.map(item => item.date)).size;

  // 快速导航：前一天/后一天
  const goToPreviousDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    onDateChange(today);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 左侧：Logo和标题 */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              🤰 孕妇饮食记录
            </h1>
            <span className="text-sm text-gray-500 hidden md:inline">
              已记录 {datesWithRecords} 天
            </span>
          </div>

          {/* 中间：日期导航 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousDay}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="前一天"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={onShowCalendar}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <span className="hidden sm:inline">📅 </span>
              {selectedDate === today ? '今天' : (() => {
                const date = new Date(selectedDate + 'T00:00:00');
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${month}月${day}日`;
              })()}
            </button>

            <button
              onClick={goToNextDay}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="后一天"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {!isToday && (
              <button
                onClick={goToToday}
                className="ml-2 px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title="回到今天"
              >
                今天
              </button>
            )}
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onShowDatabaseManager}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title={authState.isAuthenticated ? "管理食物数据库" : "登录以管理数据库"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <button
              onClick={onShowCalendar}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="查看日历"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            {authState.isAuthenticated && (
              <button
                onClick={onShowAccountManager}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
                title="账号管理"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-600 hidden sm:inline">{authState.username}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

