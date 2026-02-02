import { FoodItem } from '../types';

const STORAGE_KEY = 'dailyfood_items';

// 保存食物记录到本地存储
export function saveFoodItems(items: FoodItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

// 从本地存储加载食物记录
export function loadFoodItems(): FoodItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载数据失败:', error);
  }
  return [];
}

// 添加食物记录
export function addFoodItem(item: FoodItem): void {
  const items = loadFoodItems();
  items.push(item);
  saveFoodItems(items);
}

// 删除食物记录
export function deleteFoodItem(id: string): void {
  const items = loadFoodItems();
  const filtered = items.filter((item) => item.id !== id);
  saveFoodItems(filtered);
}

// 更新食物记录
export function updateFoodItem(updatedItem: FoodItem): void {
  const items = loadFoodItems();
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    saveFoodItems(items);
  }
}

