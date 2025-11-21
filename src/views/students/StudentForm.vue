<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>{{ isEdit ? 'Cập nhật' : 'Thêm' }} học viên</h3>
          <el-button :icon="Back" @click="handleBack">Quay lại</el-button>
        </div>
      </template>

      <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="180px"
          label-position="left"
      >
        <!-- Multiple Avatar Upload - Unlimited -->
        <el-form-item label="Avatar" prop="avatars">
          <div class="avatar-upload-container">
            <el-upload
                v-model:file-list="fileList"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleAvatarChange"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                accept="image/jpeg,image/png,image/jpg"
            >
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <template #tip>
                <div class="upload-tip">
                  Cho phép: JPG, PNG. Tối đa 2MB/ảnh
                </div>
              </template>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="Họ tên" prop="name" required>
          <el-input
              v-model="formData.name"
              placeholder="Nhập họ tên (5-20 ký tự)"
              maxlength="20"
              show-word-limit
              clearable
          />
        </el-form-item>

        <el-form-item label="Email" prop="email" required>
          <el-input
              v-model="formData.email"
              placeholder="Nhập email (5-100 ký tự)"
              maxlength="100"
              show-word-limit
              clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
          </el-button>
          <el-button @click="handleReset">Làm mới</el-button>
          <el-button @click="handleBack">Hủy</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Back } from '@element-plus/icons-vue'
import axios from '../../api/axios.js'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const fileList = ref([])

const isEdit = ref(false)
const submitting = ref(false)

const formData = reactive({
  name: '',
  email: '',
  avatars: []
})

const validateName = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    callback(new Error('Họ tên không được để trống'))
  } else if (value.length < 5) {
    callback(new Error('Họ tên phải có ít nhất 5 ký tự'))
  } else if (value.length > 20) {
    callback(new Error('Họ tên không được vượt quá 20 ký tự'))
  } else {
    callback()
  }
}

const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!value || value.trim() === '') {
    callback(new Error('Email không được để trống'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('Email không hợp lệ'))
  } else if (value.length < 5) {
    callback(new Error('Email phải có ít nhất 5 ký tự'))
  } else if (value.length > 100) {
    callback(new Error('Email không được vượt quá 100 ký tự'))
  } else {
    callback()
  }
}

const rules = {
  name: [
    { required: true, validator: validateName, trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ]
}
const beforeAvatarUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Avatar phải là file JPG/PNG!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Kích thước avatar không được vượt quá 2MB!')
    return false
  }
  return true
}

const handleAvatarChange = (file, uploadFiles) => {
  // Validate file before adding
  if (beforeAvatarUpload(file.raw)) {
    // Convert to base64 for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      file.url = e.target.result
      // Update formData.avatars
      formData.avatars = uploadFiles.map(f => f.url || f.raw)
    }
    reader.readAsDataURL(file.raw)
  }
}

const handleRemove = (file, uploadFiles) => {
  formData.avatars = uploadFiles.map(f => f.url || f.raw)
  ElMessage.success('Đã xóa avatar')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    if (fileList.value.length === 0) {
      ElMessage.warning('Vui lòng upload ít nhất 1 avatar')
      return
    }

    submitting.value = true

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('email', formData.email.trim())

      // Append file nếu tồn tại raw
      fileList.value.forEach(file => {
        if (file.raw) formDataToSend.append('images', file.raw)
      })

      let response
      if (isEdit.value) {
        // Update
        response = await axios.put(`/students/${route.params.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        ElMessage.success('Cập nhật học viên thành công')
      } else {
        // Create
        response = await axios.post('/students', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        ElMessage.success('Thêm học viên thành công')
      }

      console.log('Student response:', response.data)
      localStorage.setItem('lastCreatedStudent', JSON.stringify(response.data))
      router.push('/students')

    } catch (error) {
      console.error('Submit error:', error)
      ElMessage.error('Có lỗi xảy ra khi tạo/cập nhật học viên')
    } finally {
      submitting.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
  fileList.value = []
  formData.avatars = []
  ElMessage.info('Đã làm mới form')
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    fetchData()
  }
})
</script>

<style scoped lang="scss">
.page-container {
  max-width: 900px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .avatar-upload-container {
    width: 100%;

    :deep(.el-upload-list--picture-card) {
      .el-upload-list__item {
        width: 120px;
        height: 120px;
      }
    }

    :deep(.el-upload--picture-card) {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

    .upload-tip {
      margin-top: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      line-height: 1.5;
    }
  }

  :deep(.el-form-item__error) {
    font-size: 12px;
  }

  :deep(.el-input__count) {
    font-size: 12px;
  }
}
</style>