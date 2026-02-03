import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 数据库文件路径
const DB_PATH = process.env.DB_PATH || join(__dirname, '../data/dailyfood.db');

// 确保数据目录存在
import { mkdirSync } from 'fs';
const dbDir = join(__dirname, '../data');
try {
  mkdirSync(dbDir, { recursive: true });
} catch (error) {
  // 目录已存在，忽略错误
}

// 创建数据库连接
const db = new Database(DB_PATH);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 读取并执行 schema.sql
const schemaPath = join(__dirname, 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// 初始化默认管理员用户（如果不存在）
function initDefaultAdmin() {
  const defaultUsername = '高蛋白';
  const defaultPassword = 'tshhw';
  
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get(defaultUsername);
  
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);
    db.prepare(`
      INSERT INTO users (username, password_hash, is_admin)
      VALUES (?, ?, 1)
    `).run(defaultUsername, passwordHash);
    console.log('默认管理员用户已创建:', defaultUsername);
  }
}

// 初始化 admin 管理员账号（如果不存在）
function initAdminAccount() {
  const adminUsername = 'admin';
  const adminPassword = 'sang0010023';
  
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get(adminUsername);
  
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    db.prepare(`
      INSERT INTO users (username, password_hash, is_admin)
      VALUES (?, ?, 1)
    `).run(adminUsername, passwordHash);
    console.log('管理员账号已创建: admin');
  } else {
    // 如果已存在，确保是管理员并更新密码
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    db.prepare(`
      UPDATE users 
      SET password_hash = ?, is_admin = 1 
      WHERE username = ?
    `).run(passwordHash, adminUsername);
    console.log('管理员账号已更新: admin');
  }
}

// 初始化食物数据库（如果为空）
function initFoodDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM food_database').get();
  
  if (count.count === 0) {
    // 从前端数据文件导入默认食物数据库
    try {
      const foodDatabasePath = join(__dirname, '../../src/data/foodDatabase.ts');
      // 这里可以添加导入逻辑，或者通过 API 导入
      console.log('食物数据库为空，可以通过 API 导入默认数据');
    } catch (error) {
      console.log('无法导入默认食物数据库:', error.message);
    }
  }
}

// 初始化
initDefaultAdmin();
initAdminAccount();
initFoodDatabase();

export default db;

