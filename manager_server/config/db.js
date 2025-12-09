// config/db.js
const mysql = require('mysql2/promise')

// 从环境变量读取配置（更安全）
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',       // 👈 根据你的 MySQL 用户修改
  password: process.env.DB_PASSWORD || '123456',   // 👈 填你的密码
  database: process.env.DB_NAME || 'student_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

console.log('✅ MySQL 连接池已创建')

module.exports = pool