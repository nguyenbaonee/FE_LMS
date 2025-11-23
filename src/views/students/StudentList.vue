<template>
  <div class="page-container">
    <!-- Header -->
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">Quản lý học viên</h2>
          <el-tag v-if="isByCourse" type="warning" class="tag-large">
            Theo khóa học: {{ route.query.courseName || 'Không rõ' }}
          </el-tag>

          <el-tag type="info" class="tag-large">
            Tổng: {{ total }} học viên
          </el-tag>
        </div>

        <div class="header-right">
          <el-button type="success" :icon="Download" @click="handleExport">
            Xuất theo tìm kiếm
          </el-button>
          <el-button v-if="!isByCourse" type="success" :icon="Download" @click="handleExportAll">
            Xuất tất cả
          </el-button>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            Thêm học viên
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="searchForm">

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

        <el-form-item label="Trạng thái">
          <el-select
              v-model="searchForm.status"
              placeholder="Đang hoạt động"
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
            <el-avatar :src="getAvatarUrl(row)" :size="50">
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
            @size-change="handleSizeChange"
        >
        </el-pagination>

      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed} from 'vue'
import { useRoute,useRouter } from 'vue-router'
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
import apiClient from "../../api/axios.js";
import {useEnrollmentStore} from "../../stores/enrollmentStore.js";

const router = useRouter()
const route = useRoute()

const studentStore = useStudentStore()
const enrollmentStore = useEnrollmentStore()
const isByCourse = ref(false)
const searchForm = reactive({
  name: null,
  email: null,
  status: "ACTIVE"
});
const getAvatarUrl = (row) => {
  const avatar = row.avatar?.find(a => a.primary)
  if (!avatar) return ''
  let url = avatar.url
  if (!url) return ''
  return 'http://localhost:8080' + encodeURI(url)
}

const pagination = reactive({
  page: 1,
  pageSize: 10
})
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}
const tableData = computed(() => {
  if (route.query.courseId) return enrollmentStore.studentsOfCourse
  return studentStore.students
})
const loading = computed(() => {
  return isByCourse.value ? enrollmentStore.loading : studentStore.loading
})

const total = computed(() => {
  return isByCourse.value ? enrollmentStore.total : studentStore.total
})

const fetchData = () => {
  if (route.query.courseId) {
    isByCourse.value = true
    enrollmentStore.fetchStudentsOfCourse({
      courseId: route.query.courseId,
      status: route.query.status
    })
  } else {
    isByCourse.value = false
    const statusStr = searchForm.status === 1 ? 'ACTIVE' : searchForm.status === 0 ? 'DELETED' : 'ACTIVE'
    studentStore.fetchStudents({
      name: searchForm.name,
      email: searchForm.email,
      status: statusStr,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
  }
}

const handleSearch = async () => {
  pagination.page = 1
  await fetchData()
}

const handleReset = () => {
  searchForm.name = null;
  searchForm.email = null;
  searchForm.status = 1;
  handleSearch();
}

const handleCreate = () => {
  router.push('/students/create')
}

const handleView = (row) => {
  router.push({
    path: `/students/${row.id}`,
    query: { status: row.status }
  })
}


const handleEdit = (row) => {
  router.push({
    path: `/students/${row.id}/edit`,
    query: { status: row.status }
  })
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
const handleExportAll = async () => {
  try {
    const res = await apiClient.get('/students/export', {
      responseType: 'blob'
    })

    const filename = `student_report_${Date.now()}.xlsx`
    const url = window.URL.createObjectURL(res.data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()

    ElMessage.success('Xuất Excel thành công')
  } catch (error) {
    console.error(error)
    if (error.response && error.response.data) {
      // có thể backend trả lỗi JSON dạng AppException
      const reader = new FileReader()
      reader.onload = () => {
        const msg = reader.result
        ElMessage.error(msg)
      }
      reader.readAsText(error.response.data)
    } else {
      ElMessage.error('Lỗi xuất Excel')
    }
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

        /* Nổi bật */
        background-color: #f0f8ff;   /* nền nhạt, dễ nhìn */
        padding: 8px 16px;            /* khoảng cách bên trong */
        border-radius: 8px;           /* bo góc mềm mại */
        box-shadow: 0 2px 6px rgba(0,0,0,0.15); /* đổ bóng nhẹ */
        font-weight: 500;
        .page-title {
          margin: 0;
          font-size: 25px;
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
.tag-large {
  font-size: 1.2rem;  /* tăng chữ lên */
  font-weight: 600;   /* chữ đậm hơn */
  padding: 6px 12px;  /* tùy chỉnh padding nếu muốn to hơn */
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