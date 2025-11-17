<template>
  <div class="page-container">
    <!-- Header -->
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">Quản lý học viên</h2>
          <el-tag type="info">Tổng: {{ total }} học viên</el-tag>
        </div>
        <div class="header-right">
          <el-button type="success" :icon="Download" @click="handleExport">
            Xuất Excel
          </el-button>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            Thêm học viên
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Search & Filter -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="Tìm kiếm">
          <el-input
              v-model="searchForm.keyword"
              placeholder="Tên, email, số điện thoại..."
              :prefix-icon="Search"
              clearable
              style="width: 300px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="Trạng thái">
          <el-select
              v-model="searchForm.status"
              placeholder="Tất cả"
              clearable
              style="width: 150px"
          >
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

    <!-- Table -->
    <el-card shadow="never">
      <el-table
          v-loading="loading"
          :data="tableData"
          stripe
          style="width: 100%"
      >
        <el-table-column type="index" label="STT" width="60" align="center" />

        <el-table-column label="Avatar" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="50">
              {{ row.name.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Họ tên" min-width="150" />

        <el-table-column prop="email" label="Email" min-width="180" />

        <el-table-column prop="phone" label="Số điện thoại" width="130" />

        <el-table-column label="Ngày sinh" width="120">
          <template #default="{ row }">
            {{ formatDate(row.birthDate) }}
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? 'Hoạt động' : 'Đã xóa' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                :icon="View"
                link
                @click="handleView(row)"
            >
              Xem
            </el-button>
            <el-button
                type="warning"
                size="small"
                :icon="Edit"
                link
                @click="handleEdit(row)"
            >
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

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSearch"
            @current-change="handleSearch"
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
import * as XLSX from 'xlsx'

const router = useRouter()

// State
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  status: null
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

// Mock data - thay bằng API call thực tế
const mockData = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    birthDate: '2000-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 1
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0912345678',
    birthDate: '1999-05-20',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 1
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0923456789',
    birthDate: '2001-08-10',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 0
  }
]

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    // TODO: Call API
    // const response = await studentAPI.getList(searchForm, pagination)

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500))

    tableData.value = mockData
    total.value = mockData.length
  } catch (error) {
    ElMessage.error('Lỗi tải dữ liệu')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = null
  handleSearch()
}

const handleCreate = () => {
  router.push('/students/create')
}

const handleView = (row) => {
  router.push(`/students/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/students/${row.id}/edit`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa học viên "${row.name}"?`,
        'Xác nhận xóa',
        {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
    )

    // TODO: Call API delete
    // await studentAPI.delete(row.id)

    ElMessage.success('Xóa học viên thành công')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Lỗi xóa học viên')
    }
  }
}

const handleExport = () => {
  try {
    const exportData = tableData.value.map((item, index) => ({
      'STT': index + 1,
      'Họ tên': item.name,
      'Email': item.email,
      'Số điện thoại': item.phone,
      'Ngày sinh': formatDate(item.birthDate),
      'Trạng thái': item.status === 1 ? 'Hoạt động' : 'Đã xóa'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Học viên')
    XLSX.writeFile(wb, `danh-sach-hoc-vien-${Date.now()}.xlsx`)

    ElMessage.success('Xuất Excel thành công')
  } catch (error) {
    ElMessage.error('Lỗi xuất Excel')
  }
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

@media (max-width: 768px) {
  .header-content {
    .header-left,
    .header-right {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
