import express from 'express';
import cors from 'cors';
import db from './database/db.js';

// 导入路由
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import foodRoutes from './routes/food.js';
import bloodSugarRoutes from './routes/bloodSugar.js';
import foodDatabaseRoutes from './routes/foodDatabase.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/blood-sugar', bloodSugarRoutes);
app.use('/api/food-database', foodDatabaseRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`数据库路径: ${db.name}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭服务器...');
  db.close();
  process.exit(0);
});

