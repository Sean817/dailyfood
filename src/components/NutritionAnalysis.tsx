import { DailyNutrition } from '../types';
import { pregnancyTargets } from '../utils/nutrition';
import { getNutritionPercentage } from '../utils/nutrition';

interface NutritionAnalysisProps {
  dailyNutrition: DailyNutrition;
}

export function NutritionAnalysis({ dailyNutrition }: NutritionAnalysisProps) {
  const { total } = dailyNutrition;

  const nutritionItems = [
    {
      label: '热量',
      value: total.calories,
      target: pregnancyTargets.calories,
      unit: '千卡',
      color: 'bg-blue-500',
    },
    {
      label: '蛋白质',
      value: total.protein,
      target: pregnancyTargets.protein,
      unit: 'g',
      color: 'bg-green-500',
    },
    {
      label: '脂肪',
      value: total.fat,
      target: pregnancyTargets.fat,
      unit: 'g',
      color: 'bg-yellow-500',
    },
    {
      label: '碳水化合物',
      value: total.carbs,
      target: pregnancyTargets.carbs,
      unit: 'g',
      color: 'bg-purple-500',
    },
    {
      label: '膳食纤维',
      value: total.fiber,
      target: pregnancyTargets.fiber,
      unit: 'g',
      color: 'bg-orange-500',
    },
    {
      label: '钙',
      value: total.calcium,
      target: pregnancyTargets.calcium,
      unit: 'mg',
      color: 'bg-pink-500',
    },
    {
      label: '铁',
      value: total.iron,
      target: pregnancyTargets.iron,
      unit: 'mg',
      color: 'bg-red-500',
    },
    {
      label: '叶酸',
      value: total.folate,
      target: pregnancyTargets.folate,
      unit: 'μg',
      color: 'bg-indigo-500',
    },
    {
      label: '维生素C',
      value: total.vitaminC,
      target: pregnancyTargets.vitaminC,
      unit: 'mg',
      color: 'bg-teal-500',
    },
    {
      label: '维生素A',
      value: total.vitaminA,
      target: pregnancyTargets.vitaminA,
      unit: 'μg',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">营养分析</h2>
      
      <div className="space-y-3 sm:space-y-4">
        {nutritionItems.map((item) => {
          const percentage = getNutritionPercentage(item.value, item.target);
          const isOver = item.value > item.target;

          return (
            <div key={item.label}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  <span className="sm:hidden">{item.value.toFixed(1)}/{item.target}{item.unit}</span>
                  <span className="hidden sm:inline">{item.value.toFixed(1)} / {item.target} {item.unit}</span>
                  <span
                    className={`ml-1 sm:ml-2 ${
                      isOver ? 'text-red-600' : percentage >= 80 ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    ({percentage}%)
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-300 ${
                    isOver ? 'bg-red-500' : ''
                  }`}
                  style={{
                    width: `${Math.min(100, percentage)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

