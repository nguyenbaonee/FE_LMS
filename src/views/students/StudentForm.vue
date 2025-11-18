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
          label-width="140px"
          label-position="left"
      >
        <!-- Avatar Upload -->
        <el-form-item label="Avatar" prop="avatar">
          <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleUploadAvatar"
          >
            <el-avatar v-if="formData.avatar" :src="formData.avatar" :size="120" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">
            Cho phép: JPG, PNG. Tối đa 2MB
          </div>
        </el-form-item>

        <el-form-item label="Họ tên" prop="name" required>
          <el-input v-model="formData.name" placeholder="Nhập họ tên" />
        </el-form-item>

        <el-form-item label="Email" prop="email" required>
          <el-input v-model="formData.email" placeholder="Nhập email" />
        </el-form-item>

        <el-form-item label="Số điện thoại" prop="phone" required>
          <el-input v-model="formData.phone" placeholder="Nhập số điện thoại" />
        </el-form-item>

        <el-form-item label="Ngày sinh" prop="birthDate">
          <el-date-picker
              v-model="formData.birthDate"
              type="date"
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Địa chỉ" prop="address">
          <el-input
              v-model="formData.address"
              type="textarea"
              :rows="3"
              placeholder="Nhập địa chỉ"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
          </el-button>
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

const router = useRouter()
const route = useRoute()
const formRef = ref()

const isEdit = ref(false)
const submitting = ref(false)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  address: '',
  avatar: ''
})

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' },
    { min: 2, max: 100, message: 'Độ dài từ 2-100 ký tự', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
    { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
  ]
}

const fetchData = async () => {
  if (!route.params.id) return

  try {
    // TODO: Call API get student detail
    // const response = await studentAPI.getById(route.params.id)

    // Mock data
    Object.assign(formData, {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      birthDate: '2000-01-15',
      address: 'Hà Nội',
      avatar: 'https://i.pravatar.cc/150?img=1'
    })
  } catch (error) {
    ElMessage.error('Lỗi tải dữ liệu')
  }
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('Avatar phải là file JPG/PNG!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Kích thước avatar không được vượt quá 2MB!')
    return false
  }
  return true
}

const handleUploadAvatar = async (options) => {
  const { file } = options

  try {
    // TODO: Upload to server
    // const formData = new FormData()
    // formData.append('file', file)
    // const response = await uploadAPI.upload(formData)
    // formData.avatar = response.data.url

    // Mock: Convert to base64 for demo
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.avatar = e.target.result
    }
    reader.readAsDataURL(file)

    ElMessage.success('Upload avatar thành công')
  } catch (error) {
    ElMessage.error('Lỗi upload avatar')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        // TODO: Call API update
        // await studentAPI.update(route.params.id, formData)
        ElMessage.success('Cập nhật học viên thành công')
      } else {
        // TODO: Call API create
        // await studentAPI.create(formData)
        ElMessage.success('Thêm học viên thành công')
      }

      router.push('/students')
    } catch (error) {
      ElMessage.error('Có lỗi xảy ra')
    } finally {
      submitting.value = false
    }
  })
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
  max-width: 800px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
