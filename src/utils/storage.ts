import { FoodItem } from '../types';
import { foodApi } from './api';

// 保存食物记录到服务器
export async function saveFoodItems(items: FoodItem[]): Promise<void> {
  try {
    // 批量保存（可以优化为批量 API）
    // 这里简化处理，实际可以添加批量保存接口
    for (const item of items) {
      try {
        await foodApi.addFoodItem({
          name: item.name,
          category: item.category,
          amount: item.amount,
          unit: item.unit,
          date: item.date,
          mealType: item.mealType,
        });
      } catch (error) {
        // 忽略已存在的记录
      }
    }
  } catch (error) {
    console.error('保存数据失败:', error);
    throw error;
  }
}

// 从服务器加载食物记录
export async function loadFoodItems(date?: string): Promise<FoodItem[]> {
  try {
    const items = await foodApi.getFoodItems(date);
    return items.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      amount: item.amount,
      unit: item.unit,
      date: item.date,
      mealType: item.mealType,
    }));
  } catch (error) {
    console.error('加载数据失败:', error);
    return [];
  }
}

// 添加食物记录
export async function addFoodItem(item: FoodItem): Promise<void> {
  try {
    await foodApi.addFoodItem({
      name: item.name,
      category: item.category,
      amount: item.amount,
      unit: item.unit,
      date: item.date,
      mealType: item.mealType,
    });
  } catch (error) {
    console.error('添加食物记录失败:', error);
    throw error;
  }
}

// 删除食物记录
export async function deleteFoodItem(id: string): Promise<void> {
  try {
    await foodApi.deleteFoodItem(id);
  } catch (error) {
    console.error('删除食物记录失败:', error);
    throw error;
  }
}

// 更新食物记录
export async function updateFoodItem(updatedItem: FoodItem): Promise<void> {
  try {
    await foodApi.updateFoodItem(updatedItem.id, {
      name: updatedItem.name,
      category: updatedItem.category,
      amount: updatedItem.amount,
      unit: updatedItem.unit,
      date: updatedItem.date,
      mealType: updatedItem.mealType,
    });
  } catch (error) {
    console.error('更新食物记录失败:', error);
    throw error;
  }
}
