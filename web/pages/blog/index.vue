<script setup lang="ts">
const { fetchArticles, baseUrl } = useStrapi()
const localePath = useLocalePath()

const currentPage = ref(1)
const pageSize = 10
const articles = ref<Record<string, unknown>[]>([])
const total = ref(0)
const loading = ref(false)

async function loadPage(page: number) {
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
  } finally {
    loading.value = false
  }
}

await loadPage(1)

function loadMore() {
  loadPage(currentPage.value + 1)
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
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen max-w-full flex flex-col">
    <div class="mx-auto sm:px-6 lg:px-8 w-11/12 max-w-full sm:max-w-7xl py-8">
      <div class="flex items-center justify-between mb-8">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 text-lg hover:opacity-80">
          <img src="/images/logo.png" alt="logo" class="block w-10 rounded-lg">
          <span class="font-bold">Carman</span>
        </NuxtLink>
        <NuxtLink :to="localePath('/')" class="text-sm opacity-80 hover:underline">
          {{ $t('home') }}
        </NuxtLink>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold mb-6">Blog</h1>
      <div v-if="articles.length" class="space-y-6">
        <article
          v-for="(article, index) in articles"
          :key="(article.documentId as string) ?? index"
          class="border-b border-gray-200 dark:border-gray-700 pb-6"
        >
          <NuxtLink :to="localePath(`/blog/${article.path}`)" class="block group">
            <h2 class="text-xl font-semibold group-hover:underline">
              {{ (article.title as string) ?? '' }}
            </h2>
            <p v-if="article.summary" class="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ article.summary as string }}
            </p>
            <p v-if="article.publishedAt" class="mt-2 text-sm text-gray-500">
              {{ new Date(article.publishedAt as string).toLocaleDateString() }}
            </p>
          </NuxtLink>
        </article>
      </div>
      <p v-else-if="!loading" class="text-gray-500">No articles yet.</p>
      <div v-if="articles.length < total && total > 0" class="mt-6">
        <button
          type="button"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          @click="loadMore"
        >
          {{ loading ? 'Loading...' : 'More' }}
        </button>
      </div>
    </div>
  </div>
</template>
