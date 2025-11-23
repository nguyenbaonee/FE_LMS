<template>
  <div class="sidebar" :class="{ collapsed }">
    <!-- Logo -->
    <div class="logo-container">
      <div class="logo">
        <el-icon :size="28" color="#667eea"><Reading /></el-icon>
        <transition name="fade">
          <span v-show="!collapsed" class="logo-text">{{ $t('sidebar.logo') }}</span>
        </transition>
      </div>
    </div>

    <!-- Menu -->
    <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :collapse-transition="false"
        @select="handleMenuSelect"
    >
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <template #title>{{ $t('sidebar.dashboard') }}</template>
      </el-menu-item>

      <el-menu-item index="/students">
        <el-icon><UserFilled /></el-icon>
        <template #title>{{ $t('sidebar.students') }}</template>
      </el-menu-item>

      <el-menu-item index="/courses">
        <el-icon><Reading /></el-icon>
        <template #title>{{ $t('sidebar.courses') }}</template>
      </el-menu-item>

      <el-menu-item index="/enrollments">
        <el-icon><Tickets /></el-icon>
        <template #title>{{ $t('sidebar.enrollments') }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Reading,
  Odometer,
  UserFilled,
  Document,
  Tickets,
  DataAnalysis,
  Setting
} from '@element-plus/icons-vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])
const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => route.path)

const handleMenuSelect = (index) => {
  router.push(index)
}
</script>

<style scoped lang="scss">
.sidebar {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;

  .logo-container {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #e4e7ed;

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;

      .logo-text {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        white-space: nowrap;
      }
    }
  }

  &.collapsed {
    .logo-container {
      justify-content: center;
      padding: 0 16px;
    }
  }

  :deep(.el-menu) {
    border-right: none;
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #dcdfe6;
      border-radius: 3px;
    }
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 50px;
    line-height: 50px;

    &.is-active {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
      color: #667eea;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #667eea;
      }
    }
  }

  :deep(.el-sub-menu .el-menu-item) {
    padding-left: 60px !important;
    min-width: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>