import db from '../database/db.js';

try {
  const admin = db.prepare('SELECT id, username, is_admin FROM users WHERE username = ?').get('admin');
  
  if (admin) {
    console.log('✓ 管理员账号已存在:');
    console.log(`  用户ID: ${admin.id}`);
    console.log(`  用户名: ${admin.username}`);
    console.log(`  管理员权限: ${admin.is_admin === 1 ? '是' : '否'}`);
  } else {
    console.log('✗ 管理员账号不存在');
  }
} catch (error) {
  console.error('检查失败:', error);
} finally {
  db.close();
}

