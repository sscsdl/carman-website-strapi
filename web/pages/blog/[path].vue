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
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- 主体内容（导航栏由 layout 提供） -->
    <main class="flex-1 bg-white">
      <section class="mx-auto max-w-4xl px-4 py-10 lg:py-14">
        <!-- 面包屑（Home > Blog > Article） -->
        <div class="mb-6 flex items-center text-sm text-gray-500">
          <NuxtLink :to="localePath('/')" class="hover:text-gray-900">
            {{ $t('home') }}
          </NuxtLink>
          <span class="mx-2 text-gray-400">/</span>
          <NuxtLink :to="localePath('/blog')" class="hover:text-gray-900">
            {{ $t('blog') }}
          </NuxtLink>
          <span v-if="article" class="mx-2 text-gray-400">/</span>
          <span v-if="article" class="font-medium text-gray-900 line-clamp-1">
            {{ article.title as string }}
          </span>
        </div>

        <!-- 文章内容 -->
        <div v-if="notFound" class="py-12 text-center">
          <h1 class="text-2xl font-semibold mb-4">{{ $t('articleNotFound') }}</h1>
          <NuxtLink :to="localePath('/blog')" class="inline-block mt-4 text-blue-600 hover:underline">
            {{ $t('backToBlog') }}
          </NuxtLink>
        </div>

        <article v-else-if="article" class="prose prose-lg max-w-none">
          <!-- 文章标题 -->
          <h1 class="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            {{ article.title as string }}
          </h1>

          <!-- 文章元信息 -->
          <div class="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <NuxtLink
                v-if="article.category && (article.category as Record<string, unknown>).slug"
                :to="localePath(`/blog?category=${(article.category as Record<string, unknown>).slug}`)"
                class="hover:text-gray-900 hover:underline"
              >
                {{ (article.category as Record<string, unknown>)?.name ?? '' }}
              </NuxtLink>
              <template v-if="article.category"> · </template>
              <span>{{ $t('byCarmanTeam') }}</span>
            </div>
            <span v-if="article.publishedAt" class="flex items-center gap-2">
              <span>{{ $t('publishedOn') }}</span>
              <time :datetime="article.publishedAt as string">
                {{ new Date(article.publishedAt as string).toLocaleDateString() }}
              </time>
            </span>
          </div>

          <!-- 封面图 -->
          <div v-if="article.poster && posterUrl(article.poster)" class="mb-8">
            <img
              :src="posterUrl(article.poster)"
              :alt="(article.title as string) ?? ''"
              class="w-full h-auto rounded-lg object-cover"
            >
          </div>

          <!-- 文章摘要 -->
          <p v-if="article.summary" class="text-xl text-gray-600 mb-8 leading-relaxed">
            {{ article.summary as string }}
          </p>

          <!-- 文章内容 -->
          <div v-if="article.content" class="richtext-content text-gray-700 leading-relaxed">
            <!-- 如果内容是 Markdown 或 HTML，需要渲染 -->
            <div v-if="typeof article.content === 'string'" class="whitespace-pre-wrap">
              {{ article.content }}
            </div>
            <!-- 如果内容是 JSON 格式（Strapi richtext），需要解析 -->
            <div v-else class="prose-content">
              <!-- 这里可以添加 richtext 渲染器，暂时显示为文本 -->
              <pre class="whitespace-pre-wrap">{{ JSON.stringify(article.content, null, 2) }}</pre>
            </div>
          </div>

          <!-- 返回博客列表 -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <NuxtLink
              :to="localePath('/blog')"
              class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span>←</span>
              <span>{{ $t('backToBlog') }}</span>
            </NuxtLink>
          </div>
        </article>
      </section>
    </main>

    <!-- 底部页脚组件 -->
    <AppFooter />
  </div>
</template>

<style scoped>
.prose {
  @apply text-gray-900;
}

.prose h1 {
  @apply text-3xl font-bold mb-6;
}

.prose h2 {
  @apply text-2xl font-semibold mb-4 mt-8;
}

.prose h3 {
  @apply text-xl font-semibold mb-3 mt-6;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul,
.prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 hover:underline;
}

.prose img {
  @apply rounded-lg my-6;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic my-4;
}

.prose code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}

.prose pre code {
  @apply bg-transparent p-0;
}
</style>
