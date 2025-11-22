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
          label-width="140px"
      >
        <el-form-item label="Thumbnail" prop="thumbnail">
          <el-upload
              class="thumbnail-uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
          >
            <el-image
                v-if="formData.thumbnail"
                :src="formData.thumbnail"
                fit="cover"
                style="width: 300px; height: 180px"
            />
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div>Click để upload thumbnail</div>
            </div>
          </el-upload>
          <div class="upload-tip">
            Cho phép: JPG, PNG. Kích thước khuyến nghị: 1280x720px. Tối đa 5MB
          </div>
        </el-form-item>

        <el-form-item label="Tên khóa học" prop="name" required>
          <el-input v-model="formData.name" placeholder="Nhập tên khóa học" />
        </el-form-item>

        <el-form-item label="Mô tả ngắn" prop="description">
          <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="Nhập mô tả ngắn"
          />
        </el-form-item>

        <el-form-item label="Danh mục" prop="category" required>
          <el-select v-model="formData.category" placeholder="Chọn danh mục">
            <el-option label="Lập trình Web" value="web" />
            <el-option label="Mobile" value="mobile" />
            <el-option label="Thiết kế" value="design" />
            <el-option label="Kinh doanh" value="business" />
          </el-select>
        </el-form-item>

        <el-form-item label="Giá" prop="price" required>
          <el-input-number
              v-model="formData.price"
              :min="0"
              :step="10000"
              :controls="true"
              style="width: 200px"
          />
          <span style="margin-left: 8px">VNĐ</span>
        </el-form-item>

        <el-form-item label="Thời lượng" prop="duration">
          <el-input v-model="formData.duration" placeholder="VD: 20 giờ">
            <template #append>giờ</template>
          </el-input>
        </el-form-item>

        <el-form-item label="Mô tả chi tiết" prop="content">
          <el-input
              v-model="formData.content"
              type="textarea"
              :rows="8"
              placeholder="Nhập mô tả chi tiết về khóa học"
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
  description: '',
  category: '',
  price: 0,
  duration: '',
  content: '',
  thumbnail: ''
})

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập tên khóa học', trigger: 'blur' }
  ],
  category: [
    { required: true, message: 'Vui lòng chọn danh mục', trigger: 'change' }
  ],
  price: [
    { required: true, message: 'Vui lòng nhập giá', trigger: 'blur' }
  ]
}

const beforeUpload = (file) => {
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

const handleUpload = async (options) => {
  const { file } = options
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.thumbnail = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success(isEdit.value ? 'Cập nhật thành công' : 'Thêm mới thành công')
      router.push('/courses')
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

  .thumbnail-uploader {
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
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
