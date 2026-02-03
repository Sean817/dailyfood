import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dailyfood-secret-key-change-in-production';

// JWT 认证中间件
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效或过期的令牌' });
    }
    req.user = user;
    next();
  });
}

// 管理员权限检查中间件
export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}

// 生成 JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export { JWT_SECRET };

