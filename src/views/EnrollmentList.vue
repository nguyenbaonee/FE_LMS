<template>
  <div class="page-container">
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">Quản lý đăng ký học</h2>
          <el-tag type="info">Tổng: {{ total }} đăng ký</el-tag>
        </div>
        <div class="header-right">
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            Đăng ký học mới
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="Học viên">
          <el-select
              v-model="searchForm.studentId"
              placeholder="Chọn học viên"
              clearable
              filterable
              style="width: 200px"
          >
            <el-option
                v-for="student in students"
                :key="student.id"
                :label="student.name"
                :value="student.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Khóa học">
          <el-select
              v-model="searchForm.courseId"
              placeholder="Chọn khóa học"
              clearable
              filterable
              style="width: 200px"
          >
            <el-option
                v-for="course in courses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Trạng thái">
          <el-select
              v-model="searchForm.status"
              placeholder="Tất cả"
              clearable
              style="width: 150px"
          >
            <el-option label="Đang học" value="active" />
            <el-option label="Hoàn thành" value="completed" />
            <el-option label="Đã hủy" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            Tìm kiếm
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column type="index" label="STT" width="60" align="center" />

        <el-table-column label="Học viên" min-width="180">
          <template #default="{ row }">
            <div class="student-cell">
              <el-avatar :src="row.studentAvatar" :size="40">
                {{ row.studentName.charAt(0) }}
              </el-avatar>
              <div>
                <div class="student-name">{{ row.studentName }}</div>
                <div class="student-email">{{ row.studentEmail }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Khóa học" min-width="200">
          <template #default="{ row }">
            <div class="course-cell">
              <el-image
                  :src="row.courseThumbnail"
                  fit="cover"
                  style="width: 60px; height: 40px; border-radius: 4px; margin-right: 8px"
              />
              <span>{{ row.courseName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Ngày đăng ký" width="130" align="center">
          <template #default="{ row }">
            {{ formatDate(row.enrolledAt) }}
          </template>
        </el-table-column>

        <el-table-column label="Tiến độ" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" />
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" size="small" :icon="Edit" link @click="handleEdit(row)">
              Sửa
            </el-button>
            <el-button type="danger" size="small" :icon="Delete" link @click="handleDelete(row)">
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Edit,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const students = ref([
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' }
])

const courses = ref([
  { id: 1, name: 'Lập trình Web với Vue 3' },
  { id: 2, name: 'React Native cơ bản' }
])

const searchForm = reactive({
  studentId: '',
  courseId: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const mockData = [
  {
    id: 1,
    studentName: 'Nguyễn Văn A',
    studentEmail: 'nguyenvana@email.com',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    courseName: 'Lập trình Web với Vue 3',
    courseThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    enrolledAt: '2024-01-15',
    progress: 65,
    status: 'active'
  },
  {
    id: 2,
    studentName: 'Trần Thị B',
    studentEmail: 'tranthib@email.com',
    studentAvatar: 'https://i.pravatar.cc/150?img=2',
    courseName: 'React Native cơ bản',
    courseThumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    enrolledAt: '2024-02-01',
    progress: 100,
    status: 'completed'
  }
]

const fetchData = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  tableData.value = mockData
  total.value = mockData.length
  loading.value = false
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '')
  handleSearch()
}

const handleCreate = () => router.push('/enrollments/create')
const handleEdit = (row) => router.push(`/enrollments/${row.id}/edit`)

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa đăng ký của "${row.studentName}"?`,
        'Xác nhận xóa',
        { type: 'warning' }
    )
    ElMessage.success('Xóa đăng ký thành công')
    fetchData()
  } catch (error) {}
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusType = (status) => {
  const types = {
    active: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return types[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    active: 'Đang học',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return texts[status] || ''
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.page-container {
  .page-header {
    margin-bottom: 16px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

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

  .student-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .student-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .student-email {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .course-cell {
    display: flex;
    align-items: center;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>