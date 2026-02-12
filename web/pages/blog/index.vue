<script setup lang="ts">
const { fetchArticles, baseUrl } = useStrapi()
const localePath = useLocalePath()

const currentPage = ref(1)
const pageSize = 10
const articles = ref<Record<string, unknown>[]>([])
const total = ref(0)
const loading = ref(false)

async function loadPage(page: number) {
  if (loading.value) return // 防止重复请求
  loading.value = true
  try {
    const res = await fetchArticles(page, pageSize)
    if (page === 1) {
      articles.value = (res.data as Record<string, unknown>[]) || []
    } else {
      articles.value = articles.value.concat((res.data as Record<string, unknown>[]) || [])
    }
    total.value = res.meta?.pagination?.total ?? 0
    currentPage.value = page
  } catch (error) {
    console.error('加载文章失败:', error)
    // 可以在这里添加错误提示
  } finally {
    loading.value = false
  }
}

// 服务端渲染时加载第一页
await loadPage(1)

function loadMore() {
  if (!loading.value && articles.value.length < total.value) {
    loadPage(currentPage.value + 1)
  }
}

function posterUrl(poster: unknown): string {
  if (!poster || typeof poster !== 'object' || !('url' in poster)) return ''
  const url = (poster as { url?: string }).url
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

useSeoMeta({
  title: 'Blog - Carman Wheel',
  description: 'Carman Wheel blog articles and updates.',
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- 顶部导航栏组件 -->
    <AppHeader />

    <!-- 主体内容 -->
    <main class="flex-1 bg-white">
      <section class="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <!-- 面包屑（Home > Blog） -->
        <div class="mb-6 flex items-center text-sm text-gray-500">
          <NuxtLink :to="localePath('/')" class="hover:text-gray-900">
            {{ $t('home') }}
          </NuxtLink>
          <span class="mx-2 text-gray-400">/</span>
          <span class="font-medium text-gray-900">
            {{ $t('blog') }}
          </span>
        </div>

        <!-- 大标题：View All Carman Guides -->
        <div class="mb-10 text-center">
          <h1 class="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {{ $t('viewAllGuides') }}
          </h1>
        </div>

        <!-- 文章网格（参考旧设计的三列卡片） -->
        <div v-if="articles.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(article, index) in articles"
            :key="(article.documentId as string) ?? index"
            class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <NuxtLink :to="localePath(`/blog/${article.path}`)" class="flex h-full flex-col">
              <!-- 封面图 -->
              <div class="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  v-if="(article.poster as unknown)"
                  :src="posterUrl(article.poster)"
                  alt=""
                  class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                >
              </div>

              <!-- 文本内容 -->
              <div class="flex flex-1 flex-col p-5">
                <h2 class="line-clamp-2 text-lg font-semibold text-gray-900">
                  {{ (article.title as string) ?? '' }}
                </h2>
                <p v-if="article.summary" class="mt-3 line-clamp-3 text-sm text-gray-600">
                  {{ article.summary as string }}
                </p>
                <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{{ $t('byCarmanTeam') }}</span>
                  <span v-if="article.publishedAt">
                    {{ new Date(article.publishedAt as string).toLocaleDateString() }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>

        <!-- 无数据 -->
        <p v-else-if="!loading" class="mt-16 text-center text-gray-500">
          {{ $t('noArticles') }}
        </p>

        <!-- 加载更多，放在列表下方中间，模拟旧设计的分页区域 -->
        <div
          v-if="articles.length < total && total > 0"
          class="mt-12 flex justify-center"
        >
          <button
            type="button"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:opacity-50"
            @click="loadMore"
          >
            {{ loading ? $t('loading') : $t('more') }}
          </button>
        </div>
      </section>
    </main>

    <!-- 底部页脚组件 -->
    <AppFooter />
  </div>
</template>
