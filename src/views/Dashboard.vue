<!-- ============================================ -->
<!-- Dashboard.vue - Trang quản lý tổng hợp -->
<!-- ============================================ -->
<template>
  <div class="dashboard">
    <!-- Header Statistics -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" :lg="8" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
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

    <!-- ========================================== -->
    <!-- QUẢN LÝ HỌC VIÊN -->
    <!-- ========================================== -->
    <el-card shadow="never" class="section-card" style="margin-top: 20px">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <el-icon :size="20" color="#667eea"><UserFilled /></el-icon>
            <span>Quản lý học viên</span>
          </div>
          <el-button type="primary" :icon="Plus" @click="router.push('/students/create')">
            Thêm học viên
          </el-button>
        </div>
      </template>

      <!-- Search & Actions for Students -->
      <div class="section-toolbar">
        <el-input
            v-model="studentSearch"
            placeholder="Tìm kiếm học viên theo tên, email..."
            :prefix-icon="Search"
            clearable
            style="max-width: 400px"
            @keyup.enter="handleSearchStudent"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearchStudent">Tìm</el-button>
          </template>
        </el-input>
        <el-button :icon="Refresh" @click="refreshStudents">Làm mới</el-button>
      </div>

      <!-- Student List -->
      <el-table :data="filteredStudents" stripe style="width: 100%; margin-top: 16px">
        <el-table-column type="index" label="STT" width="60" align="center" />

        <el-table-column label="Avatar" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40">
              {{ row.name.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Họ tên" min-width="150" />
        <el-table-column prop="email" label="Email" min-width="200" />

        <el-table-column label="Khóa học" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.courseCount }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewStudent(row)">
              Xem
            </el-button>
            <el-button type="warning" size="small" link @click="editStudent(row)">
              Sửa
            </el-button>
            <el-button type="danger" size="small" link @click="deleteStudent(row)">
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="section-footer">
        <el-button type="primary" link @click="router.push('/students')">
          Xem tất cả học viên →
        </el-button>
      </div>
    </el-card>

    <!-- ========================================== -->
    <!-- QUẢN LÝ KHÓA HỌC -->
    <!-- ========================================== -->
    <el-card shadow="never" class="section-card" style="margin-top: 20px">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <el-icon :size="20" color="#f5576c"><Reading /></el-icon>
            <span>Quản lý khóa học</span>
          </div>
          <el-button type="success" :icon="Plus" @click="router.push('/courses/create')">
            Thêm khóa học
          </el-button>
        </div>
      </template>

      <!-- Search & Actions for Courses -->
      <div class="section-toolbar">
        <el-input
            v-model="courseSearch"
            placeholder="Tìm kiếm khóa học theo tên..."
            :prefix-icon="Search"
            clearable
            style="max-width: 400px"
            @keyup.enter="handleSearchCourse"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearchCourse">Tìm</el-button>
          </template>
        </el-input>
        <el-button :icon="Refresh" @click="refreshCourses">Làm mới</el-button>
      </div>

      <!-- Course List -->
      <el-table :data="filteredCourses" stripe style="width: 100%; margin-top: 16px">
        <el-table-column type="index" label="STT" width="60" align="center" />

        <el-table-column label="Thumbnail" width="100" align="center">
          <template #default="{ row }">
            <el-image
                :src="row.thumbnail"
                fit="cover"
                style="width: 70px; height: 45px; border-radius: 4px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Tên khóa học" min-width="200" />

        <el-table-column label="Giá" width="120" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.price) }}
          </template>
        </el-table-column>

        <el-table-column label="Học viên" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.studentCount }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Bài học" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info">{{ row.lessonCount }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewCourse(row)">
              Xem
            </el-button>
            <el-button type="warning" size="small" link @click="editCourse(row)">
              Sửa
            </el-button>
            <el-button type="danger" size="small" link @click="deleteCourse(row)">
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="section-footer">
        <el-button type="primary" link @click="router.push('/courses')">
          Xem tất cả khóa học →
        </el-button>
      </div>
    </el-card>

    <!-- ========================================== -->
    <!-- QUẢN LÝ BÀI HỌC -->
    <!-- ========================================== -->
    <el-card shadow="never" class="section-card" style="margin-top: 20px">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <el-icon :size="20" color="#00f2fe"><Document /></el-icon>
            <span>Quản lý bài học</span>
          </div>
          <el-button type="warning" :icon="Plus" @click="router.push('/lessons/create')">
            Thêm bài học
          </el-button>
        </div>
      </template>

      <!-- Search & Actions for Lessons -->
      <div class="section-toolbar">
        <el-input
            v-model="lessonSearch"
            placeholder="Tìm kiếm bài học theo tên..."
            :prefix-icon="Search"
            clearable
            style="max-width: 400px"
            @keyup.enter="handleSearchLesson"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearchLesson">Tìm</el-button>
          </template>
        </el-input>
        <el-select
            v-model="selectedCourseFilter"
            placeholder="Lọc theo khóa học"
            clearable
            style="width: 200px; margin-left: 8px"
            @change="handleFilterLesson"
        >
          <el-option
              v-for="course in coursesList"
              :key="course.id"
              :label="course.name"
              :value="course.id"
          />
        </el-select>
        <el-button :icon="Refresh" @click="refreshLessons">Làm mới</el-button>
      </div>

      <!-- Lesson List -->
      <el-table :data="filteredLessons" stripe style="width: 100%; margin-top: 16px">
        <el-table-column type="index" label="STT" width="60" align="center" />

        <el-table-column label="Thumbnail" width="100" align="center">
          <template #default="{ row }">
            <el-image
                :src="row.thumbnail"
                fit="cover"
                style="width: 70px; height: 45px; border-radius: 4px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="title" label="Tiêu đề" min-width="200" />
        <el-table-column prop="courseName" label="Khóa học" width="180" />

        <el-table-column label="Thời lượng" width="100" align="center">
          <template #default="{ row }">
            {{ row.duration }}
          </template>
        </el-table-column>

        <el-table-column label="Video" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.hasVideo" color="#67c23a" :size="20">
              <VideoPlay />
            </el-icon>
            <el-text v-else type="info" size="small">-</el-text>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewLesson(row)">
              Xem
            </el-button>
            <el-button type="warning" size="small" link @click="editLesson(row)">
              Sửa
            </el-button>
            <el-button type="danger" size="small" link @click="deleteLesson(row)">
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="section-footer">
        <el-button type="primary" link @click="router.push('/lessons')">
          Xem tất cả bài học →
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  Reading,
  Document,
  Tickets,
  Plus,
  Search,
  Refresh,
  VideoPlay
} from '@element-plus/icons-vue'

const router = useRouter()

// Statistics
const stats = [
  {
    title: 'Tổng học viên',
    value: '1,234',
    icon: UserFilled,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Tổng khóa học',
    value: '56',
    icon: Reading,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: 'Tổng bài học',
    value: '342',
    icon: Document,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
]

// ========================================
// STUDENTS DATA & METHODS
// ========================================
const studentSearch = ref('')
const studentsData = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    courseCount: 3
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    courseCount: 2
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    courseCount: 5
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    courseCount: 1
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    courseCount: 4
  }
])

const filteredStudents = computed(() => {
  if (!studentSearch.value) {
    return studentsData.value.slice(0, 5) // Show first 5
  }
  const search = studentSearch.value.toLowerCase()
  return studentsData.value.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search)
  )
})

const handleSearchStudent = () => {
  ElMessage.info(`Tìm kiếm: ${studentSearch.value}`)
}

const refreshStudents = () => {
  studentSearch.value = ''
  ElMessage.success('Đã làm mới danh sách học viên')
}

const viewStudent = (row) => {
  router.push(`/students/${row.id}`)
}

const editStudent = (row) => {
  router.push(`/students/${row.id}/edit`)
}

const deleteStudent = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa học viên "${row.name}"?`,
        'Xác nhận xóa',
        { type: 'warning' }
    )
    ElMessage.success('Xóa học viên thành công')
    // TODO: Call API delete
  } catch (error) {}
}

// ========================================
// COURSES DATA & METHODS
// ========================================
const courseSearch = ref('')
const coursesData = ref([
  {
    id: 1,
    name: 'Lập trình Web với Vue 3',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    price: 599000,
    studentCount: 45,
    lessonCount: 25
  },
  {
    id: 2,
    name: 'React Native cơ bản',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    price: 799000,
    studentCount: 32,
    lessonCount: 30
  },
  {
    id: 3,
    name: 'UI/UX Design chuyên nghiệp',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200',
    price: 499000,
    studentCount: 56,
    lessonCount: 20
  },
  {
    id: 4,
    name: 'Node.js Backend Development',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200',
    price: 699000,
    studentCount: 28,
    lessonCount: 28
  },
  {
    id: 5,
    name: 'Python cho Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200',
    price: 899000,
    studentCount: 41,
    lessonCount: 35
  }
])

const coursesList = computed(() => coursesData.value)

const filteredCourses = computed(() => {
  if (!courseSearch.value) {
    return coursesData.value.slice(0, 5)
  }
  const search = courseSearch.value.toLowerCase()
  return coursesData.value.filter(c =>
      c.name.toLowerCase().includes(search)
  )
})

const handleSearchCourse = () => {
  ElMessage.info(`Tìm kiếm: ${courseSearch.value}`)
}

const refreshCourses = () => {
  courseSearch.value = ''
  ElMessage.success('Đã làm mới danh sách khóa học')
}

const viewCourse = (row) => {
  router.push(`/courses/${row.id}`)
}

const editCourse = (row) => {
  router.push(`/courses/${row.id}/edit`)
}

const deleteCourse = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa khóa học "${row.name}"?`,
        'Xác nhận xóa',
        { type: 'warning' }
    )
    ElMessage.success('Xóa khóa học thành công')
    // TODO: Call API delete
  } catch (error) {}
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

// ========================================
// LESSONS DATA & METHODS
// ========================================
const lessonSearch = ref('')
const selectedCourseFilter = ref('')
const lessonsData = ref([
  {
    id: 1,
    title: 'Giới thiệu về Vue 3',
    courseName: 'Lập trình Web với Vue 3',
    courseId: 1,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    duration: '15:30',
    hasVideo: true
  },
  {
    id: 2,
    title: 'Cài đặt môi trường',
    courseName: 'Lập trình Web với Vue 3',
    courseId: 1,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    duration: '20:45',
    hasVideo: true
  },
  {
    id: 3,
    title: 'Giới thiệu React Native',
    courseName: 'React Native cơ bản',
    courseId: 2,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    duration: '18:20',
    hasVideo: true
  },
  {
    id: 4,
    title: 'Nguyên tắc thiết kế UI',
    courseName: 'UI/UX Design chuyên nghiệp',
    courseId: 3,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200',
    duration: '25:10',
    hasVideo: false
  },
  {
    id: 5,
    title: 'RESTful API với Node.js',
    courseName: 'Node.js Backend Development',
    courseId: 4,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200',
    duration: '30:00',
    hasVideo: true
  }
])

const filteredLessons = computed(() => {
  let result = lessonsData.value

  // Filter by course
  if (selectedCourseFilter.value) {
    result = result.filter(l => l.courseId === selectedCourseFilter.value)
  }

  // Filter by search
  if (lessonSearch.value) {
    const search = lessonSearch.value.toLowerCase()
    result = result.filter(l =>
        l.title.toLowerCase().includes(search) ||
        l.courseName.toLowerCase().includes(search)
    )
  }

  return result.slice(0, 5)
})

const handleSearchLesson = () => {
  ElMessage.info(`Tìm kiếm: ${lessonSearch.value}`)
}

const handleFilterLesson = () => {
  ElMessage.info('Đã lọc theo khóa học')
}

const refreshLessons = () => {
  lessonSearch.value = ''
  selectedCourseFilter.value = ''
  ElMessage.success('Đã làm mới danh sách bài học')
}

const viewLesson = (row) => {
  router.push(`/lessons/${row.id}`)
}

const editLesson = (row) => {
  router.push(`/lessons/${row.id}/edit`)
}

const deleteLesson = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa bài học "${row.title}"?`,
        'Xác nhận xóa',
        { type: 'warning' }
    )
    ElMessage.success('Xóa bài học thành công')
    // TODO: Call API delete
  } catch (error) {}
}
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

  .section-card {
    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 2px solid var(--el-border-color-lighter);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .section-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .section-footer {
      margin-top: 16px;
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }
}

@media (max-width: 768px) {
  .section-toolbar {
    flex-direction: column;
    align-items: stretch !important;

    .el-input,
    .el-select {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
}
</style>