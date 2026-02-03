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
import { loadFoodItems, addFoodItem, deleteFoodItem } from './utils/storage';
import { calculateDailyNutrition } from './utils/nutrition';
import { checkAuth, checkAuthSync, logout, AuthState } from './utils/auth';
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
    // 初始化：先使用同步检查（不进行 API 调用）
    const authSync = checkAuthSync();
    setAuthState(authSync);

    // 异步加载数据和验证认证
    async function loadData() {
      try {
        // 验证认证状态
        const auth = await checkAuth();
        setAuthState(auth);

        if (auth.isAuthenticated) {
          // 加载数据
          const items = await loadFoodItems(selectedDate);
          setFoodItems(items);
          const records = await loadBloodSugarRecords(selectedDate);
          setBloodSugarRecords(records);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        // 如果认证失败，清除状态
        setAuthState({ isAuthenticated: false, username: null });
      }
    }

    loadData();
  }, []);

  // 当日期改变时重新加载数据
  useEffect(() => {
    if (authState.isAuthenticated) {
      async function loadDataForDate() {
        try {
          const items = await loadFoodItems(selectedDate);
          setFoodItems(items);
          const records = await loadBloodSugarRecords(selectedDate);
          setBloodSugarRecords(records);
        } catch (error) {
          console.error('加载数据失败:', error);
        }
      }
      loadDataForDate();
    }
  }, [selectedDate, authState.isAuthenticated]);

  const handleShowDatabaseManager = async () => {
    const auth = await checkAuth();
    if (auth.isAuthenticated) {
      setShowDatabaseManager(true);
    }
    // 如果未登录，登录界面会自动显示（通过渲染逻辑）
  };

  const handleLoginSuccess = async () => {
    const auth = await checkAuth();
    setAuthState(auth);
    // 登录成功后加载数据
    if (auth.isAuthenticated) {
      try {
        const items = await loadFoodItems(selectedDate);
        setFoodItems(items);
        const records = await loadBloodSugarRecords(selectedDate);
        setBloodSugarRecords(records);
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setFoodItems([]);
    setBloodSugarRecords([]);
    setAuthState({ isAuthenticated: false, username: null });
    if (showDatabaseManager) {
      setShowDatabaseManager(false);
    }
    if (showAccountManager) {
      setShowAccountManager(false);
    }
    // 登出后会自动显示登录界面（通过渲染逻辑）
  };

  const handleAddFood = async (item: FoodItem) => {
    try {
      await addFoodItem(item);
      // 重新加载当前日期的数据
      const items = await loadFoodItems(selectedDate);
      setFoodItems(items);
    } catch (error) {
      console.error('添加食物失败:', error);
      alert('添加食物失败，请重试');
    }
  };

  const handleDeleteFood = async (id: string) => {
    try {
      await deleteFoodItem(id);
      const newItems = foodItems.filter((item) => item.id !== id);
      setFoodItems(newItems);
    } catch (error) {
      console.error('删除食物失败:', error);
      alert('删除食物失败，请重试');
    }
  };

  const handleAddBloodSugar = async (record: BloodSugarRecord) => {
    try {
      // 检查是否已存在相同日期和类型的记录
      const existingIndex = bloodSugarRecords.findIndex(
        (r) => r.date === record.date && r.type === record.type
      );

      if (existingIndex >= 0) {
        // 更新已有记录
        await updateBloodSugarRecord(record);
      } else {
        // 添加新记录
        await addBloodSugarRecord(record);
      }
      // 重新加载当前日期的数据
      const records = await loadBloodSugarRecords(selectedDate);
      setBloodSugarRecords(records);
    } catch (error) {
      console.error('保存血糖记录失败:', error);
      alert('保存血糖记录失败，请重试');
    }
  };

  const handleDeleteBloodSugar = async (id: string) => {
    try {
      await deleteBloodSugarRecord(id);
      const newRecords = bloodSugarRecords.filter((record) => record.id !== id);
      setBloodSugarRecords(newRecords);
    } catch (error) {
      console.error('删除血糖记录失败:', error);
      alert('删除血糖记录失败，请重试');
    }
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

          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* 头部说明 */}
        <header className="text-center mb-4 sm:mb-8">
          <p className="text-sm sm:text-base text-gray-600">记录每日饮食，科学管理营养摄入</p>
        </header>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
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
            <footer className="mt-4 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm px-2">
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

