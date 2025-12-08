// middleware/response_header.js
module.exports = async (ctx, next) => {
  // 设置通用响应头
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Access-Control-Allow-Origin', '*') // 或指定 origin 更安全
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization') // 必须包含前端用到的 headers

  // ⚠️ 关键：如果请求是 OPTIONS，直接返回 204，不再继续
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204 // No Content
    return // 不调用 next()
  }

  await next()
}