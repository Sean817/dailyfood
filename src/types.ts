// 食物项
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  amount: number; // 克数
  unit: string; // 单位：g, ml, 个等
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // 餐次
}

// 营养信息
export interface NutritionInfo {
  calories: number; // 卡路里（千卡）
  protein: number; // 蛋白质（克）
  fat: number; // 脂肪（克）
  carbs: number; // 碳水化合物（克）
  fiber: number; // 膳食纤维（克）
  calcium: number; // 钙（毫克）
  iron: number; // 铁（毫克）
  folate: number; // 叶酸（微克）
  vitaminC: number; // 维生素C（毫克）
  vitaminA: number; // 维生素A（微克）
}

// 食物数据库项
export interface FoodDatabaseItem {
  name: string;
  category: string;
  nutritionPer100g: NutritionInfo;
}

// 每日营养汇总
export interface DailyNutrition {
  date: string;
  total: NutritionInfo;
  byMeal: {
    breakfast: NutritionInfo;
    lunch: NutritionInfo;
    dinner: NutritionInfo;
    snack: NutritionInfo;
  };
}

// 孕妇营养建议（每日）
export interface PregnancyNutritionTarget {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  calcium: number;
  iron: number;
  folate: number;
  vitaminC: number;
  vitaminA: number;
}

// 血糖记录
export interface BloodSugarRecord {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'fasting' | 'after_breakfast' | 'after_lunch' | 'after_dinner'; // 空腹、早餐后2h、午餐后2h、晚餐后2h
  value: number; // 血糖值（mmol/L）
  time?: string; // 测量时间（HH:mm）
  note?: string; // 备注
  mealType?: 'breakfast' | 'lunch' | 'dinner'; // 关联的餐次（仅餐后血糖需要）
}

// 每日血糖汇总
export interface DailyBloodSugar {
  date: string;
  fasting?: number; // 空腹血糖
  afterBreakfast?: number; // 早餐后2h
  afterLunch?: number; // 午餐后2h
  afterDinner?: number; // 晚餐后2h
}

