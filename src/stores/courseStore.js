import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axios.js'

export const useCourseStore = defineStore('course', () => {

    const courses = ref([])
    const currentCourse = ref(null) // cho edit form
    const loading = ref(false)
    const total = ref(0)

    // --- Actions ---
    const fetchCourses = async ({ name = '', code = '', status = 'ACTIVE', page = 1, pageSize = 10 } = {}) => {
        loading.value = true
        try {
            const res = await apiClient.get('/courses', {
                params: {
                    name,
                    code,
                    status,
                    page: page - 1, // backend 0-based
                    size: pageSize
                }
            })
            courses.value = res.data.content
            total.value = res.data.totalElements
            return res.data
        } catch (err) {
            console.error('Fetch courses error:', err)
            courses.value = []
            total.value = 0
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchCourseById = async (id) => {
        loading.value = true
        try {
            const res = await apiClient.get(`/courses/${id}`)
            currentCourse.value = res.data
            return res.data
        } catch (err) {
            console.error('Fetch course detail error:', err)
            currentCourse.value = null
            throw err
        } finally {
            loading.value = false
        }
    }

    const clearCurrentCourse = () => {
        currentCourse.value = null
    }

    const saveCourse = async (course, images = [], deleteThumbnailId = [], mainThumbnailId = null) => {
        loading.value = true
        try {
            const formData = new FormData()
            Object.keys(course).forEach(key => {
                if (course[key] !== undefined && course[key] !== null) {
                    formData.append(key, course[key])
                }
            })
            images.forEach(file => formData.append('images', file))
            deleteThumbnailId.forEach(id => formData.append('deleteThumbnailId', id))
            if (mainThumbnailId) formData.append('mainThumbnailId', mainThumbnailId)

            let res
            if (course.id) {
                res = await apiClient.put(`/courses/${course.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                const index = courses.value.findIndex(c => c.id === course.id)
                if (index !== -1) Object.assign(courses.value[index], res.data)
            } else {
                res = await apiClient.post('/courses', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                courses.value.push(res.data)
            }
            return res.data
        } finally {
            loading.value = false
        }
    }

    const deleteCourse = async (id) => {
        loading.value = true
        try {
            await apiClient.delete(`/courses/${id}`)
            if (courses.value.length) {
                courses.value = courses.value.filter(c => c.id !== id)
            } else {
                await fetchCourses()
            }
        } finally {
            loading.value = false
        }
    }

    return {
        courses,
        currentCourse,
        loading,
        total,
        fetchCourses,
        fetchCourseById,
        clearCurrentCourse,
        saveCourse,
        deleteCourse
    }
})
