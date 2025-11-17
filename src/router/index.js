import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

const routes = [
    {
        path: '/auth',
        component: EmptyLayout,
        redirect: '/auth/login',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/auth/Login.vue'),
                meta: {
                    title: 'Đăng nhập',
                    requiresAuth: false
                }
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('@/views/auth/Register.vue'),
                meta: {
                    title: 'Đăng ký',
                    requiresAuth: false
                }
            }
        ]
    },

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
                component: () => import('@/views/Dashboard.vue'),
                meta: {
                    title: 'Dashboard',
                    icon: 'Odometer'
                }
            },

            {
                path: 'students',
                name: 'Students',
                component: () => import('@/views/students/StudentList.vue'),
                meta: {
                    title: 'Quản lý học viên',
                    icon: 'UserFilled'
                }
            },
            {
                path: 'students/create',
                name: 'StudentCreate',
                component: () => import('@/views/students/StudentForm.vue'),
                meta: {
                    title: 'Thêm học viên',
                    parent: 'Students'
                }
            },
            {
                path: 'students/:id/edit',
                name: 'StudentEdit',
                component: () => import('@/views/students/StudentForm.vue'),
                meta: {
                    title: 'Sửa học viên',
                    parent: 'Students'
                }
            },
            {
                path: 'students/:id',
                name: 'StudentDetail',
                component: () => import('@/views/students/StudentDetail.vue'),
                meta: {
                    title: 'Chi tiết học viên',
                    parent: 'Students'
                }
            },

            {
                path: 'courses',
                name: 'Courses',
                component: () => import('@/views/courses/CourseList.vue'),
                meta: {
                    title: 'Quản lý khóa học',
                    icon: 'Reading'
                }
            },
            {
                path: 'courses/create',
                name: 'CourseCreate',
                component: () => import('@/views/courses/CourseForm.vue'),
                meta: {
                    title: 'Thêm khóa học',
                    parent: 'Courses'
                }
            },
            {
                path: 'courses/:id/edit',
                name: 'CourseEdit',
                component: () => import('@/views/courses/CourseForm.vue'),
                meta: {
                    title: 'Sửa khóa học',
                    parent: 'Courses'
                }
            },
            {
                path: 'courses/:id',
                name: 'CourseDetail',
                component: () => import('@/views/courses/CourseDetail.vue'),
                meta: {
                    title: 'Chi tiết khóa học',
                    parent: 'Courses'
                }
            },

            {
                path: 'lessons',
                name: 'Lessons',
                component: () => import('@/views/lessons/LessonList.vue'),
                meta: {
                    title: 'Quản lý bài học',
                    icon: 'Document'
                }
            },
            {
                path: 'lessons/create',
                name: 'LessonCreate',
                component: () => import('@/views/lessons/LessonForm.vue'),
                meta: {
                    title: 'Thêm bài học',
                    parent: 'Lessons'
                }
            },
            {
                path: 'lessons/:id/edit',
                name: 'LessonEdit',
                component: () => import('@/views/lessons/LessonForm.vue'),
                meta: {
                    title: 'Sửa bài học',
                    parent: 'Lessons'
                }
            },
            {
                path: 'lessons/:id',
                name: 'LessonDetail',
                component: () => import('@/views/lessons/LessonDetail.vue'),
                meta: {
                    title: 'Chi tiết bài học',
                    parent: 'Lessons'
                }
            },
            {
                path: 'courses/:courseId/lessons',
                name: 'CourseLessons',
                component: () => import('@/views/lessons/LessonList.vue'),
                meta: {
                    title: 'Bài học',
                    parent: 'Courses'
                }
            },

            {
                path: 'enrollments',
                name: 'Enrollments',
                component: () => import('@/views/enrollments/EnrollmentList.vue'),
                meta: {
                    title: 'Quản lý đăng ký học',
                    icon: 'Tickets'
                }
            },
            {
                path: 'enrollments/create',
                name: 'EnrollmentCreate',
                component: () => import('@/views/enrollments/EnrollmentForm.vue'),
                meta: {
                    title: 'Đăng ký học mới',
                    parent: 'Enrollments'
                }
            },
            {
                path: 'enrollments/:id/edit',
                name: 'EnrollmentEdit',
                component: () => import('@/views/enrollments/EnrollmentForm.vue'),
                meta: {
                    title: 'Sửa đăng ký',
                    parent: 'Enrollments'
                }
            },
            {
                path: 'courses/:courseId/students',
                name: 'CourseStudents',
                component: () => import('@/views/enrollments/CourseStudents.vue'),
                meta: {
                    title: 'Học viên của khóa học',
                    parent: 'Courses'
                }
            },

            {
                path: 'reports',
                redirect: '/reports/students',
                meta: {
                    title: 'Báo cáo',
                    icon: 'DataAnalysis'
                }
            },
            {
                path: 'reports/students',
                name: 'ReportStudents',
                component: () => import('@/views/reports/StudentReport.vue'),
                meta: {
                    title: 'Báo cáo học viên',
                    parent: 'Reports'
                }
            },
            {
                path: 'reports/courses',
                name: 'ReportCourses',
                component: () => import('@/views/reports/CourseReport.vue'),
                meta: {
                    title: 'Báo cáo khóa học',
                    parent: 'Reports'
                }
            },

            // ==========================================
            // SETTINGS
            // ==========================================
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/Settings.vue'),
                meta: {
                    title: 'Cài đặt',
                    icon: 'Setting'
                }
            },

            // Profile
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/Profile.vue'),
                meta: {
                    title: 'Thông tin cá nhân'
                }
            }
        ]
    },

    // ==========================================
    // ERROR PAGES
    // ==========================================
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/Error404.vue'),
        meta: {
            title: '404 - Không tìm thấy trang'
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// ==========================================
// NAVIGATION GUARDS
// ==========================================
router.beforeEach((to, from, next) => {
    // Set page title
    document.title = to.meta.title
        ? `${to.meta.title} - LMS Mini`
        : 'LMS Mini'

    // Check authentication
    const isAuthenticated = localStorage.getItem('token') // Hoặc dùng store
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !isAuthenticated) {
        // Chưa đăng nhập, redirect về login
        next('/auth/login')
    } else if (to.path.startsWith('/auth') && isAuthenticated) {
        // Đã đăng nhập, redirect về dashboard
        next('/dashboard')
    } else {
        next()
    }
})
