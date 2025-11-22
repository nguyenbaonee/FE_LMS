import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axios.js'

export const useStudentStore = defineStore('student', () => {
    // --- State ---
    const students = ref([])
    const currentStudent = ref(null) // cho edit form
    const loading = ref(false)
    const total = ref(0)

    // --- Actions ---
    const fetchStudents = async ({ name = '', email ='', status = 'ACTIVE', page = 1, pageSize = 10 } = {}) => {
        loading.value = true
        try {
            const res = await apiClient.get('/students', {
                params: {
                    name,
                    email,
                    status,
                    page: page - 1,
                    size: pageSize
                }
            })
            students.value = res.data.content
            total.value = res.data.totalElements
        } catch (err) {
            console.error(err)
            students.value = []
            total.value = 0
        } finally {
            loading.value = false
        }
    }

    const fetchStudentById = async (id, status) => {
        loading.value = true
        try {
            const res = await apiClient.get(`/students/${id}`,{
                params: {
                    status,
                }
            })
            currentStudent.value = res.data
            return res.data
        } catch (err) {
            console.error('Fetch student detail error:', err)
            currentStudent.value = null
            throw err
        } finally {
            loading.value = false
        }
    }

    const clearCurrentStudent = () => {
        currentStudent.value = null
    }

    const saveStudent = async (student) => {
        loading.value = true
        try {
            let res
            if (student.id) {
                res = await apiClient.put(`/students/${student.id}`, student)
                const index = students.value.findIndex(s => s.id === student.id)
                if (index !== -1) students.value[index] = res.data
            } else {
                res = await apiClient.post('/students', student)
                students.value.push(res.data)
            }
            return res.data
        } finally {
            loading.value = false
        }
    }

    const deleteStudent = async (id) => {
        loading.value = true
        try {
            await apiClient.delete(`/students/${id}`)

            // Nếu đang có danh sách, filter nhanh
            if (students.value.length) {
                students.value = students.value.filter(s => s.id !== id)
            } else {
                // Nếu chưa có list, fetch lại từ server
                await fetchStudents()
            }
        } finally {
            loading.value = false
        }
    }


    return {
        students,
        currentStudent,
        loading,
        total,
        fetchStudents,
        fetchStudentById,
        clearCurrentStudent,
        saveStudent,
        deleteStudent
    }
})
