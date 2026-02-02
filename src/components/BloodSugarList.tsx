import { BloodSugarRecord } from '../types';

interface BloodSugarListProps {
  records: BloodSugarRecord[];
  selectedDate: string;
  onDelete: (id: string) => void;
}

const typeLabels: Record<BloodSugarRecord['type'], string> = {
  fasting: '空腹',
  after_breakfast: '早餐后2h',
  after_lunch: '午餐后2h',
  after_dinner: '晚餐后2h',
};

const mealTypeLabels: Record<'breakfast' | 'lunch' | 'dinner', string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

// 格式化日期显示
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
  } catch (error) {
    return dateString;
  }
}

// 获取血糖状态（正常/偏高/偏低）
function getBloodSugarStatus(value: number, type: BloodSugarRecord['type']): { status: 'normal' | 'high' | 'low'; label: string } {
  if (type === 'fasting') {
    // 空腹血糖：正常 3.9-5.6 mmol/L
    if (value < 3.9) return { status: 'low', label: '偏低' };
    if (value > 5.6) return { status: 'high', label: '偏高' };
    return { status: 'normal', label: '正常' };
  } else {
    // 餐后2h血糖：正常 <7.8 mmol/L
    if (value < 3.9) return { status: 'low', label: '偏低' };
    if (value >= 7.8) return { status: 'high', label: '偏高' };
    return { status: 'normal', label: '正常' };
  }
}

export function BloodSugarList({ records, selectedDate, onDelete }: BloodSugarListProps) {
  const dayRecords = records.filter((record) => record.date === selectedDate);

  // 按类型分组
  const groupedByType = dayRecords.reduce(
    (acc, record) => {
      acc[record.type] = record;
      return acc;
    },
    {} as Record<BloodSugarRecord['type'], BloodSugarRecord>
  );

  if (dayRecords.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>今天还没有记录血糖</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        📊 {formatDate(selectedDate)} 血糖记录
      </h2>

      <div className="space-y-4">
        {/* 血糖记录列表 */}
        {(['fasting', 'after_breakfast', 'after_lunch', 'after_dinner'] as const).map((type) => {
          const record = groupedByType[type];
          if (!record) return null;

          const status = getBloodSugarStatus(record.value, type);

          return (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800">{typeLabels[type]}</span>
                  <span className={`text-2xl font-bold ${
                    status.status === 'normal' ? 'text-green-600' :
                    status.status === 'high' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    {record.value} mmol/L
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    status.status === 'normal' ? 'bg-green-100 text-green-700' :
                    status.status === 'high' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {status.label}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {record.mealType && (
                    <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs mr-2">
                      🍽️ {mealTypeLabels[record.mealType]}
                    </span>
                  )}
                  {record.time && `测量时间：${record.time}`}
                  {record.note && ` · ${record.note}`}
                </div>
              </div>
              <button
                onClick={() => onDelete(record.id)}
                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                title="删除"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          );
        })}

        {/* 血糖参考范围 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">📋 血糖参考范围</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>空腹血糖：</strong>3.9-5.6 mmol/L（正常）</li>
            <li>• <strong>餐后2h血糖：</strong>&lt;7.8 mmol/L（正常）</li>
            <li>• 孕妇血糖控制目标可能因个人情况而异，请咨询医生</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

