import { createI18n } from 'vue-i18n'

const messages = {
    en: {
        nav: {
            home: "Home",
            profile: "Profile",
            settings: "Settings",
            logout: "Logout"
        },
        footer: {
            copyright: "© 2025 LMS Mini. All rights reserved.",
            version: "Version 1.0.0",
            terms: "Terms of Use",
            privacy: "Privacy Policy",
            support: "Support"
        },
        message: {
            hello: "Hello"
        },
        dashboard: {
            welcomeTitle: "EduNovel - NguyenBao",
            welcomeDesc: "Course Management System",
            addStudent: "Add Student",
            addCourse: "Add Course",
            recentActivities: "Recent Activities",
            viewAll: "View All",
            quickAccess: "Quick Access",
            manageStudents: "Manage Students",
            manageCourses: "Manage Courses",
            manageLessons: "Manage Lessons",
            enrollments: "Enrollments",
            overviewStats: "Overview Statistics",
            periodWeek: "Week",
            periodMonth: "Month",
            periodYear: "Year"
        },
        sidebar: {
            logo: "LMS Mini",
            dashboard: "Dashboard",
            students: "Student Management",
            courses: "Course Management",
            enrollments: "Enrollments"
        }
    },
    vi: {
        nav: {
            home: "Trang chủ",
            profile: "Thông tin cá nhân",
            settings: "Cài đặt",
            logout: "Đăng xuất"
        },
        footer: {
            copyright: "© 2025 LMS Mini. Bản quyền thuộc về LMS Mini.",
            version: "Phiên bản 1.0.0",
            terms: "Điều khoản sử dụng",
            privacy: "Chính sách bảo mật",
            support: "Hỗ trợ"
        },
        message: {
            hello: "Xin chào"
        },
        dashboard: {
            welcomeTitle: "EduNovel - NguyenBao",
            welcomeDesc: "Hệ thống quản lý khóa học",
            addStudent: "Thêm học viên",
            addCourse: "Thêm khóa học",
            recentActivities: "Hoạt động gần đây",
            viewAll: "Xem tất cả",
            quickAccess: "Truy cập nhanh",
            manageStudents: "Quản lý học viên",
            manageCourses: "Quản lý khóa học",
            manageLessons: "Quản lý bài học",
            enrollments: "Đăng ký học",
            overviewStats: "Thống kê tổng quan",
            periodWeek: "Tuần",
            periodMonth: "Tháng",
            periodYear: "Năm"
        },
        sidebar: {
            logo: "LMS Mini",
            dashboard: "Dashboard",
            students: "Quản lý học viên",
            courses: "Quản lý khóa học",
            enrollments: "Đăng ký học"
        }
    }
}

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('locale') || 'vi',
    fallbackLocale: 'en',
    messages
})

export default i18n
