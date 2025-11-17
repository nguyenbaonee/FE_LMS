<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- Statistics Cards -->
      <el-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-change" :class="stat.changeType">
                <el-icon>
                  <component :is="stat.changeType === 'increase' ? TrendCharts : Bottom" />
                </el-icon>
                <span>{{ stat.change }}</span>
              </div>
            </div>
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="32">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- Recent Enrollments -->
      <el-col :xs="24" :lg="14">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>Đăng ký gần đây</span>
              <el-button text type="primary" @click="viewAllEnrollments">
                Xem tất cả
              </el-button>
            </div>
          </template>

          <el-table :data="recentEnrollments" style="width: 100%">
            <el-table-column label="Học viên" min-width="150">
              <template #default="{ row }">
                <div style="display: flex; align-items: center; gap: 8px">
                  <el-avatar :src="row.studentAvatar" :size="32">
                    {{ row.studentName.charAt(0) }}
                  </el-avatar>
                  <span>{{ row.studentName }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="courseName" label="Khóa học" min-width="180" />

            <el-table-column label="Ngày đăng ký" width="120">
              <template #default="{ row }">
                {{ formatDate(row.enrolledAt) }}
              </template>
            </el-table-column>

            <el-table-column label="Trạng thái" width="100" align="center">
              <template #default="{ row }">
                <el-tag type="success" size="small">Mới</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Popular Courses -->
      <el-col :xs="24" :lg="10">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>Khóa học phổ biến</span>
              <el-button text type="primary" @click="viewAllCourses">
                Xem tất cả
              </el-button>
            </div>
          </template>

          <div class="popular-courses">
            <div
                v-for="(course, index) in popularCourses"
                :key="course.id"
                class="course-item"
            >
              <div class="course-rank">{{ index + 1 }}</div>
              <el-image
                  :src="course.thumbnail"
                  fit="cover"
                  style="width: 60px; height: 40px; border-radius: 4px"
              />
              <div class="course-info">
                <div class="course-name">{{ course.name }}</div>
                <div class="course-students">
                  <el-icon><UserFilled /></el-icon>
                  <span>{{ course.studentCount }} học viên</span>
                </div>
              </div>
              <el-tag type="success" size="small">
                {{ course.rating }} ⭐
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- Revenue Chart -->
      <el-col :xs="24" :lg="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>Doanh thu theo tháng</span>
              <el-select v-model="selectedYear" style="width: 120px" size="small">
                <el-option label="2024" :value="2024" />
                <el-option label="2023" :value="2023" />
              </el-select>
            </div>
          </template>

          <div class="chart-container">
            <div class="chart-placeholder">
              📊 Biểu đồ doanh thu (tích hợp Chart.js hoặc ECharts)
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Quick Actions -->
      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header>
            <span>Thao tác nhanh</span>
          </template>

          <div class="quick-actions">
            <el-button
                type="primary"
                :icon="Plus"
                style="width: 100%"
                @click="router.push('/students/create')"
            >
              Thêm học viên
            </el-button>
            <el-button
                type="success"
                :icon="Reading"
                style="width: 100%"
                @click="router.push('/courses/create')"
            >
              Thêm khóa học
            </el-button>
            <el-button
                type="warning"
                :icon="Document"
                style="width: 100%"
                @click="router.push('/lessons/create')"
            >
              Thêm bài học
            </el-button>
            <el-button
                type="info"
                :icon="Tickets"
                style="width: 100%"
                @click="router.push('/enrollments/create')"
            >
              Đăng ký học
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserFilled,
  Reading,
  Document,
  Tickets,
  TrendCharts,
  Bottom,
  Plus
} from '@element-plus/icons-vue'

const router = useRouter()
const selectedYear = ref(2024)

const stats = [
  {
    title: 'Tổng học viên',
    value: '1,234',
    change: '+12.5%',
    changeType: 'increase',
    icon: UserFilled,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Tổng khóa học',
    value: '56',
    change: '+8.2%',
    changeType: 'increase',
    icon: Reading,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: 'Đăng ký mới',
    value: '89',
    change: '+23.1%',
    changeType: 'increase',
    icon: Tickets,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: 'Doanh thu',
    value: '156M',
    change: '+15.3%',
    changeType: 'increase',
    icon: TrendCharts,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

const recentEnrollments = ref([
  {
    studentName: 'Nguyễn Văn A',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    courseName: 'Lập trình Web với Vue 3',
    enrolledAt: '2024-11-18'
  },
  {
    studentName: 'Trần Thị B',
    studentAvatar: 'https://i.pravatar.cc/150?img=2',
    courseName: 'React Native cơ bản',
    enrolledAt: '2024-11-17'
  },
  {
    studentName: 'Lê Văn C',
    studentAvatar: 'https://i.pravatar.cc/150?img=3',
    courseName: 'UI/UX Design',
    enrolledAt: '2024-11-16'
  }
])

const popularCourses = ref([
  {
    id: 1,
    name: 'Lập trình Web với Vue 3',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    studentCount: 456,
    rating: 4.8
  },
  {
    id: 2,
    name: 'React Native cơ bản',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    studentCount: 321,
    rating: 4.7
  },
  {
    id: 3,
    name: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200',
    studentCount: 289,
    rating: 4.9
  }
])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const viewAllEnrollments = () => router.push('/enrollments')
const viewAllCourses = () => router.push('/courses')
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      padding: 20px;
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .stat-info {
        .stat-title {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;

          &.increase {
            color: #67c23a;
          }

          &.decrease {
            color: #f56c6c;
          }
        }
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .popular-courses {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .course-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background: var(--el-fill-color-light);
      }

      .course-rank {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .course-info {
        flex: 1;

        .course-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .course-students {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  .chart-container {
    height: 300px;

    .chart-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color-light);
      border-radius: 8px;
      font-size: 16px;
      color: var(--el-text-color-secondary);
    }
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>