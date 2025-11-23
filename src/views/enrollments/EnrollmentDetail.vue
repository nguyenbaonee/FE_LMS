<template>
  <div class="page-container">
    <!-- Header -->
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button :icon="Back" @click="handleBack">Quay lại</el-button>
          <h2 class="page-title">Chi tiết đăng ký học</h2>
        </div>
      </div>
    </el-card>

    <!-- Filter by Status -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true">
        <el-form-item label="Lọc theo trạng thái">
          <el-select
              v-model="statusFilter"
              placeholder="Đã đăng ký"
              style="width: 200px"
              @change="handleFilterChange"
          >
            <el-option label="Đã đăng ký" value="ACTIVE" />
            <el-option label="Đã xóa" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-tag type="info">
            Hiển thị {{ filteredEnrollments.length }} / {{ enrollments.length }} đăng ký
          </el-tag>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Student Info -->
    <el-card shadow="never" class="student-info-card">
      <div class="student-header">
        <el-avatar :src="primaryAvatarUrl" :size="80">
          {{ studentInfo.name?.charAt(0) }}
        </el-avatar>
        <div class="student-details">
          <h3 class="student-name">{{ studentInfo.name }}</h3>
          <div class="student-meta">
            <div class="meta-item">
              <el-icon><Message /></el-icon>
              <span>{{ studentInfo.email }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>Tham gia: {{ formatDate(studentInfo.joinedAt) }}</span>
            </div>
            <div class="meta-item">
              <el-icon><TrendCharts /></el-icon>
              <span>{{ enrollments.length }} khóa học đã đăng ký</span>
            </div>
          </div>
        </div>
        <el-tag :type="getStudentStatusType(studentInfo.status)" size="large">
          {{ studentInfo.status }}
        </el-tag>
      </div>
    </el-card>

    <!-- Enrollments List -->
    <div v-if="filteredEnrollments.length === 0" class="empty-state">
      <el-empty description="Không có đăng ký nào phù hợp với bộ lọc" />
    </div>

    <el-card
        v-for="enrollment in filteredEnrollments"
        :key="enrollment.id"
        shadow="hover"
        class="enrollment-card"
    >
      <!-- Enrollment Header -->
      <div class="enrollment-header">
        <div class="enrollment-status">
          <el-tag :type="getEnrollmentStatusType(enrollment.status)" effect="dark">
            {{ getEnrollmentStatusText(enrollment.status) }}
          </el-tag>
          <span class="enrollment-date">
            Đăng ký: {{ formatDate(enrollment.enrolledAt) }}
          </span>
        </div>
        <div class="enrollment-actions">
          <el-button type="warning" size="small" :icon="Edit" @click="handleEdit(enrollment)">
            Sửa
          </el-button>
          <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(enrollment)">
            Xóa
          </el-button>
        </div>
      </div>

      <el-divider style="margin: 16px 0" />

      <!-- Course Info -->
      <div class="course-content">
        <el-image
            :src="enrollment.course.thumbnail"
            fit="cover"
            class="course-thumbnail"
            :preview-src-list="[enrollment.course.thumbnail]"
        />

        <div class="course-info">
          <h4 class="course-name">{{ enrollment.course.name }}</h4>
          <div class="course-code">Mã khóa học: {{ enrollment.course.code }}</div>

          <div class="course-meta">
            <el-space wrap>
              <div class="meta-tag">
                <el-icon><Document /></el-icon>
                <span>{{ enrollment.course.lessonCount }} bài học</span>
              </div>
              <div class="meta-tag">
                <el-icon><Clock /></el-icon>
                <span>{{ enrollment.course.duration }}</span>
              </div>
              <div class="meta-tag">
                <el-icon><User /></el-icon>
                <span>{{ enrollment.course.instructorName }}</span>
              </div>
            </el-space>
          </div>

          <!-- Note -->
          <div v-if="enrollment.note" class="enrollment-note">
            <el-alert type="info" :closable="false">
              <template #title>
                <el-icon><InfoFilled /></el-icon>
                Ghi chú
              </template>
              {{ enrollment.note }}
            </el-alert>
          </div>

          <!-- Additional Info -->
          <div class="additional-info">
            <el-descriptions :column="2" size="small" border>
              <el-descriptions-item label="Điểm số">
                <el-rate v-model="enrollment.rating" disabled show-score />
              </el-descriptions-item>
              <el-descriptions-item label="Lần học cuối">
                {{ formatDateTime(enrollment.lastAccessedAt) || 'Chưa học' }}
              </el-descriptions-item>
              <el-descriptions-item label="Ngày hoàn thành" v-if="enrollment.completedAt">
                {{ formatDate(enrollment.completedAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="Thời gian học">
                {{ enrollment.totalStudyTime || 'N/A' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Back,
  Edit,
  Delete,
  Message,
  Calendar,
  TrendCharts,
  Document,
  Clock,
  User,
  InfoFilled
} from '@element-plus/icons-vue'
import axios from '../../api/axios.js'

const router = useRouter()
const route = useRoute()

const statusFilter = ref('ALL')

// Student Info
const studentInfo = ref({
  id: null,
  name: '',
  email: '',
  avatar: [],
  status: '',
  joinedAt: ''
})
const enrollmentsPage = ref({})
const enrollments = ref([])

// Filtered enrollments
const filteredEnrollments = computed(() => {
  if (statusFilter.value === 'ALL') {
    return enrollments.value
  }
  return enrollments.value.filter(e => e.status === statusFilter.value)
})
const primaryAvatarUrl = computed(() => {
  const primary = studentInfo.value.avatar?.find(a => a.primary)
  return primary ? 'http://localhost:8080' + primary.url : ''
})
// Fetch data
const fetchData = async () => {
  try {
    const studentId = route.query.studentId
    const status = route.query.status

    // Lấy thông tin học viên
    const studentResponse = await axios.get(`/students/${studentId}`, { status })
    studentInfo.value = studentResponse.data

    // Lấy danh sách đăng ký
    const enrollmentsResponse = await axios.get(`/enrollments/student/${studentId}`)
    enrollmentsPage.value = enrollmentsResponse.data       // lưu toàn bộ page
    enrollments.value = enrollmentsResponse.data.content    // chỉ lấy mảng content để v-for

  } catch (error) {
    console.error('Fetch data error:', error)
    ElMessage.error('Lỗi tải dữ liệu')
  }
}

const handleEdit = (enrollment) => {
  const studentId = studentInfo.value.id
  router.push({
    path: `/enrollments/${enrollment.id}/edit`,
    query: { studentId}
  })
}

const handleDelete = async (enrollment) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa đăng ký khóa học "${enrollment.course.name}" của học viên "${studentInfo.value.name}"?`,
        'Xác nhận xóa đăng ký',
        {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          type: 'warning',
          customClass: 'delete-confirm-box'
        }
    )

    await axios.delete(`/enrollments/${enrollment.id}`)

    ElMessage.success({
      message: `Đã xóa đăng ký khóa học "${enrollment.course.name}" thành công!`,
      duration: 3000
    })

    await fetchData()

  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete error:', error)
      ElMessage.error('Lỗi xóa đăng ký')
    }
  }
}

const handleBack = () => {
  router.back()
}

const getEnrollmentStatusType = (status) => {
  const types = {
    ACTIVE: 'success',
    COMPLETED: 'info',
    PAUSED: 'warning',
    CANCELLED: 'danger'
  }
  return types[status] || 'info'
}

const getEnrollmentStatusText = (status) => {
  const texts = {
    ACTIVE: 'Đang học',
    COMPLETED: 'Hoàn thành',
    PAUSED: 'Tạm dừng',
    CANCELLED: 'Đã hủy'
  }
  return texts[status] || status
}

const getStudentStatusType = (status) => {
  return status === 'ACTIVE' ? 'success' : 'info'
}

// Get progress color
const getProgressColor = (percentage) => {
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatDateTime = (datetime) => {
  if (!datetime) return null
  return new Date(datetime).toLocaleString('vi-VN')
}

// Mount
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-container {
  max-width: 1200px;

  .page-header {
    margin-bottom: 16px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .page-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
  }

  .filter-card {
    margin-bottom: 16px;
  }

  .student-info-card {
    margin-bottom: 20px;

    .student-header {
      display: flex;
      align-items: center;
      gap: 20px;

      .student-details {
        flex: 1;

        .student-name {
          margin: 0 0 12px 0;
          font-size: 24px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .student-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--el-text-color-secondary);
            font-size: 14px;

            .el-icon {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .empty-state {
    margin: 40px 0;
  }

  .enrollment-card {
    margin-bottom: 20px;

    .enrollment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;

      .enrollment-status {
        display: flex;
        align-items: center;
        gap: 12px;

        .enrollment-date {
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
      }

      .enrollment-actions {
        display: flex;
        gap: 8px;
      }
    }

    .course-content {
      display: flex;
      gap: 20px;

      .course-thumbnail {
        width: 240px;
        height: 150px;
        border-radius: 8px;
        flex-shrink: 0;
        cursor: pointer;
      }

      .course-info {
        flex: 1;

        .course-name {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .course-code {
          color: var(--el-text-color-secondary);
          font-size: 14px;
          margin-bottom: 12px;
        }

        .course-meta {
          margin-bottom: 16px;

          .meta-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            background: var(--el-fill-color-light);
            border-radius: 4px;
            font-size: 13px;
            color: var(--el-text-color-regular);
          }
        }

        .progress-section {
          margin: 16px 0;
          padding: 16px;
          background: var(--el-fill-color-lighter);
          border-radius: 8px;

          .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .progress-label {
              font-weight: 500;
              color: var(--el-text-color-primary);
            }

            .progress-value {
              font-weight: 600;
              font-size: 18px;
              color: var(--el-color-primary);
            }
          }

          .progress-stats {
            margin-top: 8px;
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }
        }

        .enrollment-note {
          margin: 16px 0;
        }

        .additional-info {
          margin-top: 16px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .student-info-card .student-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .enrollment-card .course-content {
    flex-direction: column;

    .course-thumbnail {
      width: 100%;
      height: 200px;
    }
  }
}

:deep(.delete-confirm-box) {
  .el-message-box__title {
    font-weight: 600;
  }

  .el-message-box__message {
    line-height: 1.6;
  }
}
</style>