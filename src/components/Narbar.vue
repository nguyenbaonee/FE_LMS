<template>
  <div class="navbar">
    <div class="navbar-left">
      <el-button
          circle
          @click="emit('toggle-sidebar')"
          class="toggle-btn"
      >
        <el-icon><Expand /></el-icon>
      </el-button>

      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="navbar-right">
      <!-- Search -->
      <el-input
          v-model="searchQuery"
          placeholder="Tìm kiếm..."
          :prefix-icon="Search"
          class="search-input"
          clearable
      />

      <!-- Notifications -->
      <el-badge :value="notificationCount" :hidden="notificationCount === 0">
        <el-button circle @click="showNotifications">
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>

      <!-- User Menu -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar :src="userAvatar" :size="36">Admin</el-avatar>
          <span class="user-name">{{ userName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              Thông tin cá nhân
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              Cài đặt
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              Đăng xuất
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Expand,
  Search,
  Bell,
  User,
  Setting,
  SwitchButton,
  ArrowDown
} from '@element-plus/icons-vue'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const notificationCount = ref(5)
const userName = ref('Admin User')
const userAvatar = ref('https://i.pravatar.cc/150?img=8')

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    name: item.meta.title,
    path: item.path
  }))
})

const showNotifications = () => {
  ElMessage.info('Hiển thị thông báo')
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      ElMessage.success('Đăng xuất thành công')
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.navbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .toggle-btn {
      @media (max-width: 768px) {
        display: inline-flex;
      }
    }

    .breadcrumb {
      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .search-input {
      width: 240px;

      @media (max-width: 968px) {
        display: none;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.3s;

      &:hover {
        background: var(--el-fill-color-light);
      }

      .user-name {
        font-weight: 500;

        @media (max-width: 768px) {
          display: none;
        }
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
