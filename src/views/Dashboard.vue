<template>
    <div class="dashboard">
      <!-- Welcome Section -->
      <el-card shadow="never" class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">{{ $t('dashboard.welcomeTitle') }}</h1>
            <p class="welcome-desc">{{ $t('dashboard.welcomeDesc') }}</p>
          </div>
          <div class="welcome-actions">
            <el-button type="primary" :icon="Plus" size="large" @click="router.push('/students/create')">
              {{ $t('dashboard.addStudent') }}
            </el-button>
            <el-button type="success" :icon="Reading" size="large" @click="router.push('/courses/create')">
              {{ $t('dashboard.addCourse') }}
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- Statistics Cards -->
      <el-row :gutter="20" style="margin-top: 20px">
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
                <el-icon :size="36">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Quick Overview -->
      <el-row :gutter="20" style="margin-top: 20px">
        <!-- Recent Activities -->
        <el-col :xs="24" :lg="14">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
              <span class="card-title">
                <el-icon><Clock /></el-icon>
                {{ $t('dashboard.recentActivities') }}
              </span>
                <el-button text type="primary" @click="router.push('/enrollments')">
                  {{ $t('dashboard.viewAll') }}
                </el-button>
              </div>
            </template>

            <el-timeline>
              <el-timeline-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :timestamp="activity.time"
                  :type="activity.type"
                  :icon="activity.icon"
              >
                <div class="activity-content">
                  <strong>{{ activity.title }}</strong>
                  <p>{{ activity.description }}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <!-- Quick Links -->
        <el-col :xs="24" :lg="10">
          <el-card shadow="never">
            <template #header>
            <span class="card-title">
              <el-icon><Link /></el-icon>
              {{ $t('dashboard.quickAccess') }}
            </span>
            </template>

            <div class="quick-links">
              <el-button
                  class="quick-link-btn"
                  @click="router.push('/students')"
              >
                <el-icon><UserFilled /></el-icon>
                <div class="quick-link-content">
                  <span class="quick-link-title">{{ $t('dashboard.manageStudents') }}</span>
                  <span class="quick-link-count">{{ stats[0].value }} {{ $t('dashboard.students') }}</span>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </el-button>

              <el-button
                  class="quick-link-btn"
                  @click="router.push('/courses')"
              >
                <el-icon><Reading /></el-icon>
                <div class="quick-link-content">
                  <span class="quick-link-title">{{ $t('dashboard.manageCourses') }}</span>
                  <span class="quick-link-count">{{ stats[1].value }} {{ $t('dashboard.courses') }}</span>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </el-button>

              <el-button
                  class="quick-link-btn"
                  @click="router.push('/lessons')"
              >
                <el-icon><Document /></el-icon>
                <div class="quick-link-content">
                  <span class="quick-link-title">{{ $t('dashboard.manageLessons') }}</span>
                  <span class="quick-link-count">{{ stats[2].value }} {{ $t('dashboard.lessons') }}</span>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </el-button>

              <el-button
                  class="quick-link-btn"
                  @click="router.push('/enrollments')"
              >
                <el-icon><Tickets /></el-icon>
                <div class="quick-link-content">
                  <span class="quick-link-title">{{ $t('dashboard.enrollments') }}</span>
                  <span class="quick-link-count">{{ stats[3].value }} {{ $t('dashboard.enrollments') }}</span>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Charts Section -->
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :xs="24">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
              <span class="card-title">
                <el-icon><TrendCharts /></el-icon>
                {{ $t('dashboard.overviewStats') }}
              </span>
                <el-radio-group v-model="chartPeriod" size="small">
                  <el-radio-button label="week">{{ $t('dashboard.periodWeek') }}</el-radio-button>
                  <el-radio-button label="month">{{ $t('dashboard.periodMonth') }}</el-radio-button>
                  <el-radio-button label="year">{{ $t('dashboard.periodYear') }}</el-radio-button>
                </el-radio-group>
              </div>
            </template>

            <div class="chart-container">
              <div class="chart-placeholder">
                <el-icon :size="60" color="#909399"><TrendCharts /></el-icon>
                <p style="margin-top: 16px; color: #909399"></p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserFilled,
  Reading,
  Document,
  Tickets,
  Plus,
  Clock,
  Link,
  Star,
  TrendCharts,
  Bottom,
  ArrowRight,
  SuccessFilled,
  CirclePlus,
  Edit,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()
const chartPeriod = ref('month')

// Statistics
const stats = [
  {
    title: 'Tổng học viên',
    value: '',
    change: '',
    changeType: 'increase',
    icon: UserFilled,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Tổng khóa học',
    value: '',
    change: '',
    changeType: 'increase',
    icon: Reading,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: 'Tổng bài học',
    value: '',
    change: '',
    changeType: 'increase',
    icon: Document,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: 'Đăng ký mới',
    value: '',
    change: '',
    changeType: 'increase',
    icon: Tickets,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    title: 'Học viên mới',
    description: 'Nguyễn Văn A đã đăng ký tài khoản',
    time: '5 phút trước',
    type: 'success',
    icon: SuccessFilled
  },
  {
    id: 2,
    title: 'Khóa học mới',
    description: 'Đã thêm khóa học "Vue 3 Advanced"',
    time: '1 giờ trước',
    type: 'primary',
    icon: CirclePlus
  },
  {
    id: 3,
    title: 'Cập nhật bài học',
    description: 'Bài học "Giới thiệu Vue 3" đã được cập nhật',
    time: '3 giờ trước',
    type: 'warning',
    icon: Edit
  },
  {
    id: 4,
    title: 'Đăng ký khóa học',
    description: 'Trần Thị B đã đăng ký khóa học "React Native"',
    time: '5 giờ trước',
    type: 'success',
    icon: SuccessFilled
  },
  {
    id: 5,
    title: 'Xóa học viên',
    description: 'Học viên Lê Văn C đã bị xóa',
    time: '1 ngày trước',
    type: 'danger',
    icon: Delete
  }
])

// Popular Courses
const popularCourses = ref([
  {
    id: 1,
    name: 'Lập trình Web với Vue 3',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    studentCount: 456
  },
  {
    id: 2,
    name: 'React Native cơ bản',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    studentCount: 321
  },
  {
    id: 3,
    name: 'UI/UX Design chuyên nghiệp',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200',
    studentCount: 289
  }
])
</script>

<style scoped lang="scss">
.dashboard {
  .welcome-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;

    :deep(.el-card__body) {
      padding: 40px;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;

      .welcome-text {
        .welcome-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .welcome-desc {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
      }

      .welcome-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
    }
  }

  .stat-card {
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
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 500;

          &.increase {
            color: #67c23a;
          }

          &.decrease {
            color: #f56c6c;
          }
        }
      }

      .stat-icon {
        width: 70px;
        height: 70px;
        border-radius: 16px;
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

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }
  }

  .activity-content {
    strong {
      display: block;
      margin-bottom: 4px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .quick-links {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .quick-link-btn {
      width: 100%;
      height: auto;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: left;
      border: 1px solid var(--el-border-color-lighter);
      transition: all 0.3s;

      &:hover {
        border-color: #667eea;
        background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);

        .arrow-icon {
          transform: translateX(4px);
        }
      }

      .el-icon:first-child {
        font-size: 24px;
        color: #667eea;
      }

      .quick-link-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .quick-link-title {
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .quick-link-count {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }

      .arrow-icon {
        color: var(--el-text-color-placeholder);
        transition: transform 0.3s;
      }
    }
  }

  .popular-courses {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .course-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
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
        font-size: 14px;
      }

      .course-info {
        flex: 1;

        .course-name {
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--el-text-color-primary);
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color-lighter);
      border-radius: 8px;
    }
  }
}

@media (max-width: 768px) {
  .welcome-card {
    :deep(.el-card__body) {
      padding: 24px;
    }

    .welcome-content {
      flex-direction: column;
      align-items: flex-start;

      .welcome-text .welcome-title {
        font-size: 24px;
      }

      .welcome-actions {
        width: 100%;

        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>