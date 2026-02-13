<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const { fetchCategories } = useStrapi()

const showLanguageMenu = ref(false)
const languageMenuRef = ref<HTMLElement | null>(null)

// 导航栏分类（后台设置）：切换语言时重新拉取，客户端为空时再拉一次
const { data: navCategories, refresh: refreshCategories } = await useAsyncData(
  'header-categories',
  () => fetchCategories(),
  { watch: [locale] }
)
const categories = computed(() => (navCategories.value || []) as Record<string, unknown>[])

function isBlogActive(): boolean {
  return route.path.endsWith('/blog') && !route.query.category
}

function isCategoryActive(slug: string): boolean {
  return route.path.endsWith('/blog') && route.query.category === slug
}

// 获取当前语言显示名称
const currentLocaleName = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value)
  return current?.name || 'English'
})

// 切换语言
function switchLanguage(localeCode: string) {
  const path = switchLocalePath(localeCode)
  if (path) {
    navigateTo(path)
  }
  showLanguageMenu.value = false
}

// 点击外部区域关闭菜单；若服务端未拿到分类则在客户端再拉一次
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (languageMenuRef.value && !languageMenuRef.value.contains(event.target as Node)) {
      showLanguageMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  if (categories.value.length === 0) {
    refreshCategories()
  }
})
</script>

<template>
  <header class="bg-black text-white">
    <div class="mx-auto flex h-20 max-w-6xl items-center px-4 gap-10">
      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="flex items-center gap-3">
        <div class="flex h-12 w-40 items-center justify-center rounded bg-[url('/images/logo.webp')] bg-contain bg-no-repeat bg-center">
          <!-- <img src="/images/logo.png" alt="Carman" class="h-5"> -->
        </div>
      </NuxtLink>

      <!-- 主导航：后台分类 + Blog -->
      <nav class="hidden items-center gap-8 text-sm md:flex">
        <NuxtLink
          v-for="cat in categories"
          :key="(cat.documentId as string) ?? (cat.slug as string)"
          :to="localePath(`/blog?category=${encodeURIComponent((cat.slug as string) ?? '')}`)"
          class="text-gray-200 transition hover:text-lime-300"
          :class="{ 'text-lime-400': isCategoryActive((cat.slug as string) ?? '') }"
        >
          {{ (cat.name as string) ?? '' }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/blog')"
          class="text-gray-200 transition hover:text-lime-300"
          :class="{ 'text-lime-400': isBlogActive() }"
        >
          {{ $t('blog') }}
        </NuxtLink>
      </nav>

      <!-- 语言切换下拉菜单 -->
      <div ref="languageMenuRef" class="relative ml-auto">
        <button
          type="button"
          class="flex items-center gap-2 rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-200 transition hover:bg-gray-800"
          @click.stop="showLanguageMenu = !showLanguageMenu"
        >
          <span>{{ currentLocaleName }}</span>
          <span class="text-xs text-gray-400">▼</span>
        </button>

        <!-- 下拉菜单 -->
        <div
          v-if="showLanguageMenu"
          class="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded border border-gray-600 bg-black shadow-lg"
        >
          <button
            v-for="loc in locales"
            :key="(loc as any).code"
            type="button"
            class="w-full px-4 py-2 text-left text-sm text-gray-200 transition hover:bg-gray-800"
            :class="{ 'bg-gray-800 text-lime-400': (loc as any).code === locale }"
            @click="switchLanguage((loc as any).code)"
          >
            {{ (loc as any).name }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

