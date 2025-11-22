<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>{{ isEdit ? 'Cập nhật' : 'Thêm' }} khóa học</h3>
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
        <!-- Hiển thị thumbnail hiện có khi Edit -->
        <el-form-item v-if="isEdit && existingThumbnails.length > 0" label="Thumbnail hiện có">
          <div class="existing-thumbnails-container">
            <el-table :data="existingThumbnails" border style="width: 100%">
              <el-table-column label="Ảnh" width="120" align="center">
                <template #default="{ row }">
                  <el-image
                      :src="'http://localhost:8080' + encodeURI(row.url)"
                      fit="cover"
                      style="width: 100px; height: 60px; border-radius: 4px"
                  />
                </template>
              </el-table-column>

              <el-table-column label="Trạng thái" width="150" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.primary === true" type="success" effect="dark">
                    Thumbnail chính
                  </el-tag>
                  <el-tag v-else type="info">Thumbnail phụ</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="Đặt làm thumbnail chính" width="200" align="center">
                <template #default="{ row }">
                  <el-radio
                      v-model="mainThumbnailId"
                      :label="row.id"
                      @change="handleMainThumbnailChange(row.id)"
                  >
                    Chọn
                  </el-radio>
                </template>
              </el-table-column>

              <el-table-column label="Hành động" width="120" align="center">
                <template #default="{ row }">
                  <el-popconfirm
                      title="Bạn có chắc muốn xóa thumbnail này?"
                      confirm-button-text="Xóa"
                      cancel-button-text="Hủy"
                      @confirm="removeExistingThumbnail(row)"
                  >
                    <template #reference>
                      <el-button
                          type="danger"
                          size="small"
                          :disabled="row.primary === true || existingThumbnails.length === 1"
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

        <!-- Upload thumbnail mới -->
        <el-form-item :label="isEdit ? 'Thêm thumbnail mới' : 'Thumbnail'" prop="thumbnails">
          <div class="thumbnail-upload-container">
            <el-upload
                v-model:file-list="newThumbnails"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleThumbnailChange"
                :on-remove="handleRemoveNewThumbnail"
                :before-upload="beforeThumbnailUpload"
                accept="image/jpeg,image/png,image/jpg"
            >
              <el-icon class="thumbnail-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <div class="upload-tip">
              Cho phép: JPG, PNG. Khuyến nghị: 1280x720px. Tối đa 5MB/ảnh
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Tên khóa học" prop="name" required>
          <el-input
              v-model="formData.name"
              placeholder="Nhập tên khóa học (1-150 ký tự)"
              maxlength="150"
              show-word-limit
              clearable
          />
        </el-form-item>

        <el-form-item label="Mã khóa học" prop="code" required>
          <el-input
              v-model="formData.code"
              :placeholder="isEdit ? 'Mã khóa học không được đổi' : 'Nhập mã khóa học (1-50 ký tự)'"
              maxlength="50"
              show-word-limit
              :disabled="isEdit"
              clearable
          />
        </el-form-item>

        <el-form-item label="Mô tả" prop="description">
          <el-input
              v-model="formData.description"
              type="textarea"
              :rows="6"
              placeholder="Nhập mô tả khóa học (tùy chọn)"
              maxlength="1000"
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

const isEdit = ref(false)
const submitting = ref(false)

// Thumbnail states
const newThumbnails = ref([])           // Thumbnail mới upload
const existingThumbnails = ref([])      // Thumbnail hiện có từ backend
const mainThumbnailId = ref(null)       // ID thumbnail chính
const deleteThumbnailsId = ref([])      // Danh sách ID thumbnail cần xóa

const formData = reactive({
  name: '',
  code: '',
  description: ''
})

// Validation rules
const validateName = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    callback(new Error('Tên khóa học không được để trống'))
  } else if (value.length < 1) {
    callback(new Error('Tên khóa học phải có ít nhất 1 ký tự'))
  } else if (value.length > 150) {
    callback(new Error('Tên khóa học không được vượt quá 150 ký tự'))
  } else {
    callback()
  }
}

const validateCode = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    callback(new Error('Mã khóa học không được để trống'))
  } else if (value.length < 1) {
    callback(new Error('Mã khóa học phải có ít nhất 1 ký tự'))
  } else if (value.length > 50) {
    callback(new Error('Mã khóa học không được vượt quá 50 ký tự'))
  } else {
    callback()
  }
}

const rules = {
  name: [
    { required: true, validator: validateName, trigger: 'blur' }
  ],
  code: [
    { required: true, validator: validateCode, trigger: 'blur' }
  ]
}

// Fetch course data for edit
const fetchData = async () => {
  try {
    const status = route.query.status

    // TODO: Replace with your courseStore
    // const course = await courseStore.fetchCourseById(route.params.id, status)

    // Mock data - replace with actual API call
    const response = await axios.get(`/courses/${route.params.id}`)
    const course = response.data

    formData.name = course.name
    formData.code = course.code
    formData.description = course.description || ''

    existingThumbnails.value = course.thumbnails || []

    newThumbnails.value = []
    deleteThumbnailsId.value = []

  } catch (error) {
    console.error('Fetch course error:', error)
    ElMessage.error('Không thể tải dữ liệu khóa học')
  }
}

// Validate thumbnail before upload
const beforeThumbnailUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Thumbnail phải là file JPG/PNG!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('Kích thước thumbnail không được vượt quá 5MB!')
    return false
  }
  return true
}

// Handle new thumbnail upload
const handleThumbnailChange = (file, uploadFiles) => {
  if (!beforeThumbnailUpload(file.raw)) {
    newThumbnails.value = uploadFiles.filter(f => f.uid !== file.uid)
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    file.url = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// Remove new thumbnail
const handleRemoveNewThumbnail = (file, uploadFiles) => {
  ElMessage.success('Đã xóa thumbnail mới')
}

// Remove existing thumbnail
const removeExistingThumbnail = (thumbnail) => {
  // Không cho xóa nếu chỉ còn 1 thumbnail
  if (existingThumbnails.value.length === 1) {
    ElMessage.warning('Phải có ít nhất 1 thumbnail.')
    return
  }

  // Thêm vào danh sách xóa
  deleteThumbnailsId.value.push(thumbnail.id)

  // Remove khỏi danh sách hiển thị
  existingThumbnails.value = existingThumbnails.value.filter(t => t.id !== thumbnail.id)

  ElMessage.success('Đã đánh dấu xóa thumbnail')
}

// Handle main thumbnail change
const handleMainThumbnailChange = (thumbnailId) => {
  ElMessage.success('Đã đặt làm thumbnail chính')
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

      if (formData.description) {
        formDataToSend.append('description', formData.description.trim())
      }

      if (!isEdit.value) {
        formDataToSend.append('code', formData.code.trim())
      }

      if (isEdit.value) {
        // ===== MODE EDIT =====

        // Append new thumbnail files
        newThumbnails.value.forEach(file => {
          if (file.raw) {
            formDataToSend.append('images', file.raw)
          }
        })

        // Append deleteThumbnailsId (nếu có)
        if (deleteThumbnailsId.value.length > 0) {
          deleteThumbnailsId.value.forEach(id => {
            formDataToSend.append('deleteThumbnailsId', id)
          })
        }

        // Append mainThumbnailId
        if (mainThumbnailId.value) {
          formDataToSend.append('mainThumbnailId', mainThumbnailId.value)
        }

        // Debug log
        console.log('=== UPDATE COURSE DATA ===')
        console.log('Name:', formData.name)
        console.log('Description:', formData.description)
        console.log('New thumbnails count:', newThumbnails.value.length)
        console.log('Delete thumbnail IDs:', deleteThumbnailsId.value)
        console.log('Main thumbnail ID:', mainThumbnailId.value)

        // Call API UPDATE
        await axios.put(`/courses/${route.params.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        ElMessage.success('Cập nhật khóa học thành công')

      } else {
        // ===== MODE CREATE =====

        // Append new thumbnail files
        newThumbnails.value.forEach(file => {
          if (file.raw) {
            formDataToSend.append('images', file.raw)
          }
        })

        // Debug log
        console.log('=== CREATE COURSE DATA ===')
        console.log('Name:', formData.name)
        console.log('Code:', formData.code)
        console.log('Description:', formData.description)
        console.log('Thumbnail count:', newThumbnails.value.length)

        // Call API CREATE
        await axios.post('/courses', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        ElMessage.success('Thêm khóa học thành công')
      }

      // Redirect về danh sách
      router.push('/courses')

    } catch (error) {
      console.error('Submit error:', error)

      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('Có lỗi xảy ra khi ' + (isEdit.value ? 'cập nhật' : 'tạo') + ' khóa học')
      }
    } finally {
      submitting.value = false
    }
  })
}

// Reset form
const handleReset = () => {
  formRef.value?.resetFields()

  if (isEdit.value) {
    fetchData()
  } else {
    newThumbnails.value = []
  }

  ElMessage.info('Đã làm mới form')
}

// Go back
const handleBack = () => {
  router.back()
}

// Mount
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

  .existing-thumbnails-container {
    width: 100%;

    .el-table {
      margin-bottom: 8px;
    }
  }

  .thumbnail-upload-container {
    width: 100%;

    :deep(.el-upload-list--picture-card) {
      .el-upload-list__item {
        width: 150px;
        height: 150px;
      }
    }

    :deep(.el-upload--picture-card) {
      width: 150px;
      height: 150px;
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

    .thumbnail-uploader-icon {
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