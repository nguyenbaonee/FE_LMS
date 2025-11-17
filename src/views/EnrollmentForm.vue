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
          label-width="140px"
      >
        <el-form-item label="Học viên" prop="studentId" required>
          <el-select
              v-model="formData.studentId"
              placeholder="Chọn học viên"
              filterable
              style="width: 100%"
              @change="handleStudentChange"
          >
            <el-option
                v-for="student in students"
                :key="student.id"
                :label="`${student.name} - ${student.email}`"
                :value="student.id"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-avatar :src="student.avatar" :size="30">
                  {{ student.name.charAt(0) }}
                </el-avatar>
                <div>
                  <div>{{ student.name }}</div>
                  <div style="font-size: 12px; color: #909399">{{ student.email }}</div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Hiển thị thông tin học viên đã chọn -->
        <el-form-item v-if="selectedStudent" label="Thông tin">
          <el-card shadow="never" style="background: #f5f7fa">
            <div style="display: flex; align-items: center; gap: 16px">
              <el-avatar :src="selectedStudent.avatar" :size="60">
                {{ selectedStudent.name.charAt(0) }}
              </el-avatar>
              <div>
                <div style="font-weight: 600; margin-bottom: 4px">
                  {{ selectedStudent.name }}
                </div>
                <div style="font-size: 14px; color: #606266">
                  {{ selectedStudent.email }}
                </div>
                <div style="font-size: 14px; color: #909399">
                  SĐT: {{ selectedStudent.phone }}
                </div>
              </div>
            </div>
          </el-card>
        </el-form-item>

        <el-form-item label="Chọn khóa học" prop="courseIds" required>
          <el-select
              v-model="formData.courseIds"
              multiple
              placeholder="Chọn một hoặc nhiều khóa học"
              style="width: 100%"
              :disabled="!formData.studentId"
          >
            <el-option
                v-for="course in availableCourses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
                :disabled="course.disabled"
            >
              <div style="display: flex; align-items: center; justify-content: space-between">
                <div style="display: flex; align-items: center; gap: 8px">
                  <el-image
                      :src="course.thumbnail"
                      fit="cover"
                      style="width: 50px; height: 30px; border-radius: 4px"
                  />
                  <span>{{ course.name }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px">
                  <el-tag v-if="course.disabled" type="info" size="small">
                    Đã đăng ký
                  </el-tag>
                  <span style="font-weight: 600; color: #f56c6c">
                    {{ formatCurrency(course.price) }}
                  </span>
                </div>
              </div>
            </el-option>
          </el-select>
          <div v-if="!formData.studentId" class="form-tip">
            Vui lòng chọn học viên trước
          </div>
        </el-form-item>

        <!-- Danh sách khóa học đã chọn -->
        <el-form-item v-if="selectedCourses.length > 0" label="Đã chọn">
          <div class="selected-courses">
            <el-card
                v-for="course in selectedCourses"
                :key="course.id"
                shadow="hover"
                class="course-card"
            >
              <div class="course-info">
                <el-image
                    :src="course.thumbnail"
                    fit="cover"
                    style="width: 100px; height: 60px; border-radius: 4px"
                />
                <div class="course-details">
                  <div class="course-name">{{ course.name }}</div>
                  <div class="course-meta">
                    <el-tag size="small">{{ course.lessonCount }} bài học</el-tag>
                    <span class="course-duration">{{ course.duration }}</span>
                  </div>
                  <div class="course-price">{{ formatCurrency(course.price) }}</div>
                </div>
                <el-button
                    type="danger"
                    :icon="Close"
                    circle
                    size="small"
                    @click="removeCourse(course.id)"
                />
              </div>
            </el-card>
          </div>
        </el-form-item>

        <!-- Tổng tiền -->
        <el-form-item v-if="selectedCourses.length > 0" label="Tổng tiền">
          <div class="total-price">
            <span class="total-label">Tổng cộng:</span>
            <span class="total-amount">{{ formatCurrency(totalPrice) }}</span>
          </div>
        </el-form-item>

        <el-form-item label="Ghi chú" prop="note">
          <el-input
              v-model="formData.note"
              type="textarea"
              :rows="3"
              placeholder="Ghi chú (tùy chọn)"
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              :loading="submitting"
              :disabled="selectedCourses.length === 0"
              @click="handleSubmit"
          >
            {{ isEdit ? 'Cập nhật' : 'Đăng ký' }}
          </el-button>
          <el-button @click="handleBack">Hủy</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, Close } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()

const isEdit = ref(false)
const submitting = ref(false)

const students = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    enrolledCourses: [1] // Đã đăng ký khóa học ID 1
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0912345678',
    avatar: 'https://i.pravatar.cc/150?img=2',
    enrolledCourses: []
  }
])

const courses = ref([
  {
    id: 1,
    name: 'Lập trình Web với Vue 3',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
    price: 599000,
    lessonCount: 25,
    duration: '20 giờ'
  },
  {
    id: 2,
    name: 'React Native cơ bản',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200',
    price: 799000,
    lessonCount: 30,
    duration: '25 giờ'
  },
  {
    id: 3,
    name: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200',
    price: 499000,
    lessonCount: 20,
    duration: '15 giờ'
  }
])

const formData = reactive({
  studentId: '',
  courseIds: [],
  note: ''
})

const rules = {
  studentId: [
    { required: true, message: 'Vui lòng chọn học viên', trigger: 'change' }
  ],
  courseIds: [
    { required: true, message: 'Vui lòng chọn ít nhất một khóa học', trigger: 'change' }
  ]
}

const selectedStudent = computed(() => {
  return students.value.find(s => s.id === formData.studentId)
})

const availableCourses = computed(() => {
  if (!selectedStudent.value) return courses.value

  return courses.value.map(course => ({
    ...course,
    disabled: selectedStudent.value.enrolledCourses.includes(course.id)
  }))
})

const selectedCourses = computed(() => {
  return courses.value.filter(c => formData.courseIds.includes(c.id))
})

const totalPrice = computed(() => {
  return selectedCourses.value.reduce((sum, course) => sum + course.price, 0)
})

const handleStudentChange = () => {
  // Reset courseIds khi đổi học viên
  formData.courseIds = []
}

const removeCourse = (courseId) => {
  formData.courseIds = formData.courseIds.filter(id => id !== courseId)
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const action = isEdit.value ? 'cập nhật' : 'đăng ký'
      ElMessage.success(`${action.charAt(0).toUpperCase() + action.slice(1)} thành công`)
      router.push('/enrollments')
    } catch (error) {
      ElMessage.error('Có lỗi xảy ra')
    } finally {
      submitting.value = false
    }
  })
}

const handleBack = () => router.back()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    // Fetch enrollment data
  }
})
</script>

<style scoped lang="scss">
.page-container {
  max-width: 900px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .form-tip {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .selected-courses {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    .course-card {
      .course-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .course-details {
          flex: 1;

          .course-name {
            font-weight: 600;
            margin-bottom: 8px;
          }

          .course-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .course-duration {
              font-size: 14px;
              color: var(--el-text-color-secondary);
            }
          }

          .course-price {
            font-size: 18px;
            font-weight: 600;
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .total-price {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: #fff;

    .total-label {
      font-size: 16px;
    }

    .total-amount {
      font-size: 28px;
      font-weight: 700;
    }
  }
}
</style>