import { useState, useEffect } from 'react';
import { FoodItem, FoodDatabaseItem } from '../types';
import { getFoodDatabase, getFoodInfo, clearFoodDatabaseCache } from '../data/foodDatabase';

interface FoodFormProps {
  onSubmit: (item: FoodItem) => void;
  selectedDate: string;
  databaseVersion?: number; // 用于监听数据库变化
}

export function FoodForm({ onSubmit, selectedDate, databaseVersion = 0 }: FoodFormProps) {
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [mealType, setMealType] = useState<FoodItem['mealType']>('breakfast');
  const [foodDatabase, setFoodDatabase] = useState<FoodDatabaseItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ foodName?: string; amount?: string }>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // 加载最新的食物数据库
    clearFoodDatabaseCache();
    setFoodDatabase(getFoodDatabase());
  }, [databaseVersion]);

  // 按分类分组食物
  const foodsByCategory = foodDatabase.reduce((acc, food) => {
    if (!acc[food.category]) {
      acc[food.category] = [];
    }
    acc[food.category].push(food);
    return acc;
  }, {} as Record<string, FoodDatabaseItem[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    // 验证表单
    const newErrors: { foodName?: string; amount?: string } = {};
    if (!foodName.trim()) {
      newErrors.foodName = '请选择食物名称';
    }
    if (!amount.trim()) {
      newErrors.amount = '请输入食物数量';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = '请输入有效的数量（大于0）';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const foodInfo = getFoodInfo(foodName);
      const item: FoodItem = {
        id: Date.now().toString(),
        name: foodName.trim(),
        category: foodInfo?.category || '其他',
        amount: parseFloat(amount) || 0,
        unit: 'g',
        date: selectedDate,
        mealType,
      };

      await onSubmit(item);
      setFoodName('');
      setAmount('');
      setErrors({});
      setSubmitError('');
    } catch (error: any) {
      console.error('添加食物失败:', error);
      setSubmitError(error?.message || '添加食物失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">🍽️ 食物记录</h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            食物名称 <span className="text-red-500">*</span>
          </label>
          <select
            value={foodName}
            onChange={(e) => {
              setFoodName(e.target.value);
              if (errors.foodName) setErrors({ ...errors, foodName: undefined });
            }}
            className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 appearance-none cursor-pointer ${
              errors.foodName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            style={{ color: '#111827', zIndex: 1 }}
          >
            <option value="">请选择食物</option>
            {Object.entries(foodsByCategory).map(([category, foods]) => (
              <optgroup key={category} label={category}>
                {foods.map((food) => (
                  <option key={food.name} value={food.name}>
                    {food.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {/* 下拉箭头图标 */}
          <div className="absolute right-3 top-[2.5rem] bottom-2 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {errors.foodName && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.foodName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              数量（克） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              placeholder="100"
              min="0"
              step="0.1"
              className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
                errors.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              style={{ color: '#111827' }}
            />
            {errors.amount && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.amount}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              餐次
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as FoodItem['mealType'])}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 appearance-none cursor-pointer"
              style={{ color: '#111827', zIndex: 1 }}
            >
              <option value="breakfast">早餐</option>
              <option value="lunch">午餐</option>
              <option value="dinner">晚餐</option>
              <option value="snack">加餐</option>
            </select>
            {/* 下拉箭头图标 */}
            <div className="absolute right-3 top-[2.5rem] bottom-2 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? '添加中...' : '添加'}
        </button>
      </div>
    </form>
  );
}

