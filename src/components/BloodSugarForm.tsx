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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ value?: string }>({});
  const [submitError, setSubmitError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    // 验证表单
    const newErrors: { value?: string } = {};
    if (!value.trim()) {
      newErrors.value = '请输入血糖值';
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 30) {
        newErrors.value = '请输入有效的血糖值（0-30 mmol/L）';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const record: BloodSugarRecord = {
        id: existingRecord?.id || Date.now().toString(),
        date: selectedDate,
        type,
        value: parseFloat(value) || 0,
        time: time || getCurrentTime(), // 如果没有填写时间，使用当前时间
        note: note.trim() || undefined,
        mealType: getMealTypeFromType(type), // 根据血糖类型自动关联餐次
      };

      await onSubmit(record);
      // 如果添加成功，清空表单（除非是更新已有记录）
      if (!existingRecord) {
        setValue('');
        setTime(getCurrentTime()); // 重置为当前时间
        setNote('');
      }
      setErrors({});
      setSubmitError('');
    } catch (error: any) {
      console.error('添加血糖记录失败:', error);
      setSubmitError(error?.message || '保存血糖记录失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">📊 血糖记录</h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            测量类型
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BloodSugarRecord['type'])}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
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
            <p className="mt-1 text-xs sm:text-sm text-blue-600">
              ℹ️ 已存在该类型记录，将更新现有记录
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              血糖值（mmol/L） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (errors.value) setErrors({ ...errors, value: undefined });
              }}
              placeholder="5.5"
              min="0"
              max="30"
              step="0.1"
              className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
                errors.value ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              style={{ color: '#111827' }}
              required
            />
            {errors.value && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.value}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              测量时间
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            备注（可选）
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="如：餐前、餐后等"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            style={{ color: '#111827' }}
          />
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? (existingRecord ? '更新中...' : '添加中...') : (existingRecord ? '更新记录' : '添加记录')}
        </button>
      </div>
      
      {/* 显示今日记录完成情况 */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600 mb-2">今日记录完成情况：</p>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {bloodSugarTypes.map((item) => {
            const hasRecord = existingRecords.some(
              (r) => r.date === selectedDate && r.type === item.value
            );
            return (
              <div
                key={item.value}
                className={`text-xs text-center p-1.5 sm:p-2 rounded ${
                  hasRecord
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.replace('后2h', '')}</span>
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

