<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>{{ isEdit ? 'Cập nhật' : 'Đăng ký' }} học</h3>
          <el-button :icon="Back" @click="handleBack">Quay lại</el-button>
        </div>
      </template>

      <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="180px"
      >
        <!-- Search Student -->
        <el-form-item label="Tìm kiếm học viên" required>
          <el-card shadow="never" style="background: #f5f7fa; width: 100%">
            <el-form :inline="true" :model="studentSearchForm">
              <el-form-item label="Tên">
                <el-input
                    v-model="studentSearchForm.name"
                    placeholder="Nhập tên học viên"
                    clearable
                    style="width: 200px"
                />
              </el-form-item>
              <el-form-item label="Email">
                <el-input
                    v-model="studentSearchForm.email"
                    placeholder="Nhập email"
                    clearable
                    style="width: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearchStudent">
                  Tìm học viên
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-form-item>

        <!-- Select Student from search results -->
        <el-form-item label="Chọn học viên" prop="studentId" required>
          <el-radio-group v-model="formData.studentId" style="width: 100%">
            <div v-if="searchedStudents.length === 0" class="empty-hint">
              <el-empty description="Vui lòng tìm kiếm học viên" :image-size="80" />
            </div>
            <el-card
                v-for="student in searchedStudents"
                :key="student.id"
                shadow="hover"
                class="student-card"
                :class="{ selected: formData.studentId === student.id }"
                @click="formData.studentId = student.id"
            >
              <el-radio :label="student.id">
                <div class="student-content">
                  <el-avatar :src="student.avatar" :size="50">
                    {{ student.name.charAt(0) }}
                  </el-avatar>
                  <div class="student-info">
                    <div class="student-name">{{ student.name }}</div>
                    <div class="student-email">{{ student.email }}</div>
                  </div>
                  <el-tag type="success" size="small">{{ student.status }}</el-tag>
                </div>
              </el-radio>
            </el-card>
          </el-radio-group>
        </el-form-item>

        <!-- Search Courses -->
        <el-form-item label="Tìm kiếm khóa học" required>
          <el-card shadow="never" style="background: #f5f7fa; width: 100%">
            <el-form :inline="true" :model="courseSearchForm">
              <el-form-item label="Tên">
                <el-input
                    v-model="courseSearchForm.name"
                    placeholder="Nhập tên khóa học"
                    clearable
                    style="width: 200px"
                />
              </el-form-item>
              <el-form-item label="Mã">
                <el-input
                    v-model="courseSearchForm.code"
                    placeholder="Nhập mã khóa học"
                    clearable
                    style="width: 150px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearchCourse">
                  Tìm khóa học
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-form-item>

        <!-- Select Courses from search results -->
        <el-form-item label="Chọn khóa học" prop="courseIds" required>
          <div v-if="searchedCourses.length === 0" class="empty-hint">
            <el-empty description="Vui lòng tìm kiếm khóa học" :image-size="80" />
          </div>
          <el-checkbox-group v-model="formData.courseIds" style="width: 100%">
            <el-card
                v-for="course in searchedCourses"
                :key="course.id"
                shadow="hover"
                class="course-card"
                :class="{ selected: formData.courseIds.includes(course.id) }"
            >
              <el-checkbox :label="course.id" :disabled="course.isEnrolled">
                <div class="course-content">
                  <el-image
                      :src="course.thumbnail"
                      fit="cover"
                      style="width: 80px; height: 50px; border-radius: 4px"
                  />
                  <div class="course-info">
                    <div class="course-name">{{ course.name }}</div>
                    <div class="course-code">Mã: {{ course.code }}</div>
                  </div>
                  <div class="course-tags">
                    <el-tag type="success" size="small">{{ course.status }}</el-tag>
                    <el-tag v-if="course.isEnrolled" type="info" size="small">
                      Đã đăng ký
                    </el-tag>
                  </div>
                </div>
              </el-checkbox>
            </el-card>
          </el-checkbox-group>
        </el-form-item>

        <!-- Selected Summary -->
        <el-form-item v-if="formData.studentId && formData.courseIds.length > 0" label="Tóm tắt">
          <el-alert type="success" :closable="false">
            <template #title>
              <strong>Học viên:</strong> {{ selectedStudentName }}
            </template>
            <div style="margin-top: 8px">
              <strong>Khóa học đã chọn ({{ formData.courseIds.length }}):</strong>
              <ul style="margin: 8px 0 0 20px; padding: 0">
                <li v-for="courseId in formData.courseIds" :key="courseId">
                  {{ getCourseNameById(courseId) }}
                </li>
              </ul>
            </div>
          </el-alert>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              :loading="submitting"
              :disabled="!formData.studentId || formData.courseIds.length === 0"
              @click="handleSubmit"
          >
            Đăng ký {{ formData.courseIds.length }} khóa học
          </el-button>
          <el-button @click="handleBack">Hủy</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, Search } from '@element-plus/icons-vue'
import axios from '../../api/axios.js'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)

// Search forms
const studentSearchForm = reactive({
  name: '',
  email: '',
  status: 'ACTIVE' // Mặc định ACTIVE
})

const courseSearchForm = reactive({
  name: '',
  code: '',
  status: 'ACTIVE' // Mặc định ACTIVE
})

// Search results
const searchedStudents = ref([])
const searchedCourses = ref([])

// Form data
const formData = reactive({
  studentId: null,
  courseIds: [],
  note: ''
})

const rules = {
  studentId: [
    { required: true, message: 'Vui lòng chọn học viên', trigger: 'change' }
  ],
  courseIds: [
    { required: true, type: 'array', min: 1, message: 'Vui lòng chọn ít nhất một khóa học', trigger: 'change' }
  ]
}

// Computed
const selectedStudentName = computed(() => {
  const student = searchedStudents.value.find(s => s.id === formData.studentId)
  return student ? student.name : ''
})

const getCourseNameById = (courseId) => {
  const course = searchedCourses.value.find(c => c.id === courseId)
  return course ? course.name : ''
}

// Search Student
const handleSearchStudent = async () => {
  if (!studentSearchForm.name && !studentSearchForm.email) {
    ElMessage.warning('Vui lòng nhập tên hoặc email để tìm kiếm')
    return
  }

  try {
    const params = {
      name: studentSearchForm.name || undefined,
      email: studentSearchForm.email || undefined,
      status: studentSearchForm.status
    }

    const response = await axios.get('/students/search', { params })
    searchedStudents.value = response.data

    if (searchedStudents.value.length === 0) {
      ElMessage.info('Không tìm thấy học viên nào')
    } else {
      ElMessage.success(`Tìm thấy ${searchedStudents.value.length} học viên`)
    }

    // Reset selected student if not in new results
    if (formData.studentId && !searchedStudents.value.find(s => s.id === formData.studentId)) {
      formData.studentId = null
    }
  } catch (error) {
    console.error('Search student error:', error)
    ElMessage.error('Lỗi tìm kiếm học viên')
  }
}

// Search Course
const handleSearchCourse = async () => {
  if (!courseSearchForm.name && !courseSearchForm.code) {
    ElMessage.warning('Vui lòng nhập tên hoặc mã để tìm kiếm')
    return
  }

  try {
    const params = {
      name: courseSearchForm.name || undefined,
      code: courseSearchForm.code || undefined,
      status: courseSearchForm.status
    }

    const response = await axios.get('/courses/search', { params })

    // Check enrolled courses for selected student
    if (formData.studentId) {
      const enrolledResponse = await axios.get(`/students/${formData.studentId}/enrolled-courses`)
      const enrolledCourseIds = enrolledResponse.data.map(c => c.id)

      searchedCourses.value = response.data.map(course => ({
        ...course,
        isEnrolled: enrolledCourseIds.includes(course.id)
      }))
    } else {
      searchedCourses.value = response.data.map(course => ({
        ...course,
        isEnrolled: false
      }))
    }

    if (searchedCourses.value.length === 0) {
      ElMessage.info('Không tìm thấy khóa học nào')
    } else {
      ElMessage.success(`Tìm thấy ${searchedCourses.value.length} khóa học`)
    }

    // Reset selected courses if they're not in new results
    formData.courseIds = formData.courseIds.filter(id =>
        searchedCourses.value.find(c => c.id === id)
    )
  } catch (error) {
    console.error('Search course error:', error)
    ElMessage.error('Lỗi tìm kiếm khóa học')
  }
}

// Submit
const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    submitting.value = true

    try {
      const payload = {
        studentId: formData.studentId,
        courseIds: formData.courseIds, // Array of course IDs
        note: formData.note || undefined
      }

      console.log('=== ENROLLMENT PAYLOAD ===')
      console.log('Student ID:', payload.studentId)
      console.log('Course IDs:', payload.courseIds)
      console.log('Note:', payload.note)

      // Call API
      await axios.post('/enrollments', payload)

      ElMessage.success(`Đăng ký thành công ${formData.courseIds.length} khóa học cho học viên ${selectedStudentName.value}`)
      router.push('/enrollments')
    } catch (error) {
      console.error('Submit error:', error)
      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('Có lỗi xảy ra khi đăng ký')
      }
    } finally {
      submitting.value = false
    }
  })
}

const handleBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.page-container {
  max-width: 1000px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .empty-hint {
    width: 100%;
    padding: 20px;
    text-align: center;
  }

  .student-card,
  .course-card {
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;

    &.selected {
      border-color: var(--el-color-primary);
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
    }

    &:hover {
      border-color: var(--el-color-primary-light-5);
    }

    :deep(.el-card__body) {
      padding: 16px;
    }

    :deep(.el-radio),
    :deep(.el-checkbox) {
      width: 100%;
      margin: 0;

      .el-radio__label,
      .el-checkbox__label {
        width: 100%;
        padding-left: 12px;
      }
    }
  }

  .student-content,
  .course-content {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .student-info,
  .course-info {
    flex: 1;

    .student-name,
    .course-name {
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--el-text-color-primary);
    }

    .student-email,
    .course-code {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  .course-tags {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
  }
}
</style>
