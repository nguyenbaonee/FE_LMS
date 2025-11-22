// stores/lessonStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axios.js'

export const useLessonStore = defineStore('lesson', () => {
    // --- State ---
    const lessons = ref([]) // danh sách lesson
    const currentLesson = ref(null) // chi tiết lesson nếu cần edit
    const loading = ref(false)
    const total = ref(0)

    // --- Actions ---

    // Tạo lesson, có upload images và videos
    const createLesson = async (courseId, lessonRequest, images = [], videos = []) => {
        loading.value = true
        try {
            const formData = new FormData()
            Object.keys(lessonRequest).forEach(key => {
                if (lessonRequest[key] !== undefined && lessonRequest[key] !== null) {
                    formData.append(key, lessonRequest[key])
                }
            })
            images.forEach(file => formData.append('images', file))
            videos.forEach(file => formData.append('videos', file))

            const res = await apiClient.post(`/lessons/${courseId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return res.data.data // ApiResponse<LessonResponse>
        } catch (err) {
            console.error('Create lesson error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Lấy danh sách lesson theo courseId, có paging
    const fetchLessonsByCourse = async (courseId, page = 1, pageSize = 10) => {
        loading.value = true
        try {
            const res = await apiClient.get('/lessons', {
                params: {
                    courseId,
                    page: page - 1, // backend 0-based
                    size: pageSize
                }
            })
            lessons.value = res.data.content
            total.value = res.data.totalElements
            return res.data
        } catch (err) {
            console.error('Fetch lessons error:', err)
            lessons.value = []
            total.value = 0
            throw err
        } finally {
            loading.value = false
        }
    }

    // Xóa lesson theo lessonId
    const deleteLesson = async (lessonId) => {
        loading.value = true
        try {
            await apiClient.delete(`/lessons/${lessonId}`)
            lessons.value = lessons.value.filter(l => l.id !== lessonId)
        } catch (err) {
            console.error('Delete lesson error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const clearCurrentLesson = () => {
        currentLesson.value = null
    }

    return {
        lessons,
        currentLesson,
        loading,
        total,
        createLesson,
        fetchLessonsByCourse,
        deleteLesson,
        clearCurrentLesson
    }
})
