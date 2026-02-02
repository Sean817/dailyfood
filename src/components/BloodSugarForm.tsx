import { useState, useEffect } from 'react';
import { BloodSugarRecord } from '../types';

interface BloodSugarFormProps {
  onSubmit: (record: BloodSugarRecord) => void;
  selectedDate: string;
  existingRecords?: BloodSugarRecord[];
}

const bloodSugarTypes = [
  { value: 'fasting', label: '空腹' },
  { value: 'after_breakfast', label: '早餐后2h' },
  { value: 'after_lunch', label: '午餐后2h' },
  { value: 'after_dinner', label: '晚餐后2h' },
] as const;

// 获取当前时间（HH:mm格式）
const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function BloodSugarForm({ onSubmit, selectedDate, existingRecords = [] }: BloodSugarFormProps) {
  const [type, setType] = useState<BloodSugarRecord['type']>('fasting');
  const [value, setValue] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  // 获取当前日期和类型的已存在记录
  const existingRecord = existingRecords.find(
    (r) => r.date === selectedDate && r.type === type
  );

  // 根据血糖类型自动获取关联的餐次
  const getMealTypeFromType = (bloodSugarType: BloodSugarRecord['type']): 'breakfast' | 'lunch' | 'dinner' | undefined => {
    if (bloodSugarType === 'after_breakfast') return 'breakfast';
    if (bloodSugarType === 'after_lunch') return 'lunch';
    if (bloodSugarType === 'after_dinner') return 'dinner';
    return undefined;
  };

  // 当类型改变时，如果有已存在的记录，填充表单；否则设置默认时间为当前时间
  useEffect(() => {
    if (existingRecord) {
      setValue(existingRecord.value.toString());
      setTime(existingRecord.time || '');
      setNote(existingRecord.note || '');
    } else {
      setValue('');
      setTime(getCurrentTime()); // 默认设置为当前时间
      setNote('');
    }
  }, [type, selectedDate, existingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const record: BloodSugarRecord = {
      id: existingRecord?.id || Date.now().toString(),
      date: selectedDate,
      type,
      value: parseFloat(value) || 0,
      time: time || getCurrentTime(), // 如果没有填写时间，使用当前时间
      note: note.trim() || undefined,
      mealType: getMealTypeFromType(type), // 根据血糖类型自动关联餐次
    };

    onSubmit(record);
    // 如果添加成功，清空表单（除非是更新已有记录）
    if (!existingRecord) {
      setValue('');
      setTime(getCurrentTime()); // 重置为当前时间
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📊 血糖记录</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            测量类型
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BloodSugarRecord['type'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
            style={{ color: '#111827' }}
          >
            {bloodSugarTypes.map((item) => {
              const hasRecord = existingRecords.some(
                (r) => r.date === selectedDate && r.type === item.value
              );
              return (
                <option key={item.value} value={item.value}>
                  {item.label}{hasRecord ? ' ✓' : ''}
                </option>
              );
            })}
          </select>
          {existingRecord && (
            <p className="mt-1 text-sm text-blue-600">
              ℹ️ 已存在该类型记录，将更新现有记录
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              血糖值（mmol/L）*
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="5.5"
              min="0"
              max="30"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              style={{ color: '#111827' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测量时间
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            备注（可选）
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="如：餐前、餐后等"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            style={{ color: '#111827' }}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {existingRecord ? '更新记录' : '添加记录'}
        </button>
      </div>
      
      {/* 显示今日记录完成情况 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">今日记录完成情况：</p>
        <div className="grid grid-cols-4 gap-2">
          {bloodSugarTypes.map((item) => {
            const hasRecord = existingRecords.some(
              (r) => r.date === selectedDate && r.type === item.value
            );
            return (
              <div
                key={item.value}
                className={`text-xs text-center p-2 rounded ${
                  hasRecord
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {item.label}
                <br />
                {hasRecord ? '✓' : '○'}
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
}

