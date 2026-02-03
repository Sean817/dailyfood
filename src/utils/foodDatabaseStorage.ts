import { FoodDatabaseItem } from '../types';
import { foodDatabase as defaultFoodDatabase } from '../data/foodDatabase';
import { foodDatabaseApi } from './api';

// 从服务器加载食物数据库（全局共享）
export async function loadFoodDatabase(): Promise<FoodDatabaseItem[]> {
  try {
    const database = await foodDatabaseApi.getFoodDatabase();
    if (database && database.length > 0) {
      return database;
    }
    // 如果服务器数据库为空，返回默认数据库
    return defaultFoodDatabase;
  } catch (error) {
    console.error('加载食物数据库失败:', error);
    // 网络错误时返回默认数据库
    return defaultFoodDatabase;
  }
}

// 同步加载（用于初始化，返回默认数据库）
export function loadFoodDatabaseSync(): FoodDatabaseItem[] {
  return defaultFoodDatabase;
}

// 保存食物数据库到服务器（仅管理员）
export async function saveFoodDatabase(database: FoodDatabaseItem[]): Promise<void> {
  try {
    // 这里可以添加批量保存接口，或者逐个保存
    // 简化处理：只保存新增或修改的食物
    for (const item of database) {
      try {
        await foodDatabaseApi.addFood({
          name: item.name,
          category: item.category,
          nutritionPer100g: item.nutritionPer100g,
        });
      } catch (error: any) {
        // 如果食物已存在，尝试更新
        if (error.message?.includes('已存在')) {
          // 需要先获取 ID，这里简化处理
          console.log(`食物 ${item.name} 已存在，跳过`);
        }
      }
    }
  } catch (error) {
    console.error('保存食物数据库失败:', error);
    throw error;
  }
}

// 添加食物到数据库（仅管理员）
export async function addFoodToDatabase(food: FoodDatabaseItem): Promise<void> {
  try {
    await foodDatabaseApi.addFood({
      name: food.name,
      category: food.category,
      nutritionPer100g: food.nutritionPer100g,
    });
  } catch (error) {
    console.error('添加食物失败:', error);
    throw error;
  }
}

// 更新食物（仅管理员）
export async function updateFoodInDatabase(id: number, food: FoodDatabaseItem): Promise<void> {
  try {
    await foodDatabaseApi.updateFood(id, {
      name: food.name,
      category: food.category,
      nutritionPer100g: food.nutritionPer100g,
    });
  } catch (error) {
    console.error('更新食物失败:', error);
    throw error;
  }
}

// 删除食物（仅管理员）
export async function deleteFoodFromDatabase(id: number): Promise<void> {
  try {
    await foodDatabaseApi.deleteFood(id);
  } catch (error) {
    console.error('删除食物失败:', error);
    throw error;
  }
}

// 重置为默认数据库（仅管理员）
export function resetToDefaultDatabase(): FoodDatabaseItem[] {
  return defaultFoodDatabase;
}

// 导出数据库为JSON
export function exportDatabase(database: FoodDatabaseItem[]): string {
  return JSON.stringify(database, null, 2);
}

// 导入数据库（仅管理员）
export async function importDatabase(jsonString: string): Promise<FoodDatabaseItem[] | null> {
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
        await saveFoodDatabase(database);
        return database;
      }
    }
    return null;
  } catch (error) {
    console.error('导入食物数据库失败:', error);
    return null;
  }
}
