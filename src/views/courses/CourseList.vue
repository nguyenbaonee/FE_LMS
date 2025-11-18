<template>
  <div class="page-container">
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">Quản lý khóa học</h2>
          <el-tag type="info">Tổng: {{ total }} khóa học</el-tag>
        </div>
        <div class="header-right">
          <el-button type="success" :icon="Download" @click="handleExport">
            Xuất Excel
          </el-button>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            Thêm khóa học
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="Tìm kiếm">
          <el-input
              v-model="searchForm.keyword"
              placeholder="Tên khóa học, mô tả..."
              :prefix-icon="Search"
              clearable
              style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="Danh mục">
          <el-select v-model="searchForm.category" placeholder="Tất cả" clearable>
            <el-option label="Lập trình Web" value="web" />
            <el-option label="Mobile" value="mobile" />
            <el-option label="Thiết kế" value="design" />
          </el-select>
        </el-form-item>

        <el-form-item label="Trạng thái">
          <el-select v-model="searchForm.status" placeholder="Tất cả" clearable>
            <el-option label="Đang hoạt động" :value="1" />
            <el-option label="Đã xóa" :value="0" />
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

        <el-table-column label="Thumbnail" width="120" align="center">
          <template #default="{ row }">
            <el-image
                :src="row.thumbnail"
                :preview-src-list="[row.thumbnail]"
                fit="cover"
                style="width: 80px; height: 50px; border-radius: 4px"
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
            <el-link type="primary" @click="viewLessons(row)">
              {{ row.lessonCount }} bài
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? 'Hoạt động' : 'Đã xóa' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="info" size="small" link @click="viewStudents(row)">
              Học viên
            </el-button>
            <el-button type="primary" size="small" :icon="View" link @click="handleView(row)">
              Xem
            </el-button>
            <el-button type="warning" size="small" :icon="Edit" link @click="handleEdit(row)">
              Sửa
            </el-button>
            <el-button
                v-if="row.status === 1"
                type="danger"
                size="small"
                :icon="Delete"
                link
                @click="handleDelete(row)"
            >
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
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
  Download,
  View,
  Edit,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  category: '',
  status: null
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const mockData = [
  {
    id: 1,
    name: 'Lập trình Web với Vue 3',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    price: 599000,
    studentCount: 45,
    lessonCount: 25,
    category: 'web',
    status: 1
  },
  {
    id: 2,
    name: 'React Native cơ bản',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    price: 799000,
    studentCount: 32,
    lessonCount: 30,
    category: 'mobile',
    status: 1
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
  Object.keys(searchForm).forEach(key => searchForm[key] = key === 'status' ? null : '')
  handleSearch()
}

const handleCreate = () => router.push('/courses/create')
const handleView = (row) => router.push(`/courses/${row.id}`)
const handleEdit = (row) => router.push(`/courses/${row.id}/edit`)
const viewLessons = (row) => router.push(`/courses/${row.id}/lessons`)
const viewStudents = (row) => router.push(`/courses/${row.id}/students`)

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa khóa học "${row.name}"?`,
        'Xác nhận xóa',
        { type: 'warning' }
    )
    ElMessage.success('Xóa khóa học thành công')
    fetchData()
  } catch (error) {}
}

const handleExport = () => {
  ElMessage.success('Xuất Excel thành công')
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
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

      .header-right {
        display: flex;
        gap: 8px;
      }
    }
  }

  .filter-card {
    margin-bottom: 16px;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>