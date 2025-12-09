// app.js
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

// 中间件
app.use(bodyParser())
app.use(require('./middleware/koa_response_duration'))
app.use(require('./middleware/koa_response_header'))

// 路由
const studentRoutes = require('./routes/students')
console.log('✅ studentRoutes:', studentRoutes) // 👈 添加这行

// ✅ 必须这样挂载
router.use('/api/students', studentRoutes.routes())

app.use(router.routes())


app.listen(8888, () => {
  console.log('🚀 服务器启动: http://127.0.0.1:8888')
})