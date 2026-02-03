#!/usr/bin/env python3
import sqlite3
import os

# 获取数据库路径
script_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(script_dir, '../data/dailyfood.db')

# 连接数据库
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 查询管理员账号
cursor.execute('SELECT id, username, is_admin, created_at FROM users WHERE username = ?', ('admin',))
admin = cursor.fetchone()

if admin:
    print('✓ 管理员账号信息:')
    print(f'  用户ID: {admin[0]}')
    print(f'  用户名: {admin[1]}')
    print(f'  管理员权限: {"是" if admin[2] else "否"}')
    print(f'  创建时间: {admin[3]}')
else:
    print('✗ 管理员账号不存在')

conn.close()

