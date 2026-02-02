import { useState } from 'react';
import { FoodItem, BloodSugarRecord } from '../types';
import { calculateDailyNutrition } from '../utils/nutrition';
import { pregnancyTargets } from '../utils/nutrition';

interface CalendarViewProps {
  foodItems: FoodItem[];
  bloodSugarRecords?: BloodSugarRecord[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

export function CalendarView({ foodItems, bloodSugarRecords = [], selectedDate, onDateSelect, onClose }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // 获取有记录的日期
  const datesWithRecords = new Set(foodItems.map(item => item.date));
  const datesWithBloodSugar = new Set(bloodSugarRecords.map(record => record.date));
  
  // 获取当前月份的第一天和最后一天
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 生成日历日期数组
  const calendarDays: (Date | null)[] = [];
  
  // 填充上个月的日期（显示在日历开头）
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    calendarDays.push(date);
  }
  
  // 填充当前月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }
  
  // 填充下个月的日期（显示在日历末尾，凑够6行）
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push(new Date(year, month + 1, day));
  }

  // 格式化日期为 YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 检查日期是否有记录
  const hasRecord = (date: Date | null): boolean => {
    if (!date) return false;
    return datesWithRecords.has(formatDateString(date));
  };

  // 检查日期是否有血糖记录
  const hasBloodSugarRecord = (date: Date | null): boolean => {
    if (!date) return false;
    return datesWithBloodSugar.has(formatDateString(date));
  };

  // 获取日期血糖记录数量（每天应该有4次：空腹、早餐后、午餐后、晚餐后）
  const getBloodSugarRecordCount = (date: Date | null): number => {
    if (!date) return 0;
    const dateStr = formatDateString(date);
    return bloodSugarRecords.filter(record => record.date === dateStr).length;
  };

  // 检查日期是否被选中
  const isSelected = (date: Date | null): boolean => {
    if (!date) return false;
    return formatDateString(date) === selectedDate;
  };

  // 检查日期是否是今天
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 检查日期是否在当前月份
  const isCurrentMonth = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getMonth() === month;
  };

  // 获取日期的营养达标情况
  const getNutritionStatus = (date: Date | null): 'good' | 'warning' | 'none' => {
    if (!date || !hasRecord(date)) return 'none';
    const dateStr = formatDateString(date);
    const nutrition = calculateDailyNutrition(foodItems, dateStr);
    const percentage = (nutrition.total.calories / pregnancyTargets.calories) * 100;
    if (percentage >= 80) return 'good';
    return 'warning';
  };

  // 切换月份
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    onDateSelect(new Date().toISOString().split('T')[0]);
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">日历视图</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 日历内容 */}
        <div className="p-6">
          {/* 月份导航 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {year}年 {month + 1}月
              </h3>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              >
                今天
              </button>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) return <div key={index} />;
              
              const dateStr = formatDateString(date);
              const hasRecordValue = datesWithRecords.has(dateStr);
              const hasBloodSugar = hasBloodSugarRecord(date);
              const bloodSugarCount = getBloodSugarRecordCount(date);
              const selected = isSelected(date);
              const today = isToday(date);
              const currentMonth = isCurrentMonth(date);
              const status = getNutritionStatus(date);

              return (
                <button
                  key={index}
                  onClick={() => {
                    onDateSelect(dateStr);
                    onClose();
                  }}
                  className={`
                    aspect-square p-2 rounded-lg text-sm transition-colors
                    ${!currentMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${today ? 'ring-2 ring-blue-500' : ''}
                    ${selected ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-gray-100'}
                    ${hasRecordValue && !selected ? 'bg-gray-50' : ''}
                  `}
                  title={`${dateStr}${hasBloodSugar ? ` - 血糖记录: ${bloodSugarCount}/4` : ''}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{date.getDate()}</span>
                    <div className="flex items-center gap-1 mt-1">
                      {hasRecordValue && (
                        <span className={`
                          w-1.5 h-1.5 rounded-full
                          ${selected ? 'bg-white' : status === 'good' ? 'bg-green-500' : 'bg-orange-500'}
                        `} />
                      )}
                      {hasBloodSugar && (
                        <span className={`
                          w-1.5 h-1.5 rounded-full
                          ${selected ? 'bg-white' : bloodSugarCount === 4 ? 'bg-purple-500' : 'bg-purple-300'}
                        `} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 图例 */}
          <div className="mt-6 flex items-center justify-center flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>营养良好</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>营养不足</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>血糖完整（4次）</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-300"></div>
              <span>血糖部分</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full ring-2 ring-blue-500"></div>
              <span>今天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

