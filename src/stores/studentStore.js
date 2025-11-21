import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiClient from '../api/axios.js'

export const useStudentStore = defineStore('student', () => {
    const students = ref([])
    const loading = ref(false)
    const total = ref(0)

    const fetchStudents = async ({ name = '', email ='', status = 'ACTIVE', page = 1, pageSize = 10 } = {}) => {
        loading.value = true
        try {
            const res = await apiClient.get('/students', {
                params: {
                    name,
                    email,
                    status,       // 'ACTIVE' hoặc 'DELETED'
                    page: page - 1,
                    pageSize
                }
            })
            students.value = res.data.content
            console.log(students.value)
            total.value = res.data.totalElements
        } catch (err) {
            console.error(err)
            students.value = []
            total.value = 0
        } finally {
            loading.value = false
        }
    }



    const saveStudent = async (student) => {
        if (student.id) {
            const res = await axios.put(`/api/students/${student.id}`, student)
            const index = students.value.findIndex(s => s.id === student.id)
            if (index !== -1) students.value[index] = res.data
            return res.data
        } else {
            const res = await axios.post('/api/students', student)
            students.value.push(res.data)
            return res.data
        }
    }

    const deleteStudent = async (id) => {
        await axios.delete(`/api/students/${id}`)
        students.value = students.value.filter(s => s.id !== id)
    }

    return { students, loading, fetchStudents, saveStudent, deleteStudent }
})
