<template>
  <main class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <h1 class="text-xl font-bold">{{ $t('settings.title') }}</h1>

    <!-- Language Switcher -->
    <div class="mt-4">
      <div class="sr-only" id="language-selection">{{ $t('settings.selectLanguage') }}</div>
      <div class="flex space-x-2" role="radiogroup" aria-labelledby="language-selection">
        <button
          v-for="localeItem in locales"
          :key="localeItem.code"
          @click="setLocale(localeItem.code)"
          class="px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"

          :aria-current="locale === localeItem.code ? 'true' : 'false'"
          role="radio"
          :aria-checked="locale === localeItem.code"
          :aria-label="$t('settings.switchTo', { language: localeItem.name })"
        >
          {{ localeItem.name }}
          <span v-if="locale === localeItem.code" class="ml-1">✓</span>
        </button>
      </div>
      
      <!-- Debug element (can be removed after verification) -->
      <div class="mt-2 text-xs text-gray-500">
        Current locale: {{ locale }}
      </div>
      
      <div aria-live="polite" class="sr-only">
        {{ currentLanguageAnnouncement }}
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useHead } from '#imports'
import { useRuntimeConfig, useRouter } from '#app'
import { useI18n } from 'vue-i18n' 
import { useLocalePath, useSwitchLocalePath } from '#i18n'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const config = useRuntimeConfig()
const router = useRouter()

const locales = ref(config.public.i18n.locales)
const currentLanguageAnnouncement = computed(() => {
  const currentLocale = locales.value.find(l => l.code === locale.value)
  return currentLocale ? t('settings.languageChanged', { language: currentLocale.name }) : ''
})

// SPA-friendly approach to locale switching
const setLocale = async (localeCode) => {
  console.log(`Switching locale from ${locale.value} to ${localeCode}`)
  
  // Set the new locale
  locale.value = localeCode
  
  // Get the current path with the new locale applied
  const newPath = switchLocalePath(localeCode)
  
  if (newPath) {
    console.log(`Navigating to ${newPath}`)
    
    // Wait for Vue to update the DOM after locale change
    await nextTick()
    
    // Use router navigation to maintain SPA benefits
    await router.replace(newPath)
    
    // If we detect the route hasn't changed correctly, fall back to direct navigation
    // but only as a last resort
    if (router.currentRoute.value.fullPath !== newPath) {
      console.warn('Router navigation did not update path correctly, forcing page reload')
      window.location.href = newPath
    }
  } else {
    console.error(`Failed to get path for locale: ${localeCode}`)
  }
}

// Make sure head data is computed to update with locale changes
useHead({
  title: computed(() => t('settings.pageTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('settings.pageDescription'))
    }
  ],
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

definePageMeta({
  auth: true
})
</script>
