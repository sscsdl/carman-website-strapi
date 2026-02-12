<script setup lang="ts">
// 使用 useAsset 获取图片路径（如果需要）
// 在 Nuxt 3 中，public 目录下的文件可以直接通过 / 访问
// 但如果不行，可以使用 useAsset
</script>

<template>
  <footer class="bg-black text-white mt-20">
    <!-- 底部 CTA 区域（参考 old_system/blog.html 的 block_7） -->
    <section class="bg-black text-white">
      <div class="mx-auto max-w-6xl px-4 py-16 text-center">
        <!-- 标题 -->
        <div class="mb-10">
          <h2 class="mb-4 bg-gradient-to-br from-lime-300 to-lime-500 bg-clip-text text-5xl font-bold text-transparent">
            {{ $t('previewWheels') }}
          </h2>
          <p class="text-2xl text-gray-300">
            {{ $t('wheelBrands') }}
          </p>
        </div>

        <!-- 功能列表 -->
        <div class="mb-10 flex flex-wrap justify-center gap-8 text-lg">
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>{{ $t('wheelPreviews') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>{{ $t('brakeCaliperPreviews') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>{{ $t('carMagazineFilter') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>{{ $t('roofBoxPreview') }}</span>
          </div>
        </div>

        <!-- 下载按钮 -->
        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://apps.apple.com/us/app/carman-wheel/id6476076430"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-16 w-64 items-center justify-between rounded-lg bg-white px-5 text-black shadow-lg transition hover:shadow-xl"
          >
            <div class="flex items-center gap-3">
              <img src="~/public/images/Apple.svg" alt="Apple" class="h-7" />
              <span class="text-lg font-medium">App Store</span>
            </div>
            <img src="~/public/images/arrow.svg" alt="arrow" class="h-3" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.carfrd.carman_google"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-16 w-64 items-center justify-between rounded-lg bg-white px-5 text-black shadow-lg transition hover:shadow-xl"
          >
            <div class="flex items-center gap-3">
              <img src="~/public/images/Android.svg" alt="Android" class="h-7" />
              <span class="text-lg font-medium">Google Play</span>
            </div>
            <img src="~/public/images/arrow.svg" alt="arrow" class="h-3" />
          </a>
        </div>
      </div>
    </section>
    <!-- 分隔线 -->
    <div class="mb-0 h-px bg-gray-700" />
    <!-- 底部版权信息 -->
    <div class="flex flex-col items-center justify-center py-4 gap-4 text-sm text-gray-400 sm:flex-row">
      <div>Copyright ©2023 ADSLIBARARY. All Rights Reserved.</div>
    </div>
  </footer>
</template>

