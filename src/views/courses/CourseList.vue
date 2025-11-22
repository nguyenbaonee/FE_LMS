<template>
  <div class="page-container">
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">Quản lý khóa học</h2>
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
      <el-form :inline="true" :model="searchForm" class="filter-form">
        <!-- Ô 1: Name -->
        <el-form-item label="Tên khóa học">
          <el-input
              v-model="searchForm.name"
              placeholder="Nhập tên khóa học"
              clearable
              style="width: 200px"
          />
        </el-form-item>

        <!-- Ô 2: Code -->
        <el-form-item label="Mã khóa học">
          <el-input
              v-model="searchForm.code"
              placeholder="Nhập mã khóa học"
              clearable
              style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="searchForm.status" placeholder="Đang hoạt động" clearable style="width: 150px">
            <el-option label="Đang hoạt động" value="ACTIVE" />
            <el-option label="Đã xóa" value="DELETED" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">Tìm kiếm</el-button>
        </el-form-item>

        <!-- Ô 5: Reset -->
        <el-form-item>
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

        <el-table-column label="Mã khóa học" width="120" align="right">
          <template #default="{ row }">
            {{ row.code }}
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
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? 'Hoạt động' : 'Đã xóa' }}
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
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useCourseStore } from '../../stores/courseStore.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Plus,
  Search,
  Refresh,
  Download,
  View,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import * as XLSX from "xlsx";

const courseStore = useCourseStore()
const router = useRouter()

const searchForm = reactive({
  name: null,
  code: null,
  status: 'ACTIVE'
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const tableData = computed(() => courseStore.courses)

const total = computed(() => courseStore.total)
const loading = computed(() => courseStore.loading)

// --- Methods ---

const fetchData = async () => {
  await courseStore.fetchCourses({
    name: searchForm.name,
    code: searchForm.code,
    status: searchForm.status || 'ACTIVE',
    page: pagination.page,
    pageSize: pagination.pageSize
  })
}

const handleSearch = async () => {
  pagination.page = 1
  await fetchData()
}

const handleReset = async () => {
  searchForm.name = null;
  searchForm.email = null;
  searchForm.status = "ACTIVE";
  pagination.page = 1
  await fetchData()
}

const handleCreate = () => {
  router.push('/courses/create')
}

const handleEdit = (row) => {
  router.push({
    path: `/courses/${row.id}/edit`,
    query: { status: row.status }
  })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`Bạn có chắc muốn xóa khóa học "${row.name}"?`, 'Xác nhận', {
      type: 'warning'
    })
    await courseStore.deleteCourse(row.id)
    ElMessage.success('Xóa khóa học thành công')
  } catch (err) {
    console.log(err)
  }
}

const handleView = (row) => {
  console.log('View course', row)
}

const viewLessons = (row) => {
  console.log('View lessons of course', row)
}

const viewStudents = (row) => {
  console.log('View students of course', row)
}

const handleExport = () => {
  try {
    const exportData = tableData.value.map((item, index) => ({
      'STT': index + 1,
      'Tên khóa học': item.name,


      'Mã khóa học': item.code,
      'Trạng thái': (item.status === 1 || item.status === "ACTIVE") ? 'Hoạt động' : 'Đã xóa'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Khóa học')
    XLSX.writeFile(wb, `danh-sach-khoa-hoc-${Date.now()}.xlsx`)

    ElMessage.success('Xuất Excel thành công')
  } catch (error) {
    ElMessage.error('Lỗi xuất Excel')
  }
}

watch(
    () => [pagination.page, pagination.pageSize],
    async () => {
      await fetchData()
    }
)

onMounted(async () => {
  await fetchData()
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
</style>