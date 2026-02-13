<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchArticles, fetchCategories, baseUrl } = useStrapi()
const localePath = useLocalePath()

const currentPage = ref(1)
const pageSize = 9
const articles = ref<Record<string, unknown>[]>([])
const total = ref(0)
const loading = ref(false)
const categories = ref<Record<string, unknown>[]>([])

/** 当前选中的分类 slug（来自 query，空表示全部） */
const activeCategorySlug = computed(() => (route.query.category as string) || '')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

/** 供分页条显示的页码与省略：如 [1, 2, 3, 4, 5, 'ellipsis', 10] */
const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const list: (number | 'ellipsis')[] = []
  list.push(1)
  if (cur > 3) list.push('ellipsis')
  for (let p = Math.max(2, cur - 2); p <= Math.min(total - 1, cur + 2); p++) {
    if (!list.includes(p)) list.push(p)
  }
  if (cur < total - 2) list.push('ellipsis')
  if (total > 1) list.push(total)
  return list
})

async function loadPage(page: number) {
  if (loading.value) return
  loading.value = true
  try {
    const res = await fetchArticles(page, pageSize, activeCategorySlug.value || undefined)
    articles.value = (res.data as Record<string, unknown>[]) || []
    total.value = res.meta?.pagination?.total ?? 0
    currentPage.value = page
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

function selectCategory(slug: string) {
  currentPage.value = 1
  router.replace({
    path: route.path,
    query: slug ? { category: slug } : {},
  })
  loadPage(1)
}

// 监听分类变化（例如浏览器前进/后退）时重新拉取当前页
watch(activeCategorySlug, () => {
  loadPage(currentPage.value)
}, { flush: 'post' })

// 拉取分类列表
const { data: categoriesData } = await useAsyncData('blog-categories', fetchCategories)
if (categoriesData.value) categories.value = categoriesData.value as Record<string, unknown>[]

// 服务端渲染时加载第一页
await loadPage(1)

function posterUrl(poster: unknown): string {
  if (!poster || typeof poster !== 'object' || !('url' in poster)) return ''
  const url = (poster as { url?: string }).url
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

function categoryName(cat: unknown): string {
  if (!cat || typeof cat !== 'object' || !('name' in cat)) return ''
  return (cat as { name?: string }).name ?? ''
}

function categorySlug(cat: unknown): string {
  if (!cat || typeof cat !== 'object' || !('slug' in cat)) return ''
  return (cat as { slug?: string }).slug ?? ''
}

useSeoMeta({
  title: 'Blog - Carman Wheel',
  description: 'Carman Wheel blog articles and updates.',
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- 主体内容（导航栏由 layout 提供） -->
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

        <!-- 分类筛选 -->
        <!-- <div class="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="!activeCategorySlug
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="selectCategory('')"
          >
            {{ $t('allCategories') }}
          </button>
          <button
            v-for="cat in categories"
            :key="(cat.documentId as string) ?? categorySlug(cat)"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="activeCategorySlug === categorySlug(cat)
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="selectCategory(categorySlug(cat))"
          >
            {{ categoryName(cat) }}
          </button>
        </div> -->

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
                <div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <span>
                    <template v-if="article.category">
                      <NuxtLink
                        :to="localePath(`/blog?category=${categorySlug(article.category)}`)"
                        class="text-gray-500 hover:text-gray-900 hover:underline"
                        @click.stop
                      >
                        {{ categoryName(article.category) }}
                      </NuxtLink>
                      <span class="mx-1">·</span>
                    </template>
                    {{ $t('byCarmanTeam') }}
                  </span>
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

        <!-- 分页：带页码的上一页 / 1 2 3 … 10 / 下一页（参考旧系统 box_7） -->
        <div
          v-if="totalPages > 1"
          class="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <!-- 上一页 -->
          <button
            type="button"
            :disabled="currentPage <= 1 || loading"
            class="inline-flex h-9 w-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :aria-label="$t('prevPage')"
            @click="loadPage(currentPage - 1)"
          >
            <span class="sr-only">{{ $t('prevPage') }}</span>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- 页码 -->
          <template v-for="(item, idx) in pageNumbers" :key="idx">
            <span
              v-if="item === 'ellipsis'"
              class="inline-flex h-9 w-9 items-center justify-center text-gray-500"
              aria-hidden="true"
            >
              …
            </span>
            <button
              v-else
              type="button"
              :disabled="loading"
              class="inline-flex h-9 w-9 items-center justify-center rounded text-sm transition disabled:opacity-50"
              :class="item === currentPage
                ? 'bg-black text-white'
                : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'"
              @click="loadPage(item as number)"
            >
              {{ item }}
            </button>
          </template>

          <!-- 下一页 -->
          <button
            type="button"
            :disabled="currentPage >= totalPages || loading"
            class="inline-flex h-9 w-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :aria-label="$t('nextPage')"
            @click="loadPage(currentPage + 1)"
          >
            <span class="sr-only">{{ $t('nextPage') }}</span>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </main>

    <!-- 底部页脚组件 -->
    <AppFooter />
  </div>
</template>
