const FALLBACK_LOCALE = 'en'

export function useStrapi() {
  const config = useRuntimeConfig()
  const { locale } = useI18n()
  
  // 获取 baseURL
  // 如果配置了环境变量，使用环境变量
  // 否则在生产环境使用空字符串（相对路径），开发环境使用 localhost
  let baseUrl = config.public.strapiUrl as string
  
  if (!baseUrl) {
    if (process.client) {
      // 客户端：使用当前域名（同源请求）
      baseUrl = window.location.origin
    } else {
      // 服务端：使用默认值
      baseUrl = 'http://localhost:1337'
    }
  }
  
  // 如果 baseUrl 为空字符串，表示使用相对路径（同源）
  if (baseUrl === '') {
    baseUrl = '' // 保持为空，使用相对路径
  }

  function getLocale(): string {
    const code = locale.value as string
    if (code === 'en' || code === 'zh-Hans' || code === 'zh-Hant') return code
    return FALLBACK_LOCALE
  }

  async function fetchArticles(page = 1, pageSize = 10) {
    const loc = getLocale()
    const url = `${baseUrl}/api/articles?locale=${loc}&publicationState=live&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedAt:desc&populate=poster`
    const res = await $fetch<{ data: unknown[]; meta: { pagination: { total: number } } }>(url)
    if (res.data.length === 0 && loc !== FALLBACK_LOCALE) {
      const fallback = await $fetch<{ data: unknown[]; meta: { pagination: { total: number } } }>(
        `${baseUrl}/api/articles?locale=${FALLBACK_LOCALE}&publicationState=live&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedAt:desc&populate=poster`
      )
      return fallback
    }
    return res
  }

  async function fetchArticleByPath(path: string) {
    const loc = getLocale()
    const url = `${baseUrl}/api/articles?filters[path][$eq]=${encodeURIComponent(path)}&locale=${loc}&publicationState=live&populate=poster`
    const res = await $fetch<{ data: unknown[] }>(url)
    if (res.data.length > 0) return res.data[0] as Record<string, unknown>
    if (loc !== FALLBACK_LOCALE) {
      const fallback = await $fetch<{ data: unknown[] }>(
        `${baseUrl}/api/articles?filters[path][$eq]=${encodeURIComponent(path)}&locale=${FALLBACK_LOCALE}&publicationState=live&populate=poster`
      )
      if (fallback.data.length > 0) return fallback.data[0] as Record<string, unknown>
    }
    return null
  }

  return { baseUrl, getLocale, fetchArticles, fetchArticleByPath }
}
