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
        },
        layout: {
            sidebar: "Sidebar",
            header: "Header",
            footer: "Footer",
            mainContent: "Main Content"
        },
        studentManagement: {
            title: "Student Management",
            byCourse: "By course",
            unknown: "Unknown",
            total: "Total",
            students: "students",
            exportSearch: "Export by search",
            exportAll: "Export all",
            addStudent: "Add Student"
        },
        studentFilter: {
            name: "Name",
            enterName: "Enter name",
            email: "Email",
            enterEmail: "Enter email",
            status: "Status",
            active: "Active",
            deleted: "Deleted",
            search: "Search",
            reset: "Reset"
        },
        studentTable: {
            index: "No.",
            avatar: "Avatar",
            fullName: "Full Name",
            email: "Email",
            status: "Status",
            active: "Active",
            deleted: "Deleted",
            actions: "Actions",
            view: "View",
            edit: "Edit",
            delete: "Delete"
        },
        studentDetail: {
            title: "Student Details",
            back: "Back",
            fullName: "Full Name",
            email: "Email",
            status: "Status",
            active: "Active",
            deleted: "Deleted",
            otherAvatars: "Other Avatars"
        },
        studentForm: {
            add: "Add",
            update: "Update",
            student: "Student",
            back: "Back",
            currentAvatars: "Current Avatars",
            image: "Image",
            status: "Status",
            primaryAvatar: "Primary Avatar",
            secondaryAvatar: "Secondary Avatar",
            setPrimaryAvatar: "Set as Primary Avatar",
            select: "Select",
            actions: "Actions",
            confirmDeleteAvatar: "Are you sure you want to delete this avatar?",
            delete: "Delete",
            addNewAvatar: "Add New Avatar",
            avatar: "Avatar",
            avatarUploadTip: "Allowed: JPG, PNG. Max 2MB per image. No limit on number",
            fullName: "Full Name",
            namePlaceholder: "Enter full name (5-20 characters)",
            email: "Email",
            emailPlaceholder: "Enter email (5-100 characters)",
            emailNoChange: "Email cannot be changed",
            addNew: "Add New",
            reset: "Reset",
            cancel: "Cancel"
        },
        lesson: {
            header: {
                title: "Lesson Management",
                addLesson: "Add Lesson",
                total: "Total",
                statusPlaceholder: "Active"
            },
            status: {
                active: "Active",
                deleted: "Deleted"
            },
            table: {
                index: "No.",
                thumbnail: "Thumbnail",
                title: "Title",
                course: "Course",
                video: "Video",
                view: "View",
                noVideo: "No Video",
                status: "Status",
                actions: "Actions",
                edit: "Edit",
                delete: "Delete"
            },
            videoDialog: {
                title: "Preview Video"
            }
        },
        lessonForm: {
            header: {
                add: "Add Lesson",
                update: "Update Lesson",
                back: "Back"
            },
            images: {
                label: "Images",
                tip: "Allowed: JPG, PNG. Max 5MB per image"
            },
            videos: {
                label: "Videos",
                select: "Select Video",
                tip: "Allowed: MP4, MKV, AVI. Max 500MB per video"
            },
            title: {
                label: "Lesson Title",
                placeholder: "Enter lesson title (1-200 characters)"
            },
            order: {
                label: "Lesson Order",
                placeholder: "Enter lesson order"
            },
            buttons: {
                add: "Add New",
                update: "Update",
                reset: "Reset",
                cancel: "Cancel"
            }
        },
        course: {
            header: {
                title: "Course Management",
                export: "Export Excel",
                exportAll: "Export All",
                add: "Add Course"
            },
            filter: {
                name: "Course Name",
                namePlaceholder: "Enter course name",
                code: "Course Code",
                codePlaceholder: "Enter course code",
                status: "Status",
                statusPlaceholder: "Select status",
                search: "Search",
                reset: "Reset"
            },
            status: {
                active: "Active",
                deleted: "Deleted"
            },
            table: {
                index: "No.",
                thumbnail: "Thumbnail",
                name: "Course Name",
                code: "Code",
                description: "Description",
                lessons: "Lessons",
                viewLessons: "View Lessons",
                status: "Status",
                actions: "Actions",
                viewStudents: "View Students",
                edit: "Edit",
                delete: "Delete"
            }
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
        },
        layout: {
            sidebar: "Thanh bên",
            header: "Thanh trên",
            footer: "Chân trang",
            mainContent: "Nội dung chính"
        },
        studentManagement: {
            title: "Quản lý học viên",
            byCourse: "Theo khóa học",
            unknown: "Không rõ",
            total: "Tổng",
            students: "học viên",
            exportSearch: "Xuất theo tìm kiếm",
            exportAll: "Xuất tất cả",
            addStudent: "Thêm học viên"
        },
        studentFilter: {
            name: "Tên",
            enterName: "Nhập tên",
            email: "Email",
            enterEmail: "Nhập email",
            status: "Trạng thái",
            active: "Đang hoạt động",
            deleted: "Đã xóa",
            search: "Tìm kiếm",
            reset: "Reset"
        },
        studentTable: {
            index: "STT",
            avatar: "Avatar",
            fullName: "Họ tên",
            email: "Email",
            status: "Trạng thái",
            active: "Hoạt động",
            deleted: "Đã xóa",
            actions: "Thao tác",
            view: "Xem",
            edit: "Sửa",
            delete: "Xóa"
        },
        studentDetail: {
            title: "Chi tiết học viên",
            back: "Quay lại",
            fullName: "Họ tên",
            email: "Email",
            status: "Trạng thái",
            active: "Hoạt động",
            deleted: "Đã xóa",
            otherAvatars: "Avatar khác"
        },
        studentForm: {
            add: "Thêm",
            update: "Cập nhật",
            student: "học viên",
            back: "Quay lại",
            currentAvatars: "Avatar hiện có",
            image: "Ảnh",
            status: "Trạng thái",
            primaryAvatar: "Avatar chính",
            secondaryAvatar: "Avatar phụ",
            setPrimaryAvatar: "Đặt làm avatar chính",
            select: "Chọn",
            actions: "Hành động",
            confirmDeleteAvatar: "Bạn có chắc muốn xóa avatar này?",
            delete: "Xóa",
            cancel: "Hủy",
            addNewAvatar: "Thêm avatar mới",
            avatar: "Avatar",
            avatarUploadTip: "Cho phép: JPG, PNG. Tối đa 2MB/ảnh. Không giới hạn số lượng",
            fullName: "Họ tên",
            namePlaceholder: "Nhập họ tên (5-20 ký tự)",
            email: "Email",
            emailPlaceholder: "Nhập email (5-100 ký tự)",
            emailNoChange: "Email không được đổi",
            addNew: "Thêm mới",
            reset: "Làm mới",
        },
        lesson: {
            header: {
                title: "Quản lý bài học",
                addLesson: "Thêm bài học",
                total: "Tổng",
                statusPlaceholder: "Đang hoạt động"
            },
            status: {
                active: "Hoạt động",
                deleted: "Đã xóa"
            },
            table: {
                index: "STT",
                thumbnail: "Thumbnail",
                title: "Tiêu đề",
                course: "Khóa học",
                video: "Video",
                view: "Xem",
                noVideo: "Chưa có",
                status: "Trạng thái",
                actions: "Thao tác",
                edit: "Sửa",
                delete: "Xóa"
            },
            videoDialog: {
                title: "Xem video"
            }
        },
        course: {
            header: {
                title: "Quản lý khóa học",
                export: "Xuất Excel",
                exportAll: "Xuất tất cả",
                add: "Thêm khóa học"
            },
            filter: {
                name: "Tên khóa học",
                namePlaceholder: "Nhập tên khóa học",
                code: "Mã khóa học",
                codePlaceholder: "Nhập mã khóa học",
                status: "Trạng thái",
                statusPlaceholder: "Chọn trạng thái",
                search: "Tìm kiếm",
                reset: "Reset"
            },
            status: {
                active: "Hoạt động",
                deleted: "Đã xóa"
            },
            table: {
                index: "STT",
                thumbnail: "Thumbnail",
                name: "Tên khóa học",
                code: "Mã khóa học",
                description: "Mô tả",
                lessons: "Quản Lý Bài Giảng",
                viewLessons: "Xem Bài giảng",
                status: "Trạng thái",
                actions: "Thao tác",
                viewStudents: "Xem Học viên",
                edit: "Sửa",
                delete: "Xóa"
            }
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
