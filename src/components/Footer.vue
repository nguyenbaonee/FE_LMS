<template>
    <div class="footer">
      <div class="footer-content">
        <div class="footer-left">
        <span class="copyright">
          {{ $t('footer.copyright') }}
        </span>
          <el-divider direction="vertical" />
          <span class="version">{{ $t('footer.version') }}</span>
        </div>

        <div class="footer-right">
          <el-link href="#" :underline="false">{{ $t('footer.terms') }}</el-link>
          <el-divider direction="vertical" />
          <el-link href="#" :underline="false">{{ $t('footer.privacy') }}</el-link>
          <el-divider direction="vertical" />
          <el-link href="#" :underline="false">{{ $t('footer.support') }}</el-link>
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