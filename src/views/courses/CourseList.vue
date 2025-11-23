<template>
  <div class="page-container">
    <!-- Header -->
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">{{ $t('course.header.title') }}</h2>
        </div>
        <div class="header-right">
          <el-button type="success" :icon="Download" @click="handleExport">
            {{ $t('course.header.export') }}
          </el-button>
          <el-button type="success" :icon="Download" @click="handleExportAll">
            {{ $t('course.header.exportAll') }}
          </el-button>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            {{ $t('course.header.add') }}
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Filter Form -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="searchForm" class="filter-form">
        <el-form-item :label="$t('course.filter.name')">
          <el-input
              v-model="searchForm.name"
              :placeholder="$t('course.filter.namePlaceholder')"
              clearable
              style="width: 200px"
          />
        </el-form-item>

        <el-form-item :label="$t('course.filter.code')">
          <el-input
              v-model="searchForm.code"
              :placeholder="$t('course.filter.codePlaceholder')"
              clearable
              style="width: 150px"
          />
        </el-form-item>

        <el-form-item :label="$t('course.filter.status')">
          <el-select v-model="searchForm.status" :placeholder="$t('course.filter.statusPlaceholder')" clearable style="width: 150px">
            <el-option :label="$t('course.status.active')" value="ACTIVE" />
            <el-option :label="$t('course.status.deleted')" value="DELETED" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            {{ $t('course.filter.search') }}
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button :icon="Refresh" @click="handleReset">
            {{ $t('course.filter.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Table -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column type="index" :label="$t('course.table.index')" width="60" align="center" />

        <el-table-column :label="$t('course.table.thumbnail')" width="120" align="center">
          <template #default="{ row }">
            <el-image
                :src="getPrimaryThumbnailUrl(row)"
                :preview-src-list="row.thumbnail?.map(t => 'http://localhost:8080' + encodeURI(t.url)) || []"
                fit="cover"
                style="width: 80px; height: 50px; border-radius: 4px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('course.table.name')" min-width="150" />
        <el-table-column prop="code" :label="$t('course.table.code')" width="120" align="right" />
        <el-table-column prop="description" :label="$t('course.table.description')" width="200" align="right" />

        <el-table-column :label="$t('course.table.lessons')" width="100" align="center">
          <template #default="{ row }">
            <el-link type="primary" @click="viewLessons(row)">
              {{ $t('course.table.viewLessons') }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column :label="$t('course.table.status')" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? $t('course.status.active') : $t('course.status.deleted') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('course.table.actions')" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="info" size="small" link @click="viewStudents(row)">
              {{ $t('course.table.viewStudents') }}
            </el-button>
            <el-button type="warning" size="small" :icon="Edit" link @click="handleEdit(row)">
              {{ $t('course.table.edit') }}
            </el-button>
            <el-button
                v-if="row.status === 'ACTIVE'"
                type="danger"
                size="small"
                :icon="Delete"
                link
                @click="handleDelete(row)"
            >
              {{ $t('course.table.delete') }}
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
import { reactive, computed, onMounted, watch } from 'vue'
import { useCourseStore } from '../../stores/courseStore.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Plus,
  Search,
  Refresh,
  Download,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import * as XLSX from "xlsx";
import axios from '../../api/axios.js'

const courseStore = useCourseStore()
const router = useRouter()
const searchForm = reactive({
  name: null,
  code: null,
  status: 'ACTIVE'
})
const handleExportAll = async () => {
  try {
    const params = {
      name: searchForm.name || undefined,
      code: searchForm.code || undefined,
      status: searchForm.status || undefined
    }

    const res = await axios.get('/courses/export', {
      params,
      responseType: 'blob'
    })

    const filename = `course_report_${Date.now()}.xlsx`
    const url = window.URL.createObjectURL(res.data)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
    ElMessage.success('Xuất Excel khóa học thành công')
  } catch (error) {
    console.error(error)
    ElMessage.error('Lỗi xuất Excel')
  }
}


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

const getPrimaryThumbnailUrl = (course) => {
  const thumbnail = course.thumbnail?.find(t => t.primary)
  if (!thumbnail) return ''
  const url = thumbnail.url
  if (!url) return ''
  return 'http://localhost:8080' + encodeURI(url)
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
    await ElMessageBox.confirm(`Xóa khóa học sẽ mất các bài học, ẻnollment vẫn giữ lịch sử, xác nhận? "${row.name}"?`, 'Xác nhận', {
      type: 'warning'
    })
    await courseStore.deleteCourse(row.id)
    ElMessage.success('Xóa khóa học thành công')
  } catch (err) {
    console.log(err)
  }
}

const viewStudents = (row) => {
  router.push({
    path: `/students`,
    query: { status: row.status, courseId: row.id,courseName: row.name }
  });
};

const viewLessons = (row) => {
  router.push({
    path: `/courses/${row.id}/lessons`,
    query: { status: row.status, name: row.name }
  });
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