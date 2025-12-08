<template>
  <div>
    <h1 style="margin-bottom: 20px">🎓 学生管理系统</h1>

    <el-button type="primary" @click="openDialog('add')">添加学生</el-button>

    <el-table :data="students" style="width: 100%; margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" width="100" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="major" label="专业" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogType === 'add' ? '添加学生' : '编辑学生'" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="100" controls-position="right" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getAllStudents, createStudent, updateStudent, deleteStudent } from '@/api/student'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'StudentList',
  data() {
    return {
      students: [],
      dialogVisible: false,
      dialogType: 'add',
      form: {
        id: '',
        name: '',
        age: '',
        email: '',
        major: '',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
      },
    }
  },
  async mounted() {
    await this.loadStudents()
  },
  methods: {
    async loadStudents() {
      try {
        const res = await getAllStudents()
        this.students = res.data
      } catch (err) {
        ElMessage.error('加载学生列表失败')
        console.error(err)
      }
    },
    openDialog(type, row = null) {
      this.dialogType = type
      if (type === 'edit' && row) {
        this.form = { ...row }
      } else {
        this.form = { name: '', age: null, email: '', major: '' }
      }
      this.dialogVisible = true
    },
    async submitForm() {
      try {
        if (this.dialogType === 'add') {
          await createStudent(this.form)
          ElMessage.success('学生添加成功')
        } else {
          await updateStudent(this.form.id, this.form)
          ElMessage.success('学生信息更新成功')
        }
        this.dialogVisible = false
        await this.loadStudents()
      } catch (err) {
        const msg = err.response?.data || '操作失败，请检查输入'
        ElMessage.error(msg)
      }
    },
    handleDelete(id) {
      ElMessageBox.confirm('确定删除该学生？此操作不可恢复。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await deleteStudent(id)
          ElMessage.success('删除成功')
          await this.loadStudents()
        })
        .catch(() => {})
    },
  },
}
</script>
