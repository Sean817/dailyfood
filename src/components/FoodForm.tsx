import { useState, useEffect } from 'react';
import { FoodItem, FoodDatabaseItem } from '../types';
import { getFoodDatabase, getFoodInfo, clearFoodDatabaseCache } from '../data/foodDatabase';

interface FoodFormProps {
  onSubmit: (item: FoodItem) => void;
  selectedDate: string;
  databaseVersion?: number; // 用于监听数据库变化
}

interface FoodFormProps {
  onSubmit: (item: FoodItem) => void;
  selectedDate: string;
}

export function FoodForm({ onSubmit, selectedDate, databaseVersion = 0 }: FoodFormProps) {
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [mealType, setMealType] = useState<FoodItem['mealType']>('breakfast');
  const [foodDatabase, setFoodDatabase] = useState<FoodDatabaseItem[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !amount.trim()) return;

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

    onSubmit(item);
    setFoodName('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🍽️ 食物记录</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            食物名称
          </label>
          <select
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
            style={{ color: '#111827' }}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              数量（克）
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              min="0"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              style={{ color: '#111827' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              餐次
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as FoodItem['mealType'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              style={{ color: '#111827' }}
            >
              <option value="breakfast">早餐</option>
              <option value="lunch">午餐</option>
              <option value="dinner">晚餐</option>
              <option value="snack">加餐</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          添加
        </button>
      </div>
    </form>
  );
}

