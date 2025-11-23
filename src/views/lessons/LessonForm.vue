<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>{{ isEdit ? $t('lessonForm.header.update') : $t('lessonForm.header.add') }}</h3>
          <el-button :icon="Back" @click="handleBack">{{ $t('lessonForm.header.back') }}</el-button>
        </div>
      </template>

      <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="180px"
          label-position="left"
      >

        <!-- Existing Thumbnails -->
        <el-form-item v-if="isEdit && existingThumbnails.length > 0" :label="$t('lessonForm.images.existing')">
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
                <el-tag v-if="row.primary" type="success" effect="dark">
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
                    :disabled="row.primary"
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
                    <el-button type="danger" size="small" :disabled="row.primary">
                      Xóa
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!-- Existing Videos -->
        <el-form-item v-if="isEdit && existingVideos.length > 0" :label="$t('lessonForm.videos.existing')">
          <el-table :data="existingVideos" border style="width: 100%">
            <el-table-column label="Video" align="center">
              <template #default="{ row }">
                <a :href="'http://localhost:8080' + encodeURI(row.url)" target="_blank">{{ row.name }}</a>
              </template>
            </el-table-column>

            <el-table-column label="Hành động" width="120" align="center">
              <template #default="{ row }">
                <el-popconfirm
                    title="Bạn có chắc muốn xóa video này?"
                    confirm-button-text="Xóa"
                    cancel-button-text="Hủy"
                    @confirm="removeExistingVideo(row)"
                >
                  <template #reference>
                    <el-button type="danger" size="small">Xóa</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!-- Upload new images -->
        <el-form-item :label="$t('lessonForm.images.label')" prop="images">
          <el-upload
              v-model:file-list="newImages"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleImageChange"
              :on-remove="handleRemoveNewImage"
              :before-upload="beforeImageUpload"
              accept="image/jpeg,image/png,image/jpg"
          >
            <el-icon class="thumbnail-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">{{ $t('lessonForm.images.tip') }}</div>
        </el-form-item>

        <!-- Upload new videos -->
        <el-form-item :label="$t('lessonForm.videos.label')" prop="videos" required>
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
            <el-button type="primary" icon="Plus">{{ $t('lessonForm.videos.select') }}</el-button>
          </el-upload>
          <div class="upload-tip">{{ $t('lessonForm.videos.tip') }}</div>
        </el-form-item>

        <!-- Title -->
        <el-form-item :label="$t('lessonForm.title.label')" prop="title" required>
          <el-input
              v-model="formData.title"
              :placeholder="$t('lessonForm.title.placeholder')"
              maxlength="200"
              show-word-limit
              clearable
          />
        </el-form-item>

        <!-- Lesson Order -->
        <el-form-item :label="$t('lessonForm.order.label')" prop="lessonOrder" required>
          <el-input-number
              v-model="formData.lessonOrder"
              :min="1"
              :max="200"
              :placeholder="$t('lessonForm.order.placeholder')"
              style="width: 200px"
          />
        </el-form-item>

        <!-- Buttons -->
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? $t('lessonForm.buttons.update') : $t('lessonForm.buttons.add') }}
          </el-button>
          <el-button @click="handleReset">{{ $t('lessonForm.buttons.reset') }}</el-button>
          <el-button @click="handleBack">{{ $t('lessonForm.buttons.cancel') }}</el-button>
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

const newImages = ref([]) // thumbnail mới
const newVideos = ref([]) // video mới
const existingThumbnails = ref([]) // thumbnail hiện có
const existingVideos = ref([]) // video hiện có
const deleteThumbnailsId = ref([])
const deleteVideosId = ref([])
const mainThumbnailId = ref(null)

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

const removeExistingThumbnail = (thumbnail) => {
  deleteThumbnailsId.value.push(thumbnail.id)
  existingThumbnails.value = existingThumbnails.value.filter(t => t.id !== thumbnail.id)
}
const removeExistingVideo = (video) => {
  deleteVideosId.value.push(video.id)
  existingVideos.value = existingVideos.value.filter(v => v.id !== video.id)
}
const handleMainThumbnailChange = (thumbnailId) => {
  mainThumbnailId.value = thumbnailId
}
const fetchLessonData = async () => {
  try {
    const response = await axios.get(`/lessons/${route.params.id}`)
    const lesson = response.data

    formData.title = lesson.title
    formData.lessonOrder = lesson.lessonOrder

    existingThumbnails.value = lesson.thumbnail || []
    existingVideos.value = lesson.videos || []

    if (existingThumbnails.value.length > 0) {
      const primary = existingThumbnails.value.find(t => t.primary)
      mainThumbnailId.value = primary?.id || null
    }

  } catch (error) {
    console.error('Fetch lesson error:', error)
    ElMessage.error('Không thể tải dữ liệu bài học')
  }
}
// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) { ElMessage.error('Vui lòng kiểm tra lại thông tin'); return }
    if (!isEdit.value && newVideos.value.length === 0) { ElMessage.error('Vui lòng chọn ít nhất 1 video'); return }

    submitting.value = true
    try {
      const courseId = Number(route.query.courseId)
      if (!courseId) { ElMessage.error('Không xác định được khóa học'); return }

      const data = new FormData()
      data.append('title', formData.title.trim())
      data.append('lessonOrder', formData.lessonOrder)

      // New files
      newImages.value.forEach(f => { if(f.raw) data.append('images', f.raw) })
      newVideos.value.forEach(f => { if(f.raw) data.append('videos', f.raw) })

      // Deleted existing files
      deleteThumbnailsId.value.forEach(id => data.append('deleteThumbnailId', id))
      deleteVideosId.value.forEach(id => data.append('deleteVideos', id))

      // Main thumbnail
      if (mainThumbnailId.value) data.append('mainThumbnailId', mainThumbnailId.value)

      // Call API
      if (isEdit.value) {
        await axios.put(`/lessons/${route.params.id}`, data, { headers: { 'Content-Type':'multipart/form-data' } })
        ElMessage.success('Cập nhật bài học thành công')
      } else {
        await axios.post(`/lessons/${courseId}`, data, { headers: { 'Content-Type':'multipart/form-data' } })
        ElMessage.success('Thêm bài học thành công')
      }

      router.push(`/courses/${courseId}/lessons`)

    } catch (error) {
      console.error('Submit error:', error)
      ElMessage.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally { submitting.value = false }
  })
}
const handleReset = () => {
  formRef.value?.resetFields()
  newImages.value = []
  newVideos.value = []
  if (isEdit.value) fetchLessonData()
  ElMessage.info('Đã làm mới form')
}

const handleBack = () => { router.back() }

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    fetchLessonData()
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
