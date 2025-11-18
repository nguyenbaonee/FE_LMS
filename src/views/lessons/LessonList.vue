<template>
  <div class="page-container">
    <el-card shadow="never" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">Quản lý bài học</h2>
          <el-tag v-if="courseName" type="warning">
            Khóa học: {{ courseName }}
          </el-tag>
          <el-tag type="info">Tổng: {{ total }} bài học</el-tag>
        </div>
        <div class="header-right">
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            Thêm bài học
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="Khóa học">
          <el-select
              v-model="searchForm.courseId"
              placeholder="Chọn khóa học"
              clearable
              style="width: 250px"
              @change="handleSearch"
          >
            <el-option
                v-for="course in courses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Tìm kiếm">
          <el-input
              v-model="searchForm.keyword"
              placeholder="Tên bài học..."
              :prefix-icon="Search"
              clearable
              style="width: 250px"
          />
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

        <el-table-column prop="title" label="Tiêu đề" min-width="250" />

        <el-table-column prop="courseName" label="Khóa học" width="200" />

        <el-table-column label="Video" width="100" align="center">
          <template #default="{ row }">
            <el-button
                v-if="row.videoUrl"
                type="primary"
                size="small"
                link
                @click="previewVideo(row)"
            >
              <el-icon><VideoPlay /></el-icon>
              Xem
            </el-button>
            <el-text v-else type="info">Chưa có</el-text>
          </template>
        </el-table-column>

        <el-table-column label="Thời lượng" width="100" align="center">
          <template #default="{ row }">
            {{ row.duration }}
          </template>
        </el-table-column>

        <el-table-column label="Thứ tự" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.order }}</el-tag>
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
            :page-sizes="[10, 20, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- Video Preview Dialog -->
    <el-dialog v-model="videoDialogVisible" title="Xem video" width="70%">
      <video
          v-if="currentVideo"
          :src="currentVideo"
          controls
          style="width: 100%"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  View,
  Edit,
  Delete,
  VideoPlay
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const videoDialogVisible = ref(false)
const currentVideo = ref('')

const courses = ref([
  { id: 1, name: 'Lập trình Web với Vue 3' },
  { id: 2, name: 'React Native cơ bản' }
])

const searchForm = reactive({
  courseId: route.params.courseId || '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const courseName = computed(() => {
  const course = courses.value.find(c => c.id == searchForm.courseId)
  return course?.name || ''
})

const mockData = [
  {
    id: 1,
    title: 'Giới thiệu về Vue 3',
    courseName: 'Lập trình Web với Vue 3',
    courseId: 1,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '15:30',
    order: 1,
    status: 1
  },
  {
    id: 2,
    title: 'Cài đặt môi trường',
    courseName: 'Lập trình Web với Vue 3',
    courseId: 1,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '20:45',
    order: 2,
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
  searchForm.keyword = ''
  if (!route.params.courseId) {
    searchForm.courseId = ''
  }
  handleSearch()
}

const handleCreate = () => {
  const query = searchForm.courseId ? { courseId: searchForm.courseId } : {}
  router.push({ path: '/lessons/create', query })
}

const handleView = (row) => router.push(`/lessons/${row.id}`)
const handleEdit = (row) => router.push(`/lessons/${row.id}/edit`)

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa bài học "${row.title}"?`,
        'Xác nhận xóa',
        { type: 'warning' }
    )
    ElMessage.success('Xóa bài học thành công')
    fetchData()
  } catch (error) {}
}

const previewVideo = (row) => {
  currentVideo.value = row.videoUrl
  videoDialogVisible.value = true
}

onMounted(() => {
  if (route.params.courseId) {
    searchForm.courseId = route.params.courseId
  }
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
        flex-wrap: wrap;

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

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>