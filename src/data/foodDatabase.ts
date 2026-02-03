import { FoodDatabaseItem } from '../types';

// 常见食物营养数据库（每100g）
export const foodDatabase: FoodDatabaseItem[] = [
  // 主食类
  {
    name: '米饭',
    category: '主食',
    nutritionPer100g: {
      calories: 116,
      protein: 2.6,
      fat: 0.3,
      carbs: 25.9,
      fiber: 0.3,
      calcium: 7,
      iron: 0.8,
      folate: 3,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '面条',
    category: '主食',
    nutritionPer100g: {
      calories: 109,
      protein: 4.2,
      fat: 0.7,
      carbs: 22.2,
      fiber: 1.2,
      calcium: 11,
      iron: 1.2,
      folate: 8,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '全麦面包',
    category: '主食',
    nutritionPer100g: {
      calories: 247,
      protein: 13,
      fat: 4.2,
      carbs: 41,
      fiber: 7,
      calcium: 54,
      iron: 3.6,
      folate: 38,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '燕麦',
    category: '主食',
    nutritionPer100g: {
      calories: 389,
      protein: 16.9,
      fat: 6.9,
      carbs: 66.3,
      fiber: 10.6,
      calcium: 54,
      iron: 4.7,
      folate: 56,
      vitaminC: 0,
      vitaminA: 0,
    },
  },

  // 蛋白质类
  {
    name: '鸡蛋',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 144,
      protein: 13.3,
      fat: 8.8,
      carbs: 2.8,
      fiber: 0,
      calcium: 56,
      iron: 2,
      folate: 44,
      vitaminC: 0,
      vitaminA: 140,
    },
  },
  {
    name: '鸡胸肉',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 165,
      protein: 31,
      fat: 3.6,
      carbs: 0,
      fiber: 0,
      calcium: 15,
      iron: 0.9,
      folate: 4,
      vitaminC: 0,
      vitaminA: 9,
    },
  },
  {
    name: '瘦猪肉',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 143,
      protein: 20.3,
      fat: 6.2,
      carbs: 0,
      fiber: 0,
      calcium: 6,
      iron: 2.3,
      folate: 3,
      vitaminC: 0,
      vitaminA: 2,
    },
  },
  {
    name: '牛肉',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 250,
      protein: 26,
      fat: 15,
      carbs: 0,
      fiber: 0,
      calcium: 9,
      iron: 2.6,
      folate: 6,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '三文鱼',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 208,
      protein: 20,
      fat: 13,
      carbs: 0,
      fiber: 0,
      calcium: 12,
      iron: 0.8,
      folate: 4,
      vitaminC: 0,
      vitaminA: 12,
    },
  },
  {
    name: '豆腐',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 81,
      protein: 8.1,
      fat: 4.2,
      carbs: 3.8,
      fiber: 0.4,
      calcium: 164,
      iron: 1.9,
      folate: 15,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '牛奶',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 54,
      protein: 3,
      fat: 3.2,
      carbs: 3.4,
      fiber: 0,
      calcium: 104,
      iron: 0.1,
      folate: 5,
      vitaminC: 1,
      vitaminA: 24,
    },
  },
  {
    name: '酸奶',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 99,
      protein: 3,
      fat: 3.3,
      carbs: 14,
      fiber: 0,
      calcium: 110,
      iron: 0.1,
      folate: 11,
      vitaminC: 0,
      vitaminA: 27,
    },
  },

  // 蔬菜类
  {
    name: '菠菜',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 23,
      protein: 2.9,
      fat: 0.4,
      carbs: 3.6,
      fiber: 2.2,
      calcium: 99,
      iron: 2.7,
      folate: 194,
      vitaminC: 28,
      vitaminA: 469,
    },
  },
  {
    name: '西兰花',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 34,
      protein: 2.8,
      fat: 0.4,
      carbs: 6.6,
      fiber: 2.6,
      calcium: 47,
      iron: 0.7,
      folate: 63,
      vitaminC: 89,
      vitaminA: 31,
    },
  },
  {
    name: '胡萝卜',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 41,
      protein: 0.9,
      fat: 0.2,
      carbs: 9.6,
      fiber: 2.8,
      calcium: 33,
      iron: 0.3,
      folate: 19,
      vitaminC: 5.9,
      vitaminA: 835,
    },
  },
  {
    name: '番茄',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 18,
      protein: 0.9,
      fat: 0.2,
      carbs: 3.9,
      fiber: 1.2,
      calcium: 10,
      iron: 0.3,
      folate: 15,
      vitaminC: 14,
      vitaminA: 42,
    },
  },
  {
    name: '黄瓜',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 16,
      protein: 0.7,
      fat: 0.1,
      carbs: 3.6,
      fiber: 0.5,
      calcium: 16,
      iron: 0.3,
      folate: 7,
      vitaminC: 2.8,
      vitaminA: 5,
    },
  },
  {
    name: '白菜',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 16,
      protein: 1.5,
      fat: 0.2,
      carbs: 3.2,
      fiber: 1,
      calcium: 50,
      iron: 0.6,
      folate: 43,
      vitaminC: 31,
      vitaminA: 2,
    },
  },

  // 水果类
  {
    name: '苹果',
    category: '水果',
    nutritionPer100g: {
      calories: 52,
      protein: 0.3,
      fat: 0.2,
      carbs: 13.8,
      fiber: 2.4,
      calcium: 6,
      iron: 0.1,
      folate: 3,
      vitaminC: 4.6,
      vitaminA: 3,
    },
  },
  {
    name: '香蕉',
    category: '水果',
    nutritionPer100g: {
      calories: 89,
      protein: 1.1,
      fat: 0.3,
      carbs: 22.8,
      fiber: 2.6,
      calcium: 5,
      iron: 0.3,
      folate: 20,
      vitaminC: 8.7,
      vitaminA: 3,
    },
  },
  {
    name: '橙子',
    category: '水果',
    nutritionPer100g: {
      calories: 47,
      protein: 0.9,
      fat: 0.1,
      carbs: 11.8,
      fiber: 2.4,
      calcium: 40,
      iron: 0.1,
      folate: 30,
      vitaminC: 53,
      vitaminA: 11,
    },
  },
  {
    name: '草莓',
    category: '水果',
    nutritionPer100g: {
      calories: 32,
      protein: 0.7,
      fat: 0.3,
      carbs: 7.7,
      fiber: 2,
      calcium: 16,
      iron: 0.4,
      folate: 24,
      vitaminC: 59,
      vitaminA: 1,
    },
  },
  {
    name: '葡萄',
    category: '水果',
    nutritionPer100g: {
      calories: 69,
      protein: 0.7,
      fat: 0.2,
      carbs: 18,
      fiber: 0.9,
      calcium: 10,
      iron: 0.4,
      folate: 2,
      vitaminC: 4,
      vitaminA: 3,
    },
  },

  // 坚果类
  {
    name: '核桃',
    category: '坚果',
    nutritionPer100g: {
      calories: 654,
      protein: 15.2,
      fat: 65.2,
      carbs: 13.7,
      fiber: 6.7,
      calcium: 98,
      iron: 2.9,
      folate: 98,
      vitaminC: 1.3,
      vitaminA: 1,
    },
  },
  {
    name: '杏仁',
    category: '坚果',
    nutritionPer100g: {
      calories: 579,
      protein: 21.2,
      fat: 49.9,
      carbs: 21.6,
      fiber: 12.5,
      calcium: 269,
      iron: 3.7,
      folate: 44,
      vitaminC: 0,
      vitaminA: 0,
    },
  },

  // 新增食物
  {
    name: '菜花',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 25,
      protein: 2.1,
      fat: 0.2,
      carbs: 4.6,
      fiber: 2.1,
      calcium: 23,
      iron: 0.4,
      folate: 57,
      vitaminC: 61,
      vitaminA: 1,
    },
  },
  {
    name: '老鸭',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 183,
      protein: 19.7,
      fat: 9.7,
      carbs: 0,
      fiber: 0,
      calcium: 12,
      iron: 2.2,
      folate: 5,
      vitaminC: 0,
      vitaminA: 52,
    },
  },
  {
    name: '甜豆',
    category: '蔬菜',
    nutritionPer100g: {
      calories: 81,
      protein: 5.4,
      fat: 0.4,
      carbs: 14.4,
      fiber: 5.1,
      calcium: 43,
      iron: 1.5,
      folate: 65,
      vitaminC: 40,
      vitaminA: 38,
    },
  },
  {
    name: '杂粮饭',
    category: '主食',
    nutritionPer100g: {
      calories: 124,
      protein: 3.2,
      fat: 0.5,
      carbs: 26.8,
      fiber: 1.8,
      calcium: 12,
      iron: 1.1,
      folate: 12,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '面包',
    category: '主食',
    nutritionPer100g: {
      calories: 265,
      protein: 9,
      fat: 3.2,
      carbs: 49,
      fiber: 2.7,
      calcium: 105,
      iron: 3.6,
      folate: 38,
      vitaminC: 0,
      vitaminA: 0,
    },
  },
  {
    name: '鸽子蛋',
    category: '蛋白质',
    nutritionPer100g: {
      calories: 160,
      protein: 13.5,
      fat: 11.1,
      carbs: 1.5,
      fiber: 0,
      calcium: 64,
      iron: 3.2,
      folate: 65,
      vitaminC: 0,
      vitaminA: 294,
    },
  },
  {
    name: '车厘子',
    category: '水果',
    nutritionPer100g: {
      calories: 63,
      protein: 1,
      fat: 0.2,
      carbs: 16,
      fiber: 2.1,
      calcium: 13,
      iron: 0.4,
      folate: 4,
      vitaminC: 7,
      vitaminA: 3,
    },
  },
];

// 获取当前食物数据库（从存储或默认）
let cachedDatabase: FoodDatabaseItem[] | null = null;

export function getFoodDatabase(): FoodDatabaseItem[] {
  if (cachedDatabase) return cachedDatabase;
  
  try {
    // 尝试从localStorage加载
    const data = localStorage.getItem('dailyfood_database');
    if (data) {
      cachedDatabase = JSON.parse(data);
      return cachedDatabase!;
    }
  } catch (error) {
    console.error('加载食物数据库失败:', error);
  }
  
  // 返回默认数据库
  cachedDatabase = foodDatabase;
  return cachedDatabase;
}

// 清除缓存（当数据库更新时调用）
export function clearFoodDatabaseCache(): void {
  cachedDatabase = null;
}

// 获取食物信息
export function getFoodInfo(name: string): FoodDatabaseItem | undefined {
  const db = getFoodDatabase();
  return db.find(
    (food) => food.name.toLowerCase() === name.toLowerCase()
  );
}

// 搜索食物
export function searchFoods(query: string): FoodDatabaseItem[] {
  const db = getFoodDatabase();
  const lowerQuery = query.toLowerCase();
  return db.filter(
    (food) =>
      food.name.toLowerCase().includes(lowerQuery) ||
      food.category.toLowerCase().includes(lowerQuery)
  );
}

