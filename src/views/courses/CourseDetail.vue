<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>Chi tiết khóa học</h3>
          <el-button type="primary" @click="handleBack">Quay lại</el-button>
        </div>
      </template>

      <el-row :gutter="20">
        <!-- Thumbnail chính -->
        <el-col :span="6">
          <el-image
              :src="getPrimaryThumbnail(course)"
              style="width: 150px; height: 100px; border-radius: 8px;"
              fit="cover"
          >
          </el-image>

          <!-- Thumbnail phụ -->
          <div
              v-if="course.thumbnail?.filter(t => !t.primary).length > 0"
              style="margin-top: 20px;"
          >
            <h4>Ảnh khác:</h4>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <el-image
                  v-for="item in course.thumbnail?.filter(t => !t.primary)"
                  :key="item.id"
                  :src="'http://localhost:8080' + encodeURI(item.url)"
                  style="width: 80px; height: 60px; border-radius: 6px;"
                  fit="cover"
              />
            </div>
          </div>
        </el-col>

        <!-- Info -->
        <el-col :span="18">
          <el-descriptions column="1" border>
            <el-descriptions-item label="Tên khóa học">
              {{ course.name }}
            </el-descriptions-item>

            <el-descriptions-item label="Mô tả">
              {{ course.description }}
            </el-descriptions-item>

            <el-descriptions-item label="Trạng thái">
              <el-tag :type="course.status === 'ACTIVE' ? 'success' : 'danger'">
                {{ course.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="Ngày tạo">
              {{ course.createdAt }}
            </el-descriptions-item>

          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import apiClient from '../../api/axios.js'

const router = useRouter()
const route = useRoute()

// data model course
const course = ref({
  name: '',
  description: '',
  status: '',
  createdAt: '',
  thumbnail: []
})

// Hàm lấy thumbnail chính
const getPrimaryThumbnail = (courseData) => {
  const t = courseData.thumbnail?.find(t => t.primary)
  if (!t || !t.url) return ''
  return 'http://localhost:8080' + encodeURI(t.url)
}

// fetch course detail
const fetchCourse = async () => {
  try {
    const id = route.params.id
    const res = await apiClient.get(`/courses/${id}`)
    course.value = res.data
  } catch (err) {
    const msg = err.response?.data?.message || 'Lỗi khi lấy thông tin khóa học'
    ElMessage.error(msg)
    router.back()
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  fetchCourse()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
