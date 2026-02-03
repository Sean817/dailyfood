import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin === 1,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin === 1,
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前用户信息
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, is_admin, created_at FROM users WHERE id = ?').get(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin === 1,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 修改密码
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '原密码和新密码不能为空' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: '新密码长度至少4位' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: '原密码错误' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newPasswordHash, req.user.userId);

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登出（客户端删除 token 即可，这里提供接口用于记录日志等）
router.post('/logout', authenticateToken, (req, res) => {
  // JWT 是无状态的，登出主要是客户端删除 token
  res.json({ message: '登出成功' });
});

export default router;

