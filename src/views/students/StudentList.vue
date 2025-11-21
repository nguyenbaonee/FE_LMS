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

        <!-- Name input -->
        <el-form-item label="Tên">
          <el-input
              v-model="searchForm.name"
              placeholder="Nhập tên"
              :prefix-icon="Search"
              clearable
              style="width: 200px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
          />
        </el-form-item>

        <!-- Email input -->
        <el-form-item label="Email">
          <el-input
              v-model="searchForm.email"
              placeholder="Nhập email"
              :prefix-icon="Search"
              clearable
              style="width: 200px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
          />
        </el-form-item>

        <!-- Status select -->
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

        <!-- Buttons -->
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
            <el-avatar
                :src="'http://localhost:8080' + (row.avatar?.find(a => a.primary)?.url || '')"
                :size="50"
            >
              {{ row.name.charAt(0) }}
            </el-avatar>

          </template>
        </el-table-column>

        <el-table-column prop="name" label="Họ tên" min-width="150" />

        <el-table-column prop="email" label="Email" min-width="180" />

        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="(row.status === 1 || row.status === 'ACTIVE') ? 'success' : 'danger'">
              {{ (row.status === 1||row.status === "ACTIVE") ? 'Hoạt động' : 'Đã xóa' }}
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
                v-if="row.status === 'ACTIVE'"
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
            :total="total"
            :page-sizes="[5, 10, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="fetchData"
            @size-change="fetchData"
        >
        </el-pagination>

      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {useStudentStore} from "../../stores/studentStore.js";
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

const studentStore = useStudentStore()

const searchForm = reactive({
  name: null,
  email: null,
  status: "ACTIVE"
});

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const tableData = computed(() => studentStore.students)
const loading = computed(() => studentStore.loading)
const total = computed(() => studentStore.total)


const fetchData = () => {
  const statusStr = searchForm.status === 1 ? 'ACTIVE' : searchForm.status === 0 ? 'DELETED' : 'ACTIVE'
  studentStore.fetchStudents({
    name: searchForm.name,
    email: searchForm.email,
    status: statusStr,
    page: pagination.page,
    pageSize: pagination.pageSize
  })
}


const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.name = '';
  searchForm.email = '';
  searchForm.status = null;
  handleSearch();
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
    studentStore.deleteStudent(row.id)

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
      'Trạng thái': (item.status === 1 || item.status === "ACTIVE") ? 'Hoạt động' : 'Đã xóa'
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