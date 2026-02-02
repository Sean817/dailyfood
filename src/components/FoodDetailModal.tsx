import { FoodItem } from '../types';
import { calculateNutrition, getNutritionPercentage, pregnancyTargets } from '../utils/nutrition';
import { getFoodInfo } from '../data/foodDatabase';

interface FoodDetailModalProps {
  foodItem: FoodItem | null;
  onClose: () => void;
}

export function FoodDetailModal({ foodItem, onClose }: FoodDetailModalProps) {
  if (!foodItem) return null;

  const nutrition = calculateNutrition(foodItem);
  const foodInfo = getFoodInfo(foodItem.name);
  const nutritionPer100g = foodInfo?.nutritionPer100g || {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    folate: 0,
    vitaminC: 0,
    vitaminA: 0,
  };

  const nutritionItems = [
    { label: '热量', value: nutrition.calories, unit: '千卡', per100g: nutritionPer100g.calories, target: pregnancyTargets.calories },
    { label: '蛋白质', value: nutrition.protein, unit: 'g', per100g: nutritionPer100g.protein, target: pregnancyTargets.protein },
    { label: '脂肪', value: nutrition.fat, unit: 'g', per100g: nutritionPer100g.fat, target: pregnancyTargets.fat },
    { label: '碳水化合物', value: nutrition.carbs, unit: 'g', per100g: nutritionPer100g.carbs, target: pregnancyTargets.carbs },
    { label: '膳食纤维', value: nutrition.fiber, unit: 'g', per100g: nutritionPer100g.fiber, target: pregnancyTargets.fiber },
    { label: '钙', value: nutrition.calcium, unit: 'mg', per100g: nutritionPer100g.calcium, target: pregnancyTargets.calcium },
    { label: '铁', value: nutrition.iron, unit: 'mg', per100g: nutritionPer100g.iron, target: pregnancyTargets.iron },
    { label: '叶酸', value: nutrition.folate, unit: 'μg', per100g: nutritionPer100g.folate, target: pregnancyTargets.folate },
    { label: '维生素C', value: nutrition.vitaminC, unit: 'mg', per100g: nutritionPer100g.vitaminC, target: pregnancyTargets.vitaminC },
    { label: '维生素A', value: nutrition.vitaminA, unit: 'μg', per100g: nutritionPer100g.vitaminA, target: pregnancyTargets.vitaminA },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">营养成分详情</h2>
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
          {/* 食物信息 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{foodItem.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>分类：{foodItem.category}</p>
              <p>数量：{foodItem.amount} {foodItem.unit}</p>
              <p>餐次：{foodItem.mealType === 'breakfast' ? '早餐' : foodItem.mealType === 'lunch' ? '午餐' : foodItem.mealType === 'dinner' ? '晚餐' : '加餐'}</p>
            </div>
          </div>

          {/* 营养成分表格 */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">营养成分</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">营养素</th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      {foodItem.amount}g
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      每100g
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      每日建议
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionItems.map((item, index) => {
                    const percentage = getNutritionPercentage(item.value, item.target);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                          {item.label}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-800 font-medium">
                          {item.value.toFixed(1)} {item.unit}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-600">
                          {item.per100g.toFixed(1)} {item.unit}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-600">
                          {item.target} {item.unit}
                          <span className={`ml-2 text-xs ${
                            percentage >= 100 ? 'text-red-600' : percentage >= 80 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            ({percentage}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 说明 */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>说明：</strong>营养成分基于 {foodItem.amount}g {foodItem.name} 计算。
              每100g的营养值仅供参考，实际营养可能因品种、产地等因素有所差异。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

