import { BloodSugarRecord } from '../types';
import { bloodSugarApi } from './api';

// 保存血糖记录到服务器
export async function saveBloodSugarRecords(records: BloodSugarRecord[]): Promise<void> {
  try {
    // 批量保存（可以优化为批量 API）
    for (const record of records) {
      try {
        await bloodSugarApi.addBloodSugarRecord({
          date: record.date,
          type: record.type,
          value: record.value,
          time: record.time,
          note: record.note,
          mealType: record.mealType,
        });
      } catch (error) {
        // 忽略已存在的记录
      }
    }
  } catch (error) {
    console.error('保存血糖记录失败:', error);
    throw error;
  }
}

// 从服务器加载血糖记录
export async function loadBloodSugarRecords(date?: string): Promise<BloodSugarRecord[]> {
  try {
    const records = await bloodSugarApi.getBloodSugarRecords(date);
    return records.map(record => ({
      id: record.id,
      date: record.date,
      type: record.type,
      value: record.value,
      time: record.time,
      note: record.note,
      mealType: record.mealType,
    }));
  } catch (error) {
    console.error('加载血糖记录失败:', error);
    return [];
  }
}

// 添加血糖记录
export async function addBloodSugarRecord(record: BloodSugarRecord): Promise<void> {
  try {
    await bloodSugarApi.addBloodSugarRecord({
      date: record.date,
      type: record.type,
      value: record.value,
      time: record.time,
      note: record.note,
      mealType: record.mealType,
    });
  } catch (error) {
    console.error('添加血糖记录失败:', error);
    throw error;
  }
}

// 删除血糖记录
export async function deleteBloodSugarRecord(id: string): Promise<void> {
  try {
    await bloodSugarApi.deleteBloodSugarRecord(id);
  } catch (error) {
    console.error('删除血糖记录失败:', error);
    throw error;
  }
}

// 更新血糖记录
export async function updateBloodSugarRecord(updatedRecord: BloodSugarRecord): Promise<void> {
  try {
    await bloodSugarApi.updateBloodSugarRecord(updatedRecord.id, {
      date: updatedRecord.date,
      type: updatedRecord.type,
      value: updatedRecord.value,
      time: updatedRecord.time,
      note: updatedRecord.note,
      mealType: updatedRecord.mealType,
    });
  } catch (error) {
    console.error('更新血糖记录失败:', error);
    throw error;
  }
}

// 获取指定日期的血糖记录
export async function getBloodSugarByDate(date: string): Promise<BloodSugarRecord[]> {
  return loadBloodSugarRecords(date);
}
