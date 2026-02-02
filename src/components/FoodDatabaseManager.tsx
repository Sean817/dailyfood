import { useState, useEffect } from 'react';
import { FoodDatabaseItem, NutritionInfo } from '../types';
import { loadFoodDatabase, saveFoodDatabase, resetToDefaultDatabase, exportDatabase, importDatabase } from '../utils/foodDatabaseStorage';

interface FoodDatabaseManagerProps {
  onClose: () => void;
  onDatabaseChange: () => void;
}

export function FoodDatabaseManager({ onClose, onDatabaseChange }: FoodDatabaseManagerProps) {
  const [foods, setFoods] = useState<FoodDatabaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [editingFood, setEditingFood] = useState<FoodDatabaseItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = () => {
    const database = loadFoodDatabase();
    setFoods(database);
  };

  const handleAdd = (food: FoodDatabaseItem) => {
    // 检查是否已存在同名食物
    if (foods.some(f => f.name.toLowerCase() === food.name.toLowerCase())) {
      alert('该食物已存在！');
      return;
    }
    const newFoods = [...foods, food];
    setFoods(newFoods);
    saveFoodDatabase(newFoods);
    setShowAddForm(false);
    onDatabaseChange();
  };

  const handleUpdate = (updatedFood: FoodDatabaseItem, oldName: string) => {
    const newFoods = foods.map(f => 
      f.name === oldName ? updatedFood : f
    );
    setFoods(newFoods);
    saveFoodDatabase(newFoods);
    setEditingFood(null);
    onDatabaseChange();
  };

  const handleDelete = (name: string) => {
    if (confirm(`确定要删除"${name}"吗？`)) {
      const newFoods = foods.filter(f => f.name !== name);
      setFoods(newFoods);
      saveFoodDatabase(newFoods);
      onDatabaseChange();
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置为默认数据库吗？这将覆盖所有自定义修改！')) {
      const defaultDb = resetToDefaultDatabase();
      setFoods(defaultDb);
      onDatabaseChange();
    }
  };

  const handleExport = () => {
    const json = exportDatabase(foods);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-database-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const imported = importDatabase(importText);
    if (imported) {
      setFoods(imported);
      setShowImportModal(false);
      setImportText('');
      onDatabaseChange();
      alert('导入成功！');
    } else {
      alert('导入失败！请检查JSON格式是否正确。');
    }
  };

  // 获取所有分类
  const categories = Array.from(new Set(foods.map(f => f.category)));

  // 过滤食物
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (editingFood) {
    return (
      <FoodEditForm
        food={editingFood}
        onSave={(updated) => handleUpdate(updated, editingFood.name)}
        onCancel={() => setEditingFood(null)}
      />
    );
  }

  if (showAddForm) {
    return (
      <FoodEditForm
        food={null}
        onSave={handleAdd}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (showImportModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">导入食物数据库</h2>
            <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="粘贴JSON格式的食物数据库..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-white text-gray-900 placeholder-gray-500"
              style={{ color: '#111827' }}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                导入
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">食物知识库管理</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 工具栏 */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 搜索 */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索食物名称或分类..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                style={{ color: '#111827' }}
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style={{ color: '#111827' }}
            >
              <option value="全部">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ 添加食物
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📥 导出数据库
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              📤 导入数据库
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 重置为默认
            </button>
          </div>
        </div>

        {/* 食物列表 */}
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600">
            共 {filteredFoods.length} 种食物（总计 {foods.length} 种）
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map((food) => (
              <div
                key={food.name}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{food.name}</h3>
                    <span className="text-sm text-gray-500">{food.category}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingFood(food)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="编辑"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(food.name)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="删除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>热量: {food.nutritionPer100g.calories} 千卡</div>
                  <div>蛋白质: {food.nutritionPer100g.protein}g | 脂肪: {food.nutritionPer100g.fat}g</div>
                </div>
              </div>
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery || selectedCategory !== '全部' ? '没有找到匹配的食物' : '暂无食物数据'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 食物编辑表单组件
interface FoodEditFormProps {
  food: FoodDatabaseItem | null;
  onSave: (food: FoodDatabaseItem) => void;
  onCancel: () => void;
}

function FoodEditForm({ food, onSave, onCancel }: FoodEditFormProps) {
  const [formData, setFormData] = useState<FoodDatabaseItem>(
    food || {
      name: '',
      category: '主食',
      nutritionPer100g: {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        calcium: 0,
        iron: 0,
        folate: 0,
        vitaminC: 0,
        vitaminA: 0,
      },
    }
  );

  const categories = ['主食', '蛋白质', '蔬菜', '水果', '坚果', '其他'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('请输入食物名称');
      return;
    }
    onSave(formData);
  };

  const updateNutrition = (field: keyof NutritionInfo, value: number) => {
    setFormData({
      ...formData,
      nutritionPer100g: {
        ...formData.nutritionPer100g,
        [field]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {food ? '编辑食物' : '添加食物'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食物名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                style={{ color: '#111827' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                style={{ color: '#111827' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 营养成分（每100g） */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">营养成分（每100g）</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">热量（千卡）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.calories}
                  onChange={(e) => updateNutrition('calories', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">蛋白质（g）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.protein}
                  onChange={(e) => updateNutrition('protein', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">脂肪（g）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.fat}
                  onChange={(e) => updateNutrition('fat', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">碳水化合物（g）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.carbs}
                  onChange={(e) => updateNutrition('carbs', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">膳食纤维（g）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.fiber}
                  onChange={(e) => updateNutrition('fiber', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">钙（mg）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.calcium}
                  onChange={(e) => updateNutrition('calcium', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">铁（mg）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.iron}
                  onChange={(e) => updateNutrition('iron', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">叶酸（μg）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.folate}
                  onChange={(e) => updateNutrition('folate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">维生素C（mg）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.vitaminC}
                  onChange={(e) => updateNutrition('vitaminC', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">维生素A（μg）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionPer100g.vitaminA}
                  onChange={(e) => updateNutrition('vitaminA', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

