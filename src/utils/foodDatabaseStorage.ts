import { FoodDatabaseItem } from '../types';
import { foodDatabase as defaultFoodDatabase, clearFoodDatabaseCache } from '../data/foodDatabase';

const STORAGE_KEY = 'dailyfood_database';

// 从本地存储加载食物数据库
export function loadFoodDatabase(): FoodDatabaseItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // 如果没有本地数据，返回默认数据库
    return defaultFoodDatabase;
  } catch (error) {
    console.error('加载食物数据库失败:', error);
    return defaultFoodDatabase;
  }
}

// 保存食物数据库到本地存储
export function saveFoodDatabase(database: FoodDatabaseItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    clearFoodDatabaseCache(); // 清除缓存
  } catch (error) {
    console.error('保存食物数据库失败:', error);
  }
}

// 重置为默认数据库
export function resetToDefaultDatabase(): FoodDatabaseItem[] {
  saveFoodDatabase(defaultFoodDatabase);
  return defaultFoodDatabase;
}

// 导出数据库为JSON
export function exportDatabase(database: FoodDatabaseItem[]): string {
  return JSON.stringify(database, null, 2);
}

// 导入数据库
export function importDatabase(jsonString: string): FoodDatabaseItem[] | null {
  try {
    const database = JSON.parse(jsonString);
    if (Array.isArray(database) && database.length > 0) {
      // 验证数据结构
      const isValid = database.every((item: any) => 
        item.name && 
        item.category && 
        item.nutritionPer100g &&
        typeof item.nutritionPer100g.calories === 'number'
      );
      if (isValid) {
        saveFoodDatabase(database);
        return database;
      }
    }
    return null;
  } catch (error) {
    console.error('导入食物数据库失败:', error);
    return null;
  }
}

