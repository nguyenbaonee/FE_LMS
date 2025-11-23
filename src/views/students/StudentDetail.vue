<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>{{ $t('studentDetail.title') }}</h3>
          <el-button type="primary" @click="handleBack">{{ $t('studentDetail.back') }}</el-button>
        </div>
      </template>

      <el-row :gutter="20">
        <!-- Avatar -->
        <el-col :span="6">
          <el-avatar
              :src="getAvatarUrl(student)"
              :size="120"
          >
            {{ student.name?.charAt(0) }}
          </el-avatar>
          <div
              v-if="student.avatar?.filter(a => !a.primary).length > 0"
              style="margin-top: 20px;"
          >
            <h4>{{ $t('studentDetail.otherAvatars') }}</h4>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <el-image
                  v-for="item in student.avatar?.filter(a => !a.primary)"
                  :key="item.id"
                  :src="'http://localhost:8080' + item.url"
                  style="width: 70px; height: 70px; border-radius: 6px;"
                  fit="cover"
              />
            </div>
          </div>

        </el-col>

        <!-- Info -->
        <el-col :span="18">
          <el-descriptions column="1" border>
            <el-descriptions-item :label="$t('studentDetail.fullName')">
              {{ student.name }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('studentDetail.email')">
              {{ student.email }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('studentDetail.status')">
              <el-tag :type="student.status === 'ACTIVE' ? 'success' : 'danger'">
                {{ student.status === 'ACTIVE' ? $t('studentDetail.active') : $t('studentDetail.deleted') }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import apiClient from '../../api/axios.js'

const router = useRouter()
const route = useRoute()

const student = ref({
  name: '',
  email: '',
  avatar: [],
  status: ''
})

// Hàm lấy URL avatar chính
const getAvatarUrl = (studentData) => {
  const primaryAvatar = studentData.avatar?.find(a => a.primary)
  if (!primaryAvatar) return ''
  return 'http://localhost:8080' + encodeURI(primaryAvatar.url)
}

// Lấy dữ liệu chi tiết student
const fetchStudent = async () => {
  try {
    const id = route.params.id
    const status = route.query.status
    const res = await apiClient.get(`/students/${id}`,{
      params: { status }
    })
    student.value = res.data
  } catch (err) {
    const msg = err.response?.data?.message || 'Lỗi khi lấy thông tin học viên'
    ElMessage.error(msg)
    router.back()
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  fetchStudent()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-avatar {
  margin-bottom: 20px;
}
</style>
