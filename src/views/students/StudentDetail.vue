<template>
  <div class="page-container">
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <h3>Chi tiết học viên</h3>
          <el-space>
            <el-button :icon="Edit" type="warning" @click="handleEdit">
              Chỉnh sửa
            </el-button>
            <el-button :icon="Back" @click="handleBack">
              Quay lại
            </el-button>
          </el-space>
        </div>
      </template>

      <div class="detail-content">
        <div class="avatar-section">
          <el-avatar :src="studentData.avatar" :size="120">
            {{ studentData.name?.charAt(0) }}
          </el-avatar>
          <h2>{{ studentData.name }}</h2>
          <el-tag :type="studentData.status === 1 ? 'success' : 'danger'">
            {{ studentData.status === 1 ? 'Đang hoạt động' : 'Đã xóa' }}
          </el-tag>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="Email">
            {{ studentData.email }}
          </el-descriptions-item>
          <el-descriptions-item label="Số điện thoại">
            {{ studentData.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="Ngày sinh">
            {{ formatDate(studentData.birthDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="Ngày đăng ký">
            {{ formatDate(studentData.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="Địa chỉ" :span="2">
            {{ studentData.address || 'Chưa cập nhật' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="course-section">
          <h4>Khóa học đang tham gia ({{ studentData.enrollments?.length || 0 }})</h4>
          <el-table :data="studentData.enrollments" stripe>
            <el-table-column prop="courseName" label="Tên khóa học" />
            <el-table-column label="Ngày đăng ký" width="150">
              <template #default="{ row }">
                {{ formatDate(row.enrolledAt) }}
              </template>
            </el-table-column>
            <el-table-column label="Tiến độ" width="150">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, Back } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const studentData = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  address: '',
  avatar: '',
  status: 1,
  createdAt: '',
  enrollments: []
})

const fetchData = async () => {
  loading.value = true
  try {
    // TODO: Call API
    // const response = await studentAPI.getById(route.params.id)

    // Mock data
    Object.assign(studentData, {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      birthDate: '2000-01-15',
      address: 'Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 1,
      createdAt: '2024-01-10',
      enrollments: [
        { courseName: 'Lập trình Web cơ bản', enrolledAt: '2024-01-15', progress: 65 },
        { courseName: 'Vue 3 nâng cao', enrolledAt: '2024-02-01', progress: 30 }
      ]
    })
  } catch (error) {
    ElMessage.error('Lỗi tải dữ liệu')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/students/${route.params.id}/edit`)
}

const handleBack = () => {
  router.back()
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-container {
  max-width: 1000px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .detail-content {
    .avatar-section {
      text-align: center;
      padding: 20px 0;
      margin-bottom: 30px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      h2 {
        margin: 16px 0 8px;
        font-size: 24px;
      }
    }

    .course-section {
      margin-top: 30px;

      h4 {
        margin-bottom: 16px;
        font-size: 16px;
      }
    }
  }
}
</style>