import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取食物记录（支持日期过滤）
router.get('/', (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.userId;

    let sql = 'SELECT * FROM food_items WHERE user_id = ?';
    const params = [userId];

    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    const items = db.prepare(sql).all(...params);

    res.json(items.map(item => ({
      id: item.id.toString(),
      name: item.name,
      category: item.category,
      amount: item.amount,
      unit: item.unit,
      date: item.date,
      mealType: item.meal_type,
    })));
  } catch (error) {
    console.error('获取食物记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加食物记录
router.post('/', (req, res) => {
  try {
    const { name, category, amount, unit, date, mealType } = req.body;
    const userId = req.user.userId;

    if (!name || !category || !amount || !date || !mealType) {
      return res.status(400).json({ error: '缺少必需字段' });
    }

    const result = db.prepare(`
      INSERT INTO food_items (user_id, name, category, amount, unit, date, meal_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, category, amount, unit || 'g', date, mealType);

    res.status(201).json({
      id: result.lastInsertRowid.toString(),
      name,
      category,
      amount,
      unit: unit || 'g',
      date,
      mealType,
      message: '食物记录添加成功',
    });
  } catch (error) {
    console.error('添加食物记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新食物记录
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, amount, unit, date, mealType } = req.body;
    const userId = req.user.userId;

    // 检查记录是否存在且属于当前用户
    const item = db.prepare('SELECT id FROM food_items WHERE id = ? AND user_id = ?').get(id, userId);
    if (!item) {
      return res.status(404).json({ error: '记录不存在或无权限' });
    }

    db.prepare(`
      UPDATE food_items
      SET name = ?, category = ?, amount = ?, unit = ?, date = ?, meal_type = ?
      WHERE id = ? AND user_id = ?
    `).run(name, category, amount, unit || 'g', date, mealType, id, userId);

    res.json({ message: '食物记录更新成功' });
  } catch (error) {
    console.error('更新食物记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除食物记录
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // 检查记录是否存在且属于当前用户
    const item = db.prepare('SELECT id FROM food_items WHERE id = ? AND user_id = ?').get(id, userId);
    if (!item) {
      return res.status(404).json({ error: '记录不存在或无权限' });
    }

    db.prepare('DELETE FROM food_items WHERE id = ? AND user_id = ?').run(id, userId);

    res.json({ message: '食物记录删除成功' });
  } catch (error) {
    console.error('删除食物记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

