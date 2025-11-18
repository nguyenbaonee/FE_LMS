// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayouts.vue'
import EmptyLayout from '../layouts/EmptyLayout.vue'

const routes = [
    // ===============================
    // AUTH ROUTES
    // ===============================
    // {
    //     path: '/auth',
    //     component: EmptyLayout,
    //     redirect: '/auth/login',
    //     children: [
    //         {
    //             path: 'login',
    //             name: 'Login',
    //             component: () => import('@/views/auth/Login.vue'),
    //             meta: { title: 'Đăng nhập', requiresAuth: false }
    //         },
    //         {
    //             path: 'register',
    //             name: 'Register',
    //             component: () => import('@/views/auth/Register.vue'),
    //             meta: { title: 'Đăng ký', requiresAuth: false }
    //         }
    //     ]
    // },

    // ===============================
    // MAIN APP ROUTES
    // ===============================
    {
        path: '/',
        component: MainLayout,
        redirect: '/dashboard',
        meta: { requiresAuth: true },
        children: [
            // Dashboard
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { title: 'Dashboard', icon: 'Odometer' }
            },

            // Students
            {
                path: 'students',
                name: 'Students',
                component: () => import('../views/students/StudentList.vue'),
                meta: { title: 'Quản lý học viên', icon: 'UserFilled' }
            },
            {
                path: 'students/create',
                name: 'StudentCreate',
                component: () => import('../views/students/StudentForm.vue'),
                meta: { title: 'Thêm học viên', parent: 'Students' }
            },
            {
                path: 'students/:id/edit',
                name: 'StudentEdit',
                component: () => import('../views/students/StudentForm.vue'),
                meta: { title: 'Sửa học viên', parent: 'Students' },
                props: true
            },
            {
                path: 'students/:id',
                name: 'StudentDetail',
                component: () => import('../views/students/StudentDetail.vue'),
                meta: { title: 'Chi tiết học viên', parent: 'Students' },
                props: true
            },

            // Courses
            {
                path: 'courses',
                name: 'Courses',
                component: () => import('../views/courses/CourseList.vue'),
                meta: { title: 'Quản lý khóa học', icon: 'Reading' }
            },
            {
                path: 'courses/create',
                name: 'CourseCreate',
                component: () => import('../views/courses/CourseForm.vue'),
                meta: { title: 'Thêm khóa học', parent: 'Courses' }
            },
            {
                path: 'courses/:id/edit',
                name: 'CourseEdit',
                component: () => import('../views/courses/CourseForm.vue'),
                meta: { title: 'Sửa khóa học', parent: 'Courses' },
                props: true
            },
            {
                path: 'courses/:courseId/lessons',
                name: 'CourseLessons',
                component: () => import('../views/lessons/LessonList.vue'),
                meta: { title: 'Bài học', parent: 'Courses' },
                props: true
            },

            // Lessons
            {
                path: 'lessons',
                name: 'Lessons',
                component: () => import('../views/lessons/LessonList.vue'),
                meta: { title: 'Quản lý bài học', icon: 'Document' }
            },
            {
                path: 'lessons/create',
                name: 'LessonCreate',
                component: () => import('../views/lessons/LessonForm.vue'),
                meta: { title: 'Thêm bài học', parent: 'Lessons' }
            },
            {
                path: 'lessons/:id/edit',
                name: 'LessonEdit',
                component: () => import('../views/lessons/LessonForm.vue'),
                meta: { title: 'Sửa bài học', parent: 'Lessons' },
                props: true
            },

            // Enrollments
            {
                path: 'enrollments',
                name: 'Enrollments',
                component: () => import('../views/enrollments/EnrollmentList.vue'),
                meta: { title: 'Quản lý đăng ký học', icon: 'Tickets' }
            },
            {
                path: 'enrollments/create',
                name: 'EnrollmentCreate',
                component: () => import('../views/enrollments/EnrollmentForm.vue'),
                meta: { title: 'Đăng ký học mới', parent: 'Enrollments' }
            },
            {
                path: 'enrollments/:id/edit',
                name: 'EnrollmentEdit',
                component: () => import('../views/enrollments/EnrollmentForm.vue'),
                meta: { title: 'Sửa đăng ký', parent: 'Enrollments' },
                props: true
            }
        ]
    },

    // ===============================
    // 404 NOT FOUND
    // ===============================
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/Error404.vue'),
        meta: { title: '404 - Không tìm thấy trang' }
    }
]

// ===============================
// CREATE ROUTER
// ===============================
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// ===============================
// NAVIGATION GUARD
// ===============================
// router.beforeEach((to, from, next) => {
//     // Set page title
//     document.title = to.meta.title ? `${to.meta.title} - LMS Mini` : 'LMS Mini'
//
//     // Check authentication
//     const isAuthenticated = localStorage.getItem('token') // hoặc dùng store
//     const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//
//     if (requiresAuth && !isAuthenticated) {
//         next('/auth/login')
//     } else if (to.path.startsWith('/auth') && isAuthenticated) {
//         next('/dashboard')
//     } else {
//         next()
//     }
// })

export default router
