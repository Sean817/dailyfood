import { useState, useEffect } from 'react';
import { FoodItem, BloodSugarRecord } from './types';
import { FoodForm } from './components/FoodForm';
import { FoodList } from './components/FoodList';
import { NutritionAnalysis } from './components/NutritionAnalysis';
import { Navbar } from './components/Navbar';
import { CalendarView } from './components/CalendarView';
import { FoodDatabaseManager } from './components/FoodDatabaseManager';
import { Login } from './components/Login';
import { AccountManager } from './components/AccountManager';
import { BloodSugarForm } from './components/BloodSugarForm';
import { BloodSugarList } from './components/BloodSugarList';
import { loadFoodItems, saveFoodItems, deleteFoodItem } from './utils/storage';
import { calculateDailyNutrition } from './utils/nutrition';
import { checkAuth, logout, AuthState } from './utils/auth';
import { loadBloodSugarRecords, addBloodSugarRecord, deleteBloodSugarRecord, updateBloodSugarRecord } from './utils/bloodSugarStorage';

function App() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [bloodSugarRecords, setBloodSugarRecords] = useState<BloodSugarRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);
  const [showAccountManager, setShowAccountManager] = useState(false);
  const [databaseVersion, setDatabaseVersion] = useState(0); // 用于触发重新加载
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, username: null });

  useEffect(() => {
    // 加载本地存储的数据
    const items = loadFoodItems();
    setFoodItems(items);
    const records = loadBloodSugarRecords();
    setBloodSugarRecords(records);
    // 检查登录状态
    const auth = checkAuth();
    setAuthState(auth);
    // 未登录时会在渲染时自动显示登录界面
  }, []);

  const handleShowDatabaseManager = () => {
    const auth = checkAuth();
    if (auth.isAuthenticated) {
      setShowDatabaseManager(true);
    }
    // 如果未登录，登录界面会自动显示（通过渲染逻辑）
  };

  const handleLoginSuccess = () => {
    const auth = checkAuth();
    setAuthState(auth);
  };

  const handleLogout = () => {
    logout();
    setAuthState({ isAuthenticated: false, username: null });
    if (showDatabaseManager) {
      setShowDatabaseManager(false);
    }
    if (showAccountManager) {
      setShowAccountManager(false);
    }
    // 登出后会自动显示登录界面（通过渲染逻辑）
  };

  const handleAddFood = (item: FoodItem) => {
    const newItems = [...foodItems, item];
    setFoodItems(newItems);
    saveFoodItems(newItems);
  };

  const handleDeleteFood = (id: string) => {
    const newItems = foodItems.filter((item) => item.id !== id);
    setFoodItems(newItems);
    deleteFoodItem(id);
  };

  const handleAddBloodSugar = (record: BloodSugarRecord) => {
    // 检查是否已存在相同日期和类型的记录
    const existingIndex = bloodSugarRecords.findIndex(
      (r) => r.date === record.date && r.type === record.type
    );

    if (existingIndex >= 0) {
      // 更新已有记录
      const newRecords = [...bloodSugarRecords];
      newRecords[existingIndex] = record;
      setBloodSugarRecords(newRecords);
      updateBloodSugarRecord(record);
    } else {
      // 添加新记录
      const newRecords = [...bloodSugarRecords, record];
      setBloodSugarRecords(newRecords);
      addBloodSugarRecord(record);
    }
  };

  const handleDeleteBloodSugar = (id: string) => {
    const newRecords = bloodSugarRecords.filter((record) => record.id !== id);
    setBloodSugarRecords(newRecords);
    deleteBloodSugarRecord(id);
  };

  const dailyNutrition = calculateDailyNutrition(foodItems, selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 如果未登录，只显示登录界面 */}
      {!authState.isAuthenticated ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <>
          {/* 导航栏 */}
          <Navbar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onShowCalendar={() => setShowCalendar(true)}
            onShowDatabaseManager={handleShowDatabaseManager}
            onShowAccountManager={() => setShowAccountManager(true)}
            authState={authState}
            foodItems={foodItems}
          />

          <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 头部说明 */}
        <header className="text-center mb-8">
          <p className="text-gray-600">记录每日饮食，科学管理营养摄入</p>
        </header>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 左侧：表单区域 */}
          <div className="space-y-6">
            {/* 添加食物表单 */}
            <FoodForm onSubmit={handleAddFood} selectedDate={selectedDate} databaseVersion={databaseVersion} />
            
            {/* 添加血糖记录表单 */}
            <BloodSugarForm 
              onSubmit={handleAddBloodSugar} 
              selectedDate={selectedDate}
              existingRecords={bloodSugarRecords}
            />
          </div>

          {/* 右侧：结果区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 食物清单 */}
            <FoodList
              items={foodItems}
              selectedDate={selectedDate}
              onDelete={handleDeleteFood}
              bloodSugarRecords={bloodSugarRecords}
            />

            {/* 血糖记录列表 */}
            <BloodSugarList
              records={bloodSugarRecords}
              selectedDate={selectedDate}
              onDelete={handleDeleteBloodSugar}
            />

            {/* 营养分析 */}
            <NutritionAnalysis dailyNutrition={dailyNutrition} />
          </div>
        </div>

            {/* 页脚 */}
            <footer className="mt-8 text-center text-gray-500 text-sm">
              <p>💡 提示：本应用仅供参考，具体营养需求请咨询专业医生</p>
            </footer>
          </div>

          {/* 日历视图 */}
          {showCalendar && (
            <CalendarView
              foodItems={foodItems}
              bloodSugarRecords={bloodSugarRecords}
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              onClose={() => setShowCalendar(false)}
            />
          )}

          {/* 账号管理 */}
          {showAccountManager && (
            <AccountManager
              onClose={() => setShowAccountManager(false)}
              onLogout={handleLogout}
            />
          )}

          {/* 食物数据库管理 */}
          {showDatabaseManager && (
            <FoodDatabaseManager
              onClose={() => setShowDatabaseManager(false)}
              onDatabaseChange={() => {
                setDatabaseVersion(v => v + 1); // 触发重新加载
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

