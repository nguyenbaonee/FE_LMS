<template>
  <div class="navbar">
    <div class="navbar-left">
      <!-- Nút toggle sidebar -->
      <el-button
          circle
          @click="emit('toggle-sidebar')"
          class="toggle-btn"
      >
        <el-icon><Expand /></el-icon>
      </el-button>

      <!-- Nút chuyển ngôn ngữ -->
      <div class="lang-switcher">
        <el-button
            :type="locale.value === 'vi' ? 'primary' : 'default'"
            size="small"
            @click="switchLang('vi')"
        >
          VI
        </el-button>
        <el-button
            :type="locale.value === 'en' ? 'primary' : 'default'"
            size="small"
            @click="switchLang('en')"
        >
          EN
        </el-button>
      </div>

      <!-- Breadcrumb -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">{{ $t('nav.home') }}</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="navbar-right">
      <!-- Dropdown thông tin user -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar :src="userAvatar" :size="36">{{ userName }}</el-avatar>
          <span class="user-name">{{ userName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              {{ $t('nav.profile') }}
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><User /></el-icon>
              {{ $t('nav.settings') }}
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <el-icon><ArrowDown /></el-icon>
              {{ $t('nav.logout') }}
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
    import { Expand, User, ArrowDown } from '@element-plus/icons-vue'
    import { useI18n } from 'vue-i18n'
    import { useLocaleStore } from '../stores/useLocaleStore'
    import axios from 'axios'

    const localeStore = useLocaleStore()
    const { locale } = useI18n()

    const switchLang = (lang) => {
      locale.value = lang
      localeStore.setLocale(lang)
      axios.defaults.headers['Accept-Language'] = lang
    }

    const currentLangLabel = computed(() => (locale.value === 'vi' ? 'VI' : 'EN'))

    const emit = defineEmits(['toggle-sidebar'])
    const router = useRouter()
    const route = useRoute()
    const userName = ref('Admin User')
    const userAvatar = ref('https://i.pravatar.cc/150?img=8')

    const breadcrumbs = computed(() => {
      const matched = route.matched.filter(item => item.meta?.title)
      return matched.map(item => ({
        name: item.meta.title,
        path: item.path
      }))
    })

    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'settings':
          router.push('/settings')
          break
        case 'logout':
          ElMessage.success($t('nav.logout')) // i18n
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
