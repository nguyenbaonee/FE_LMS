<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="copyright">
          © 2024 LMS Mini. All rights reserved.
        </span>
        <el-divider direction="vertical" />
        <span class="version">Version 1.0.0</span>
      </div>

      <div class="footer-right">
        <el-link href="#" :underline="false">Điều khoản sử dụng</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">Chính sách bảo mật</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">Hỗ trợ</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.footer {
  padding: 20px 24px;
  background: #fff;

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .copyright {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }

      .version {
        color: var(--el-text-color-placeholder);
        font-size: 13px;
      }
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .el-link {
        font-size: 14px;
      }
    }
  }
}
</style>


<!-- ============================================ -->
<!-- 5. EmptyLayout.vue - Layout trống (Login, Register) -->
<!-- ============================================ -->
<template>
  <div class="empty-layout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.empty-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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