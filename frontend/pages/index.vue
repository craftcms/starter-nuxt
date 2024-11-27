<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { HOME_QUERY } from '@/queries/home.mjs'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch the home page data
const { data, refresh } = await useAsyncData(
  'home-page',
  async () => {
    try {
      const result = await graphql.query(HOME_QUERY, {}, {
        previewToken: previewToken.value
      })
      return result
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    }
  },
  {
    watch: [previewToken] // Watch preview token for changes
  }
)

// Watch for preview changes and refresh data
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    refresh()
  }
})
</script>

<template>
  <div :key="previewTimestamp">
    <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
      <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">
        {{ data?.entries?.[0]?.title }}
      </h1>
      <p v-if="data?.entries?.[0]?.pageSubheading" class="mt-4">
        {{ data?.entries?.[0]?.pageSubheading }}
      </p>
    </header>
    <section class="page__content">
      <div 
        class="container mx-auto py-12 px-2 text-balance" 
        v-html="data?.entries?.[0]?.pageContent"
      ></div>
    </section>
  </div>
</template>
