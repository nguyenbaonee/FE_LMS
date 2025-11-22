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
        <!--hiển thị khi Edit-->
        <el-form-item v-if="isEdit && existingAvatars.length > 0" label="Avatar hiện có">
          <div class="existing-avatars-container">
            <el-table :data="existingAvatars" border style="width: 100%">
              <el-table-column label="Ảnh" width="100" align="center">
                <template #default="{ row }">
                  <el-avatar :src="'http://localhost:8080' + encodeURI(row.url)" :size="60" />
                </template>
              </el-table-column>

              <el-table-column label="Trạng thái" width="150" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.primary === true" type="success" effect="dark">
                    Avatar chính
                  </el-tag>
                  <el-tag v-else type="info">Avatar phụ</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="Đặt làm avatar chính" width="180" align="center">
                <template #default="{ row }">
                  <el-radio
                      v-model="mainAvatarId"
                      :label="row.id"
                      @change="handleMainAvatarChange(row.id)"
                  >
                    Chọn
                  </el-radio>
                </template>
              </el-table-column>

              <el-table-column label="Hành động" width="120" align="center">
                <template #default="{ row }">
                  <el-popconfirm
                      title="Bạn có chắc muốn xóa avatar này?"
                      confirm-button-text="Xóa"
                      cancel-button-text="Hủy"
                      @confirm="removeExistingAvatar(row)"
                  >
                    <template #reference>
                      <el-button
                          type="danger"
                          size="small"
                          :disabled="row.primary === true || existingAvatars.length === 1"
                      >
                        Xóa
                      </el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item :label="isEdit ? 'Thêm avatar mới' : 'Avatar'" prop="avatars">
          <div class="avatar-upload-container">
            <el-upload
                v-model:file-list="newAvatars"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleAvatarChange"
                :on-remove="handleRemoveNewAvatar"
                :before-upload="beforeAvatarUpload"
                accept="image/jpeg,image/png,image/jpg"
            >
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <div class="upload-tip">
              Cho phép: JPG, PNG. Tối đa 2MB/ảnh. Không giới hạn số lượng
            </div>
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
              :placeholder="isEdit ? 'Email không được đổi' : 'Nhập email (5-100 ký tự)'"
              maxlength="100"
              show-word-limit
              :disabled="isEdit"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Back } from '@element-plus/icons-vue'
import axios from '../../api/axios.js'
import { useStudentStore } from "../../stores/studentStore.js"

const router = useRouter()
const route = useRoute()
const formRef = ref()
const studentStore = useStudentStore()

const isEdit = ref(false)
const submitting = ref(false)

// Avatar states
const newAvatars = ref([])              // Avatar mới upload (fileList)
const existingAvatars = ref([])         // Avatar hiện có từ backend
const mainAvatarId = ref(null)          // ID avatar chính
const deleteAvatarsId = ref([])         // Danh sách ID avatar cần xóa

const formData = reactive({
  name: '',
  email: ''
})

// Validation rules
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

// Fetch student data for edit
const fetchData = async () => {
  try {
    const status = route.query.status
    const student = await studentStore.fetchStudentById(route.params.id,status)

    formData.name = student.name
    formData.email = student.email

    existingAvatars.value = student.avatar || []


    newAvatars.value = []
    deleteAvatarsId.value = []

  } catch (error) {
    console.error('Fetch student error:', error)
    ElMessage.error('Không thể tải dữ liệu học viên')
  }
}

// Validate avatar before upload
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

// Handle new avatar upload
const handleAvatarChange = (file, uploadFiles) => {
  if (beforeAvatarUpload(file.raw)) {
    const reader = new FileReader()
    reader.onload = (e) => {
      file.url = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
}

// Remove new avatar
const handleRemoveNewAvatar = (file, uploadFiles) => {
  ElMessage.success('Đã xóa avatar mới')
}

// Remove existing avatar
const removeExistingAvatar = (avatar) => {
  // Không cho xóa nếu chỉ còn 1 avatar
  if (existingAvatars.value.length === 1 ) {
    ElMessage.warning('Phải có ít nhất 1 avatar.')
    return
  }

  // Thêm vào danh sách xóa
  deleteAvatarsId.value.push(avatar.id)

  // Remove khỏi danh sách hiển thị
  existingAvatars.value = existingAvatars.value.filter(a => a.id !== avatar.id)


  ElMessage.success('Đã đánh dấu xóa avatar')
}

// Handle main avatar change
const handleMainAvatarChange = (avatarId) => {
  ElMessage.success('Đã đặt làm avatar chính')
}


// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Vui lòng kiểm tra lại thông tin')
      return
    }
    submitting.value = true

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())

      if (!isEdit.value) {
        formDataToSend.append('email', formData.email.trim())
      }

      if (isEdit.value) {

        // Append new avatar files
        newAvatars.value.forEach(file => {
          if (file.raw) {
            formDataToSend.append('images', file.raw)
          }
        })

        // Append deleteAvatarsId (nếu có)
        if (deleteAvatarsId.value.length > 0) {
          deleteAvatarsId.value.forEach(id => {
            formDataToSend.append('deleteAvatarsId', id)
          })
        }

        // Append mainAvatarId
        if (mainAvatarId.value) {
          formDataToSend.append('mainAvatarId', mainAvatarId.value)
        }

        // Debug log
        console.log('=== UPDATE DATA ===')

        // Call API UPDATE
        await axios.put(`/students/${route.params.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        ElMessage.success('Cập nhật học viên thành công')

      } else {

        // Append new avatar files
        newAvatars.value.forEach(file => {
          if (file.raw) {
            formDataToSend.append('images', file.raw)
          }
        })
        // Call API CREATE
        await axios.post('/students', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        ElMessage.success('Thêm học viên thành công')
      }
      router.push('/students')
    } catch (error) {
      console.error('Submit error:', error)
      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('Có lỗi xảy ra khi ' + (isEdit.value ? 'cập nhật' : 'tạo') + ' học viên')
      }
    } finally {
      submitting.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()

  if (isEdit.value) {
    fetchData()
  } else {
    newAvatars.value = []
  }

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

  .existing-avatars-container {
    width: 100%;

    .el-table {
      margin-bottom: 8px;
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