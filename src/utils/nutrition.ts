import { FoodItem, NutritionInfo, DailyNutrition, PregnancyNutritionTarget } from '../types';
import { getFoodInfo } from '../data/foodDatabase';

// 孕妇营养建议（每日，根据孕中期标准）
export const pregnancyTargets: PregnancyNutritionTarget = {
  calories: 2200, // 千卡
  protein: 75, // 克
  fat: 73, // 克（约30%总热量）
  carbs: 275, // 克（约50%总热量）
  fiber: 28, // 克
  calcium: 1000, // 毫克
  iron: 27, // 毫克
  folate: 600, // 微克
  vitaminC: 85, // 毫克
  vitaminA: 770, // 微克
};

// 计算食物的营养信息
export function calculateNutrition(foodItem: FoodItem): NutritionInfo {
  const foodInfo = getFoodInfo(foodItem.name);
  if (!foodInfo) {
    // 如果找不到食物信息，返回零值
    return {
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
  }

  const ratio = foodItem.amount / 100; // 转换为100g的倍数
  const nutrition = foodInfo.nutritionPer100g;

  return {
    calories: Math.round(nutrition.calories * ratio * 10) / 10,
    protein: Math.round(nutrition.protein * ratio * 10) / 10,
    fat: Math.round(nutrition.fat * ratio * 10) / 10,
    carbs: Math.round(nutrition.carbs * ratio * 10) / 10,
    fiber: Math.round(nutrition.fiber * ratio * 10) / 10,
    calcium: Math.round(nutrition.calcium * ratio * 10) / 10,
    iron: Math.round(nutrition.iron * ratio * 10) / 10,
    folate: Math.round(nutrition.folate * ratio * 10) / 10,
    vitaminC: Math.round(nutrition.vitaminC * ratio * 10) / 10,
    vitaminA: Math.round(nutrition.vitaminA * ratio * 10) / 10,
  };
}

// 合并营养信息
export function combineNutrition(nutritions: NutritionInfo[]): NutritionInfo {
  return nutritions.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      fat: acc.fat + curr.fat,
      carbs: acc.carbs + curr.carbs,
      fiber: acc.fiber + curr.fiber,
      calcium: acc.calcium + curr.calcium,
      iron: acc.iron + curr.iron,
      folate: acc.folate + curr.folate,
      vitaminC: acc.vitaminC + curr.vitaminC,
      vitaminA: acc.vitaminA + curr.vitaminA,
    }),
    {
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
    }
  );
}

// 计算每日营养汇总
export function calculateDailyNutrition(
  foodItems: FoodItem[],
  date: string
): DailyNutrition {
  const dayItems = foodItems.filter((item) => item.date === date);

  const byMeal = {
    breakfast: combineNutrition(
      dayItems
        .filter((item) => item.mealType === 'breakfast')
        .map(calculateNutrition)
    ),
    lunch: combineNutrition(
      dayItems
        .filter((item) => item.mealType === 'lunch')
        .map(calculateNutrition)
    ),
    dinner: combineNutrition(
      dayItems
        .filter((item) => item.mealType === 'dinner')
        .map(calculateNutrition)
    ),
    snack: combineNutrition(
      dayItems
        .filter((item) => item.mealType === 'snack')
        .map(calculateNutrition)
    ),
  };

  return {
    date,
    total: combineNutrition([
      byMeal.breakfast,
      byMeal.lunch,
      byMeal.dinner,
      byMeal.snack,
    ]),
    byMeal,
  };
}

// 计算营养达标百分比
export function getNutritionPercentage(
  actual: number,
  target: number
): number {
  if (target === 0) return 100;
  return Math.min(100, Math.round((actual / target) * 100));
}

