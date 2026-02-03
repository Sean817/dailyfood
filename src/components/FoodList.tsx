import { useState } from 'react';
import { FoodItem, BloodSugarRecord } from '../types';
import { FoodDetailModal } from './FoodDetailModal';

interface FoodListProps {
  items: FoodItem[];
  selectedDate: string;
  onDelete: (id: string) => void;
  bloodSugarRecords?: BloodSugarRecord[];
}

const mealTypeLabels: Record<FoodItem['mealType'], string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

// 格式化日期显示
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00'); // 添加时间避免时区问题
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
  } catch (error) {
    return dateString; // 如果格式化失败，返回原始字符串
  }
}

export function FoodList({ items, selectedDate, onDelete, bloodSugarRecords = [] }: FoodListProps) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const dayItems = items.filter((item) => item.date === selectedDate);
  const dayBloodSugarRecords = bloodSugarRecords.filter((record) => record.date === selectedDate);

  // 按餐次分组
  const groupedByMeal = dayItems.reduce(
    (acc, item) => {
      if (!acc[item.mealType]) {
        acc[item.mealType] = [];
      }
      acc[item.mealType].push(item);
      return acc;
    },
    {} as Record<FoodItem['mealType'], FoodItem[]>
  );

  // 获取餐次对应的血糖记录
  const getBloodSugarForMeal = (mealType: 'breakfast' | 'lunch' | 'dinner'): BloodSugarRecord | undefined => {
    return dayBloodSugarRecords.find(
      (record) => record.mealType === mealType && record.type !== 'fasting'
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
        <span className="hidden sm:inline">🍽️ {formatDate(selectedDate)} 食物记录</span>
        <span className="sm:hidden">🍽️ 食物记录</span>
      </h2>

      {dayItems.length === 0 ? (
        <div className="text-center text-gray-500 py-6 sm:py-8">
          <p className="text-sm sm:text-base">今天还没有记录任何食物</p>
        </div>
      ) : (

        <div className="space-y-4 sm:space-y-6">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
            const mealItems = groupedByMeal[mealType] || [];
            if (mealItems.length === 0) return null;

            const bloodSugarRecord = getBloodSugarForMeal(mealType as 'breakfast' | 'lunch' | 'dinner');

            return (
              <div key={mealType}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                    {mealTypeLabels[mealType]}
                  </h3>
                  {bloodSugarRecord && (
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <span className="text-gray-600">餐后2h血糖：</span>
                      <span className={`font-bold ${
                        bloodSugarRecord.value < 7.8 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {bloodSugarRecord.value} mmol/L
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {mealItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-medium text-sm sm:text-base text-gray-800 truncate">{item.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {item.amount}g · {item.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => setSelectedFood(item)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                          title="查看详情"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="删除"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* 营养成分详情模态框 */}
      {selectedFood && (
        <FoodDetailModal
          foodItem={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
}

