#!/usr/bin/env python3
import sqlite3
import bcrypt
import os
import sys

# 获取数据库路径
script_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(script_dir, '../data/dailyfood.db')

# 确保数据目录存在
data_dir = os.path.dirname(db_path)
os.makedirs(data_dir, exist_ok=True)

# 连接数据库
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 启用外键约束
cursor.execute('PRAGMA foreign_keys = ON')

# 创建表（如果不存在）
schema_sql = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT 0
);
"""
cursor.executescript(schema_sql)

# 创建管理员账号
username = 'admin'
password = 'sang0010023'

# 检查用户是否已存在
cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
existing_user = cursor.fetchone()

if existing_user:
    print(f'用户 "{username}" 已存在，正在更新为管理员...')
    # 更新密码和管理员权限
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute('''
        UPDATE users 
        SET password_hash = ?, is_admin = 1 
        WHERE username = ?
    ''', (password_hash, username))
    print(f'✓ 用户 "{username}" 已更新为管理员账号')
else:
    # 创建新管理员账号
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute('''
        INSERT INTO users (username, password_hash, is_admin)
        VALUES (?, ?, 1)
    ''', (username, password_hash))
    user_id = cursor.lastrowid
    print(f'✓ 管理员账号创建成功:')
    print(f'  用户名: {username}')
    print(f'  密码: {password}')
    print(f'  用户ID: {user_id}')
    print(f'  管理员权限: 是')

# 提交更改
conn.commit()
conn.close()

print('\n管理员账号注册完成！')

