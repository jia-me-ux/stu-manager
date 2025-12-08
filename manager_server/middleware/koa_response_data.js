// middleware/koa_response_data.js
const path = require('path')
const fileUtils = require('../utils/file_utils')

module.exports = async (ctx, next) => {
  const url = ctx.request.url
  const method = ctx.method

  // 固定路径：所有学生都在 students.json
  const filePath = path.join(__dirname, '../data/students.json')

  console.log(`请求路径: ${url}, 方法: ${method}, 文件路径: ${filePath}`)

  try {
    let jsonData = await fileUtils.getFileJsonData(filePath)
    if (!Array.isArray(jsonData)) {
      jsonData = []
    }

    // 安全提取 ID（转为字符串）
    const getIdFromRequest = () => {
      let id = ctx.params?.id || url.split('/').pop()
      return id ? String(id).trim() : null
    }

    if (method === 'GET') {
      // ✅ 前端需要 { data: [...] }
      ctx.response.body = { data: jsonData }
    } else if (method === 'POST') {
      const newData = ctx.request.body
      if (!newData || typeof newData !== 'object' || !newData.name) {
        ctx.status = 400
        ctx.response.body = { message: '请求体格式错误，缺少必要字段（如 name）' }
        return
      }

      // 自动分配字符串 ID
      if (!newData.id) {
        newData.id = String(jsonData.length + 1)
      } else {
        newData.id = String(newData.id).trim()
      }

      jsonData.push(newData)
      await fileUtils.saveFileJsonData(filePath, jsonData)

      ctx.status = 201
      // 前端不读 .data，但为一致性返回
      ctx.response.body = { message: '创建成功', data: newData }
    } else if (method === 'PUT') {
      const id = getIdFromRequest()
      const updateData = ctx.request.body

      if (!id || !updateData || typeof updateData !== 'object') {
        ctx.status = 400
        ctx.response.body = { message: 'ID 或更新数据不能为空' }
        return
      }

      const index = jsonData.findIndex(item => String(item.id).trim() === id)
      if (index === -1) {
        ctx.status = 404
        ctx.response.body = { message: '学生不存在' }
        return
      }

      // 保留原 id，只更新其他字段
      jsonData[index] = { ...jsonData[index], ...updateData, id: jsonData[index].id }
      await fileUtils.saveFileJsonData(filePath, jsonData)

      ctx.response.body = { message: '更新成功', data: jsonData[index] }
    } else if (method === 'DELETE') {
      const id = getIdFromRequest()
      if (!id) {
        ctx.status = 400
        ctx.response.body = { message: 'ID 不能为空' }
        return
      }

      const initialLength = jsonData.length
      const filteredData = jsonData.filter(item => String(item.id).trim() !== id)

      if (filteredData.length === initialLength) {
        ctx.status = 404
        ctx.response.body = { message: '学生不存在' }
        return
      }

      await fileUtils.saveFileJsonData(filePath, filteredData)
      ctx.response.body = { message: '删除成功' }
    }

    await next()
  } catch (error) {
    console.error('服务器错误:', error)

    if (error.code === 'ENOENT') {
      // 文件不存在
      if (method === 'GET') {
        ctx.response.body = { data: [] }
      } else if (method === 'POST') {
        const newData = ctx.request.body
        if (!newData || typeof newData !== 'object' || !newData.name) {
          ctx.status = 400
          ctx.response.body = { message: '请求体格式错误' }
          return
        }

        newData.id = String(newData.id || Date.now())
        await fileUtils.saveFileJsonData(filePath, [newData])
        ctx.status = 201
        ctx.response.body = { message: '创建成功', data: newData }
      } else {
        ctx.status = 404
        ctx.response.body = { message: '资源不存在' }
      }
    } else {
      ctx.status = 500
      ctx.response.body = { message: '服务器内部错误，请稍后再试' }
    }
  }
}