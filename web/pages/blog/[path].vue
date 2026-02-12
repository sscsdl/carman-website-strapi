<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { fetchArticleByPath, baseUrl } = useStrapi()

const path = computed(() => route.params.path as string)
const article = ref<Record<string, unknown> | null>(null)
const notFound = ref(false)

const { data, error } = await useAsyncData(`article-${path.value}`, () => fetchArticleByPath(path.value))

if (error.value || !data.value) {
  notFound.value = true
} else {
  article.value = data.value
}

function posterUrl(poster: unknown): string {
  if (!poster || typeof poster !== 'object' || !('url' in poster)) return ''
  const url = (poster as { url?: string }).url
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

useSeoMeta(() =>
  article.value
    ? {
        title: `${article.value.title as string} - Carman Wheel Blog`,
        description: (article.value.summary as string) || '',
      }
    : { title: 'Blog - Carman Wheel', description: '' },
)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen max-w-full flex flex-col">
    <div class="mx-auto sm:px-6 lg:px-8 w-11/12 max-w-full sm:max-w-3xl py-8">
      <div class="flex items-center justify-between mb-8">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 text-lg hover:opacity-80">
          <img src="/images/logo.png" alt="logo" class="block w-10 rounded-lg">
          <span class="font-bold">Carman</span>
        </NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="text-sm opacity-80 hover:underline">Blog</NuxtLink>
      </div>
      <div v-if="notFound" class="py-12 text-center">
        <h1 class="text-xl font-semibold">Article not found</h1>
        <NuxtLink :to="localePath('/blog')" class="mt-4 inline-block text-blue-600 hover:underline">Back to Blog</NuxtLink>
      </div>
      <article v-else-if="article" class="prose dark:prose-invert max-w-none">
        <h1 class="text-2xl sm:text-3xl font-bold mb-4">{{ article.title as string }}</h1>
        <p v-if="article.publishedAt" class="text-sm text-gray-500 mb-6">
          {{ new Date(article.publishedAt as string).toLocaleDateString() }}
        </p>
        <img
          v-if="article.poster && posterUrl(article.poster)"
          :src="posterUrl(article.poster)"
          :alt="(article.title as string) ?? ''"
          class="rounded-lg w-full max-h-64 object-cover mb-6"
        >
        <div v-if="article.content" class="richtext">
          <!-- Strapi richtext is often raw JSON/Markdown; for simplicity render as text or use a renderer -->
          <p class="whitespace-pre-wrap">{{ article.content }}</p>
        </div>
        <NuxtLink :to="localePath('/blog')" class="inline-block mt-8 text-blue-600 hover:underline">
          ← Back to Blog
        </NuxtLink>
      </article>
    </div>
  </div>
</template>
