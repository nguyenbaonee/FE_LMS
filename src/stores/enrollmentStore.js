import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axios.js'

export const useEnrollmentStore = defineStore('enrollment', () => {
    // --- State ---
    const enrollments = ref([]) // danh sách enrollment trả về khi tạo
    const studentsOfCourse = ref([]) // danh sách student theo course
    const loading = ref(false)
    const total = ref(0)

    // --- Actions ---

    // Tạo enrollment (trả về list EnrollmentResponse)
    const createEnrollment = async (enrollmentRequest) => {
        loading.value = true
        try {
            const res = await apiClient.post('/enrollments', enrollmentRequest)
            enrollments.value = res.data
            return res.data
        } catch (err) {
            console.error('Create enrollment error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Update enrollment theo studentId
    const updateEnrollment = async (studentId, enrollmentUpdate) => {
        loading.value = true
        try {
            await apiClient.put(`/enrollments/${studentId}`, enrollmentUpdate)
            // Có thể fetch lại danh sách nếu cần
        } catch (err) {
            console.error('Update enrollment error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchStudentsOfCourse = async ({ courseId, status, page = 1, pageSize = 5 }) => {
        loading.value = true
        try {
            const res = await apiClient.get(`/enrollments/${courseId}`, {
                params: {
                    status,
                    page: page - 1,
                    size: pageSize
                }
            })
            studentsOfCourse.value = res.data.content
            total.value = res.data.totalElements
            return res.data
        } catch (err) {
            console.error('Fetch students of course error:', err)
            studentsOfCourse.value = []
            total.value = 0
            throw err
        } finally {
            loading.value = false
        }
    }

    // Xóa enrollment theo id
    const deleteEnrollment = async (id) => {
        loading.value = true
        try {
            await apiClient.delete(`/enrollments/${id}`)
            // Xóa nhanh khỏi danh sách nếu có
            if (enrollments.value.length) {
                enrollments.value = enrollments.value.filter(e => e.id !== id)
            }
        } catch (err) {
            console.error('Delete enrollment error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        enrollments,
        studentsOfCourse,
        loading,
        total,
        createEnrollment,
        updateEnrollment,
        fetchStudentsOfCourse,
        deleteEnrollment
    }
})
