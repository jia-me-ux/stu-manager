import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8888/api', // 通过 Vite 代理转发到后端
})

export const getAllStudents = () => api.get('/students').then((res) => res.data)
// export const getStudentById = (id) => api.get(`/students/${id}`).then((res) => res.data)
export const createStudent = (data) => api.post('/students', data).then((res) => res.data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data).then((res) => res.data)
export const deleteStudent = (id) => api.delete(`/students/${id}`).then((res) => res.data)
