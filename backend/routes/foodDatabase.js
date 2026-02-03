import express from 'express';
import db from '../database/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 获取所有食物数据库（所有用户可访问，无需认证）
router.get('/', (req, res) => {
  try {
    const foods = db.prepare(`
      SELECT id, name, category, nutrition_data, created_at, updated_at
      FROM food_database
      ORDER BY category, name
    `).all();

    res.json(foods.map(food => ({
      name: food.name,
      category: food.category,
      nutritionPer100g: JSON.parse(food.nutrition_data),
    })));
  } catch (error) {
    console.error('获取食物数据库错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 以下路由需要管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 添加食物到数据库
router.post('/', (req, res) => {
  try {
    const { name, category, nutritionPer100g } = req.body;

    if (!name || !category || !nutritionPer100g) {
      return res.status(400).json({ error: '缺少必需字段' });
    }

    // 检查食物是否已存在
    const existing = db.prepare('SELECT id FROM food_database WHERE name = ?').get(name);
    if (existing) {
      return res.status(400).json({ error: '食物已存在' });
    }

    const nutritionData = JSON.stringify(nutritionPer100g);

    db.prepare(`
      INSERT INTO food_database (name, category, nutrition_data)
      VALUES (?, ?, ?)
    `).run(name, category, nutritionData);

    res.status(201).json({ message: '食物添加成功' });
  } catch (error) {
    console.error('添加食物错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新食物信息
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, nutritionPer100g } = req.body;

    const food = db.prepare('SELECT id FROM food_database WHERE id = ?').get(id);
    if (!food) {
      return res.status(404).json({ error: '食物不存在' });
    }

    // 如果更新名称，检查新名称是否已被使用
    if (name) {
      const existing = db.prepare('SELECT id FROM food_database WHERE name = ? AND id != ?').get(name, id);
      if (existing) {
        return res.status(400).json({ error: '食物名称已被使用' });
      }
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (category) {
      updates.push('category = ?');
      values.push(category);
    }

    if (nutritionPer100g) {
      updates.push('nutrition_data = ?');
      values.push(JSON.stringify(nutritionPer100g));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE food_database SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);

    res.json({ message: '食物更新成功' });
  } catch (error) {
    console.error('更新食物错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除食物
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const food = db.prepare('SELECT id FROM food_database WHERE id = ?').get(id);
    if (!food) {
      return res.status(404).json({ error: '食物不存在' });
    }

    db.prepare('DELETE FROM food_database WHERE id = ?').run(id);

    res.json({ message: '食物删除成功' });
  } catch (error) {
    console.error('删除食物错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

