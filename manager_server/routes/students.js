// routes/students.js
const Router = require('koa-router')
const db = require('../config/db')

const router = new Router() 

// GET /api/students
router.get('/students', async (ctx) => {
  try {
    console.log('✅ GET 被调用')
    const [rows] = await db.execute('SELECT * FROM students')
    ctx.body = { data: rows }
  } catch (err) {
    console.error('查询失败:', err)
    ctx.status = 500
    ctx.body = { message: '查询学生列表失败' }
  }
})

// POST /api/students
router.post('/students', async (ctx) => {
  const { name, age, email, major } = ctx.request.body

  if (!name) {
    ctx.status = 400
    ctx.body = { message: '姓名不能为空' }
    return
  }

  try {
    const [result] = await db.execute(
  'INSERT INTO students (name, age, email, major) VALUES (?, ?, ?, ?)',
  [name, age || null, email || null, major || null]
)
const id = result.insertId.toString()
    ctx.status = 201
    ctx.body = { message: '创建成功', data: { id, name, age, email, major } }
  } catch (err) {
    console.error('插入失败:', err)
    ctx.status = 500
    ctx.body = { message: '创建学生失败' }
  }
})

// PUT /api/students/:id
router.put('/students/:id', async (ctx) => {
  const { id } = ctx.params
  const { name, age, email, major } = ctx.request.body

  if (!name) {
    ctx.status = 400
    ctx.body = { message: '姓名不能为空' }
    return
  }

  try {
    const [result] = await db.execute(
      'UPDATE students SET name = ?, age = ?, email = ?, major = ? WHERE id = ?',
      [name, age || null, email || null, major || null, id]
    )

    if (result.affectedRows === 0) {
      ctx.status = 404
      ctx.body = { message: '学生不存在' }
      return
    }

    ctx.body = { message: '更新成功' }
  } catch (err) {
    console.error('更新失败:', err)
    ctx.status = 500
    ctx.body = { message: '更新学生失败' }
  }
})

// DELETE /api/students/:id
router.delete('/students/:id', async (ctx) => {
  const { id } = ctx.params

  try {
    const [result] = await db.execute('DELETE FROM students WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      ctx.status = 404
      ctx.body = { message: '学生不存在' }
      return
    }

    ctx.body = { message: '删除成功' }
  } catch (err) {
    console.error('删除失败:', err)
    ctx.status = 500
    ctx.body = { message: '删除学生失败' }
  }
})

module.exports = router