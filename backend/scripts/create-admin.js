import db from '../database/db.js';

async function createAdmin() {
  const username = 'admin';
  const password = 'sang0010023';

  try {
    // 动态导入 bcrypt
    const bcrypt = await import('bcrypt');
    
    // 检查用户是否已存在
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    
    if (existingUser) {
      console.log(`用户 "${username}" 已存在，正在更新为管理员...`);
      
      // 更新密码和管理员权限
      const passwordHash = await bcrypt.default.hash(password, 10);
      db.prepare(`
        UPDATE users 
        SET password_hash = ?, is_admin = 1 
        WHERE username = ?
      `).run(passwordHash, username);
      
      console.log(`✓ 用户 "${username}" 已更新为管理员账号`);
    } else {
      // 创建新管理员账号
      const passwordHash = await bcrypt.default.hash(password, 10);
      const result = db.prepare(`
        INSERT INTO users (username, password_hash, is_admin)
        VALUES (?, ?, 1)
      `).run(username, passwordHash);
      
      console.log(`✓ 管理员账号创建成功:`);
      console.log(`  用户名: ${username}`);
      console.log(`  密码: ${password}`);
      console.log(`  用户ID: ${result.lastInsertRowid}`);
      console.log(`  管理员权限: 是`);
    }
  } catch (error) {
    console.error('创建管理员账号失败:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

createAdmin();

