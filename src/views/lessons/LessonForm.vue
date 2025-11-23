<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>{{ isEdit ? 'Cập nhật' : 'Thêm' }} bài học</h3>
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
        <!-- Upload hình ảnh (images) -->
        <el-form-item label="Hình ảnh" prop="images">
          <el-upload
              v-model:file-list="newImages"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleImageChange"
              :on-remove="handleRemoveNewImage"
              :before-upload="beforeImageUpload"
              accept="image/jpeg,image/png,image/jpg"
          >
            <el-icon class="thumbnail-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <div class="upload-tip">
            Cho phép: JPG, PNG. Tối đa 5MB/ảnh
          </div>
        </el-form-item>

        <!-- Upload video (videos) -->
        <el-form-item label="Video" prop="videos" required>
          <el-upload
              v-model:file-list="newVideos"
              list-type="text"
              :auto-upload="false"
              :on-change="handleVideoChange"
              :on-remove="handleRemoveNewVideo"
              :before-upload="beforeVideoUpload"
              accept="video/mp4,video/mkv,video/avi"
              multiple
          >
            <el-button type="primary" icon="Plus">Chọn video</el-button>
          </el-upload>
          <div class="upload-tip">
            Cho phép: MP4, MKV, AVI. Tối đa 500MB/video
          </div>
        </el-form-item>

        <!-- Title -->
        <el-form-item label="Tên bài học" prop="title" required>
          <el-input
              v-model="formData.title"
              placeholder="Nhập tên bài học (1-200 ký tự)"
              maxlength="200"
              show-word-limit
              clearable
          />
        </el-form-item>

        <!-- Lesson Order -->
        <el-form-item label="Thứ tự" prop="lessonOrder" required>
          <el-input-number
              v-model="formData.lessonOrder"
              :min="1"
              :max="200"
              placeholder="Nhập thứ tự bài học"
              style="width: 200px"
          />
        </el-form-item>

        <!-- Buttons -->
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

// File uploads
const newImages = ref([]) // images optional
const newVideos = ref([]) // videos required

const formData = reactive({
  title: '',
  lessonOrder: null
})

// Validation
const validateTitle = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    callback(new Error('Tên bài học không được để trống'))
  } else if (value.length < 1 || value.length > 200) {
    callback(new Error('Tên bài học phải từ 1 đến 200 ký tự'))
  } else {
    callback()
  }
}

const validateLessonOrder = (rule, value, callback) => {
  if (value === null || value === undefined) {
    callback(new Error('Thứ tự bài học không được để trống'))
  } else if (value < 1 || value > 200) {
    callback(new Error('Thứ tự bài học từ 1 đến 200'))
  } else {
    callback()
  }
}
const validateVideos = (rule, value, callback) => {
  if (!newVideos.value || newVideos.value.length === 0) {
    callback(new Error('Vui lòng chọn ít nhất 1 video'))
  } else {
    callback()
  }
}

const rules = {
  title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
  lessonOrder: [{ required: true, validator: validateLessonOrder, trigger: 'blur' }],
  videos: [{ required: true,validator: validateVideos, trigger: 'change' }]
}

// File validation
const beforeImageUpload = (file) => {
  const isImage = ['image/jpeg','image/png','image/jpg'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('File phải là JPG/PNG!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('Kích thước tối đa 5MB/ảnh')
    return false
  }
  return true
}

const beforeVideoUpload = (file) => {
  const isVideo = ['video/mp4','video/mkv','video/avi'].includes(file.type)
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isVideo) {
    ElMessage.error('File phải là MP4/MKV/AVI!')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('Kích thước tối đa 500MB/video')
    return false
  }
  return true
}

const handleImageChange = (file, fileList) => { newImages.value = fileList }
const handleRemoveNewImage = (file, fileList) => { newImages.value = fileList }
const handleVideoChange = (file, fileList) => { newVideos.value = fileList }
const handleRemoveNewVideo = (file, fileList) => { newVideos.value = fileList }

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    if (newVideos.value.length === 0) {
      ElMessage.error('Vui lòng chọn ít nhất 1 video')
      return
    }

    submitting.value = true

    try {
      const courseId = Number(route.query.courseId)
      if (!courseId) {
        ElMessage.error('Không xác định được khóa học')
        return
      }
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('lessonOrder', formData.lessonOrder)

      // Append images
      newImages.value.forEach(file => {
        if (file.raw) formDataToSend.append('images', file.raw)
      })

      // Append videos
      newVideos.value.forEach(file => {
        if (file.raw) formDataToSend.append('videos', file.raw)
      })

      // Call API
      if (isEdit.value) {
        await axios.put(`/lessons/${route.params.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        ElMessage.success('Cập nhật bài học thành công')
      } else {
        await axios.post(`/lessons/${courseId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        ElMessage.success('Thêm bài học thành công')
      }

      router.push(`/courses/${courseId}/lessons`)
    } catch (error) {
      console.error('Submit error:', error)
      ElMessage.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      submitting.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
  newImages.value = []
  newVideos.value = []
  ElMessage.info('Đã làm mới form')
}

const handleBack = () => { router.back() }

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    // Fetch lesson data for edit if cần (optional)
    // fetchLessonData()
  }
})
</script>

<style scoped>
.page-container {
  padding: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumbnail-uploader-icon {
  font-size: 28px;
}
.upload-tip {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
</style>
