import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 所有路由都需要认证和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 获取所有用户列表
router.get('/', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, username, is_admin, created_at
      FROM users
      ORDER BY created_at DESC
    `).all();

    res.json(users.map(user => ({
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin === 1,
      createdAt: user.created_at,
    })));
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建新用户
router.post('/', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: '密码长度至少4位' });
    }

    // 检查用户名是否已存在
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO users (username, password_hash, is_admin)
      VALUES (?, ?, ?)
    `).run(username, passwordHash, isAdmin ? 1 : 0);

    res.status(201).json({
      id: result.lastInsertRowid,
      username,
      isAdmin: isAdmin || false,
      message: '用户创建成功',
    });
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, isAdmin } = req.body;

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const updates = [];
    const values = [];

    if (username) {
      // 检查新用户名是否已被其他用户使用
      const existingUser = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, id);
      if (existingUser) {
        return res.status(400).json({ error: '用户名已被使用' });
      }
      updates.push('username = ?');
      values.push(username);
    }

    if (password) {
      if (password.length < 4) {
        return res.status(400).json({ error: '密码长度至少4位' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      values.push(passwordHash);
    }

    if (isAdmin !== undefined) {
      updates.push('is_admin = ?');
      values.push(isAdmin ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }

    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);

    res.json({ message: '用户更新成功' });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除用户
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // 不能删除自己
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: '不能删除自己的账户' });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 删除用户（外键约束会自动删除关联的食物和血糖记录）
    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

