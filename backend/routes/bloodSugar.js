import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取血糖记录（支持日期过滤）
router.get('/', (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.userId;

    let sql = 'SELECT * FROM blood_sugar_records WHERE user_id = ?';
    const params = [userId];

    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    const records = db.prepare(sql).all(...params);

    res.json(records.map(record => ({
      id: record.id.toString(),
      date: record.date,
      type: record.type,
      value: record.value,
      time: record.time,
      note: record.note,
      mealType: record.meal_type,
    })));
  } catch (error) {
    console.error('获取血糖记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加血糖记录
router.post('/', (req, res) => {
  try {
    const { date, type, value, time, note, mealType } = req.body;
    const userId = req.user.userId;

    if (!date || !type || value === undefined) {
      return res.status(400).json({ error: '缺少必需字段' });
    }

    const result = db.prepare(`
      INSERT INTO blood_sugar_records (user_id, date, type, value, time, note, meal_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, date, type, value, time || null, note || null, mealType || null);

    res.status(201).json({
      id: result.lastInsertRowid.toString(),
      date,
      type,
      value,
      time: time || undefined,
      note: note || undefined,
      mealType: mealType || undefined,
      message: '血糖记录添加成功',
    });
  } catch (error) {
    console.error('添加血糖记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新血糖记录
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { date, type, value, time, note, mealType } = req.body;
    const userId = req.user.userId;

    // 检查记录是否存在且属于当前用户
    const record = db.prepare('SELECT id FROM blood_sugar_records WHERE id = ? AND user_id = ?').get(id, userId);
    if (!record) {
      return res.status(404).json({ error: '记录不存在或无权限' });
    }

    db.prepare(`
      UPDATE blood_sugar_records
      SET date = ?, type = ?, value = ?, time = ?, note = ?, meal_type = ?
      WHERE id = ? AND user_id = ?
    `).run(date, type, value, time || null, note || null, mealType || null, id, userId);

    res.json({ message: '血糖记录更新成功' });
  } catch (error) {
    console.error('更新血糖记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除血糖记录
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // 检查记录是否存在且属于当前用户
    const record = db.prepare('SELECT id FROM blood_sugar_records WHERE id = ? AND user_id = ?').get(id, userId);
    if (!record) {
      return res.status(404).json({ error: '记录不存在或无权限' });
    }

    db.prepare('DELETE FROM blood_sugar_records WHERE id = ? AND user_id = ?').run(id, userId);

    res.json({ message: '血糖记录删除成功' });
  } catch (error) {
    console.error('删除血糖记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

