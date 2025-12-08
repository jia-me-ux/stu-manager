import { createRouter, createWebHistory } from 'vue-router'
import StudentList from '@/views/StudentList.vue'

const routes = [{ path: '/', component: StudentList }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
