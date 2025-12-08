// utils/file_utils.js
const fs = require('fs')
const path = require('path')

module.exports.getFileJsonData = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('读取文件失败:', filePath, err)
        reject(err)
      } else {
        try {
          resolve(JSON.parse(data))
        } catch (parseErr) {
          console.error('JSON 解析失败:', filePath, parseErr)
          reject(new Error(`JSON 解析失败: ${parseErr.message}`))
        }
      }
    })
  })
}

module.exports.saveFileJsonData = (filePath, data) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const jsonString = JSON.stringify(data, null, 2)
    console.log('准备写入文件:', filePath)
    console.log('写入内容:', jsonString)

    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('写入文件失败:', filePath, err)
        reject(err)
      } else {
        console.log('文件写入成功:', filePath)
        resolve()
      }
    })
  })
}