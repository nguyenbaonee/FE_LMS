<template>
  <el-container class="main-layout">
    <el-aside :width="sidebarWidth" class="sidebar-container">
      <Sidebar :collapsed="isCollapsed" @toggle="toggleSidebar" />
    </el-aside>

    <el-container>
      <el-header height="64px" class="header-container">
        <Navbar @toggle-sidebar="toggleSidebar" />
      </el-header>

      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <el-footer height="auto" class="footer-container">
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Narbar.vue'
import Sidebar from '../components/SideBar.vue'
import Footer from '../components/Footer.vue'

const isCollapsed = ref(false)

const sidebarWidth = computed(() => isCollapsed.value ? '64px' : '240px')

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;

  .sidebar-container {
    transition: width 0.3s;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
    background: #fff;
  }

  .header-container {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 0;
    z-index: 100;
  }

  .main-content {
    background: #f5f7fa;
    padding: 20px;
    min-height: calc(100vh - 64px - 80px);
  }

  .footer-container {
    background: #fff;
    border-top: 1px solid #e4e7ed;
    padding: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>