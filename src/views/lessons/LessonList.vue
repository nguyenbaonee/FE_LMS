<template>
  <div class="page-container">
    <!-- Header -->
    <el-card shadow="never" class="page-header" style="padding: 20px;">
      <div class="header-content" style="display: flex; justify-content: space-between; align-items: center;">
        <div class="header-left">
          <h2 class="page-title">{{ $t('lesson.header.title') }}</h2>
          <el-tag v-if="courseName" type="warning">
            {{ courseName }}
          </el-tag>
          <el-tag type="info">{{ $t('lesson.header.total') }}: {{ total }} {{ $t('lesson.header.lesson') }}</el-tag>
        </div>

        <div class="header-right" style="display: flex; gap: 10px; align-items: center;">
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            {{ $t('lesson.header.addLesson') }}
          </el-button>

          <!-- Dropdown trạng thái bo tròn -->
          <el-select
              v-model="searchForm.status"
              :placeholder="$t('lesson.header.statusPlaceholder')"
              clearable
              style="width: 150px; border-radius: 8px; height: 36px;"
              @change="onStatusChange"
          >
            <el-option :label="$t('lesson.status.active')" value="ACTIVE" />
            <el-option :label="$t('lesson.status.deleted')" value="DELETED" />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- Table -->
    <el-card shadow="never">
      <el-table
          v-loading="loading"
          :data="sortedTableData"
          :row-key="row => row.id"
          stripe
      >
        <el-table-column type="index" :label="$t('lesson.table.index')" width="60" align="center" />

        <!-- Thumbnail -->
        <el-table-column :label="$t('lesson.table.thumbnail')" width="120" align="center">
          <template #default="{ row }">
            <el-image
                :src="getThumbnail(row.thumbnails)"
                :preview-src-list="[getThumbnail(row.thumbnails)]"
                fit="cover"
                style="width: 80px; height: 50px; border-radius: 4px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="title" :label="$t('lesson.table.title')" min-width="200" />
        <el-table-column :label="$t('lesson.table.course')" width="200">
          <template #default="{ row }">
            {{ courseName }}
          </template>
        </el-table-column>

        <!-- Video -->
        <el-table-column :label="$t('lesson.table.video')" width="100" align="center">
          <template #default="{ row }">
            <el-button
                v-if="getVideo(row.thumbnails)"
                type="primary"
                size="small"
                link
                @click="previewVideo(row)"
            >
              <el-icon><VideoPlay /></el-icon>
              {{ $t('lesson.table.view') }}
            </el-button>
            <el-text v-else type="info">{{ $t('lesson.table.noVideo') }}</el-text>
          </template>
        </el-table-column>

        <!-- Status -->
        <el-table-column :label="$t('lesson.table.status')" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? $t('lesson.status.active') : $t('lesson.status.deleted') }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column :label="$t('lesson.table.actions')" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" :icon="View" link @click="handleView(row)">
              {{ $t('lesson.table.view') }}
            </el-button>
            <el-button type="warning" size="small" :icon="Edit" link @click="handleEdit(row)">
              {{ $t('lesson.table.edit') }}
            </el-button>
            <el-button
                v-if="row.status === 'ACTIVE'"
                type="danger"
                size="small"
                :icon="Delete"
                link
                @click="handleDelete(row)"
            >
              {{ $t('lesson.table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="onPageChange"
            @size-change="onPageSizeChange"
        />
      </div>
    </el-card>

    <!-- Video Preview Dialog -->
    <el-dialog v-model="videoDialogVisible" :title="$t('lesson.videoDialog.title')" width="70%">
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
import { useLessonStore } from '../../stores/lessonStore.js'
import { Plus, View, Edit, Delete, VideoPlay } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const lessonStore = useLessonStore()

const videoDialogVisible = ref(false)
const currentVideo = ref('')
const courseName = ref(route.query.name || '');

const searchForm = reactive({
  courseId: route.params.courseId || '',
  keyword: ''
})
const pagination = reactive({
  page: 1,
  pageSize: 10
})
const sortedTableData = computed(() => {
  return [...lessonStore.lessons].sort((a, b) => a.lessonOrder - b.lessonOrder)
})
const total = computed(() => lessonStore.total)
const loading = computed(() => lessonStore.loading)

const getThumbnail = (thumbnails) => {
  const thumbnail = thumbnails?.find(t => t.primary && t.type === 'THUMBNAIL');
  if (!thumbnail || !thumbnail.url) return '';
  // thêm host nếu url chưa đầy đủ
  return 'http://localhost:8080' + encodeURI(thumbnail.url);
};

const onStatusChange = (status) => {
  searchForm.status = status;
  fetchData();
};
const getVideo = (thumbnails) => {
  return thumbnails?.find(t => t.type === 'VIDEO')?.url || ''
}

const fetchData = async () => {
  try {
    const status = searchForm.status || 'ACTIVE'
    const courseId = route.params.courseId;
    await lessonStore.fetchLessonsByCourse(
        courseId,
        status,
        pagination.page,
        pagination.pageSize
    )
  } catch (error) {
    console.error('Fetch lessons error:', error)
    const msg = error.response?.data?.message || error.message || 'Không thể tải dữ liệu bài học'
    ElMessage.error(msg)
  }
}

// Pagination events
const onPageChange = (page) => {
  pagination.page = page
  fetchData()
}
const onPageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

// Actions
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
    await lessonStore.deleteLesson(row.id)
    ElMessage.success('Xóa bài học thành công')
    fetchData()
  } catch (error) {
    console.error('Fetch lessons error:', error)
    const msg = error.response?.data?.message || error.message || 'Có lỗi khi xóa dữ liệu bài học'
    ElMessage.error(msg)
  }
}
const previewVideo = (row) => {
  currentVideo.value = getVideo(row.thumbnails)
  videoDialogVisible.value = true
}

// On mounted, fetch data
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