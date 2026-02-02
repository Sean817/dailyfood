import { BloodSugarRecord } from '../types';

const STORAGE_KEY = 'dailyfood_bloodsugar';

// 保存血糖记录到本地存储
export function saveBloodSugarRecords(records: BloodSugarRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('保存血糖记录失败:', error);
  }
}

// 从本地存储加载血糖记录
export function loadBloodSugarRecords(): BloodSugarRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载血糖记录失败:', error);
  }
  return [];
}

// 添加血糖记录
export function addBloodSugarRecord(record: BloodSugarRecord): void {
  const records = loadBloodSugarRecords();
  records.push(record);
  saveBloodSugarRecords(records);
}

// 删除血糖记录
export function deleteBloodSugarRecord(id: string): void {
  const records = loadBloodSugarRecords();
  const filtered = records.filter((record) => record.id !== id);
  saveBloodSugarRecords(filtered);
}

// 更新血糖记录
export function updateBloodSugarRecord(updatedRecord: BloodSugarRecord): void {
  const records = loadBloodSugarRecords();
  const index = records.findIndex((record) => record.id === updatedRecord.id);
  if (index !== -1) {
    records[index] = updatedRecord;
    saveBloodSugarRecords(records);
  }
}

// 获取指定日期的血糖记录
export function getBloodSugarByDate(date: string): BloodSugarRecord[] {
  const records = loadBloodSugarRecords();
  return records.filter((record) => record.date === date);
}

