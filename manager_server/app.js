// 服务器的入口文件
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())

// 中间件
const respDurationMiddleware = require('./middleware/koa_response_duration')
const respHeaderMiddleware = require('./middleware/koa_response_header')
const respDataMiddleware = require('./middleware/koa_response_data') 

app.use(respDurationMiddleware)
app.use(respHeaderMiddleware)
app.use(respDataMiddleware) 

app.listen(8888, () => {
  console.log('服务器已开启~ http://127.0.0.1:8888')
})