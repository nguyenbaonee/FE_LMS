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
          label-width="140px"
      >
        <el-form-item label="Khóa học" prop="courseId" required>
          <el-select
              v-model="formData.courseId"
              placeholder="Chọn khóa học"
              style="width: 100%"
          >
            <el-option
                v-for="course in courses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
            />
          </el-select>
        </el-form-item>

        <!-- Thumbnail Upload -->
        <el-form-item label="Thumbnail" prop="thumbnail">
          <el-upload
              class="thumbnail-uploader"
              :show-file-list="false"
              :before-upload="beforeThumbnailUpload"
              :http-request="handleThumbnailUpload"
          >
            <el-image
                v-if="formData.thumbnail"
                :src="formData.thumbnail"
                fit="cover"
                style="width: 300px; height: 180px"
            />
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Picture /></el-icon>
              <div>Click để upload thumbnail</div>
            </div>
          </el-upload>
          <div class="upload-tip">
            JPG, PNG. Kích thước: 1280x720px. Tối đa 5MB
          </div>
        </el-form-item>

        <!-- Video Upload -->
        <el-form-item label="Video bài học" prop="videoUrl">
          <el-upload
              class="video-uploader"
              :show-file-list="false"
              :before-upload="beforeVideoUpload"
              :http-request="handleVideoUpload"
              :disabled="uploading"
          >
            <div v-if="formData.videoUrl" class="video-preview">
              <video :src="formData.videoUrl" controls style="width: 100%; max-width: 500px" />
              <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click.stop="removeVideo"
                  style="margin-top: 8px"
              >
                Xóa video
              </el-button>
            </div>
            <el-button v-else :loading="uploading" :icon="Upload">
              {{ uploading ? 'Đang upload...' : 'Click để upload video' }}
            </el-button>
          </el-upload>
          <div class="upload-tip">
            MP4, AVI, MOV. Tối đa 500MB
          </div>
          <el-progress
              v-if="uploading"
              :percentage="uploadProgress"
              style="margin-top: 8px"
          />
        </el-form-item>

        <el-form-item label="Tiêu đề" prop="title" required>
          <el-input v-model="formData.title" placeholder="Nhập tiêu đề bài học" />
        </el-form-item>

        <el-form-item label="Mô tả" prop="description">
          <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="Nhập mô tả bài học"
          />
        </el-form-item>

        <el-form-item label="Thời lượng" prop="duration">
          <el-input v-model="formData.duration" placeholder="VD: 15:30">
            <template #append>phút:giây</template>
          </el-input>
        </el-form-item>

        <el-form-item label="Thứ tự" prop="order">
          <el-input-number
              v-model="formData.order"
              :min="1"
              :step="1"
              style="width: 150px"
          />
        </el-form-item>

        <el-form-item label="Nội dung" prop="content">
          <el-input
              v-model="formData.content"
              type="textarea"
              :rows="8"
              placeholder="Nhập nội dung chi tiết bài học"
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              :loading="submitting"
              @click="handleSubmit"
          >
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
import { Back, Picture, Upload, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()

const isEdit = ref(false)
const submitting = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const courses = ref([
  { id: 1, name: 'Lập trình Web với Vue 3' },
  { id: 2, name: 'React Native cơ bản' }
])

const formData = reactive({
  courseId: '',
  title: '',
  description: '',
  content: '',
  duration: '',
  order: 1,
  thumbnail: '',
  videoUrl: ''
})

const rules = {
  courseId: [
    { required: true, message: 'Vui lòng chọn khóa học', trigger: 'change' }
  ],
  title: [
    { required: true, message: 'Vui lòng nhập tiêu đề', trigger: 'blur' }
  ]
}

const beforeThumbnailUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Chỉ được upload file ảnh!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('Kích thước ảnh không được vượt quá 5MB!')
    return false
  }
  return true
}

const handleThumbnailUpload = async (options) => {
  const { file } = options
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.thumbnail = e.target.result
  }
  reader.readAsDataURL(file)
}

const beforeVideoUpload = (file) => {
  const isVideo = file.type.startsWith('video/')
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isVideo) {
    ElMessage.error('Chỉ được upload file video!')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('Kích thước video không được vượt quá 500MB!')
    return false
  }
  return true
}

const handleVideoUpload = async (options) => {
  const { file } = options

  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 300)

    // TODO: Upload to server
    // const formData = new FormData()
    // formData.append('video', file)
    // const response = await uploadAPI.uploadVideo(formData)

    // Mock: Convert to blob URL for demo
    await new Promise(resolve => setTimeout(resolve, 3000))

    clearInterval(interval)
    uploadProgress.value = 100

    const videoUrl = URL.createObjectURL(file)
    formData.videoUrl = videoUrl

    ElMessage.success('Upload video thành công')
  } catch (error) {
    ElMessage.error('Lỗi upload video')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const removeVideo = () => {
  formData.videoUrl = ''
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success(isEdit.value ? 'Cập nhật thành công' : 'Thêm mới thành công')
      router.push('/lessons')
    } catch (error) {
      ElMessage.error('Có lỗi xảy ra')
    } finally {
      submitting.value = false
    }
  })
}

const handleBack = () => router.back()

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    // Fetch data here
  }
  if (route.query.courseId) {
    formData.courseId = parseInt(route.query.courseId)
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

  .thumbnail-uploader,
  .video-uploader {
    :deep(.el-upload) {
      border: 2px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }

    .upload-placeholder {
      width: 300px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-secondary);

      .upload-icon {
        font-size: 40px;
        margin-bottom: 8px;
      }
    }

    .video-preview {
      text-align: center;
    }
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>