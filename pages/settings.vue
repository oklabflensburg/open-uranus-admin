<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <h2 class="text-xl font-bold">{{ $t('settings.title') }}</h2>

    <!-- Language Switcher -->
    <div class="flex space-x-2 mt-4">
      <button
        v-for="localeItem in locales"
        :key="localeItem.code"
        @click="setLocale(localeItem.code)"
        :class="{
          'bg-blue-500 text-white': locale.value === localeItem.code,
          'bg-gray-200 text-gray-700': locale.value !== localeItem.code
        }"
        class="px-4 py-2 rounded focus:outline-none hover:bg-blue-400"
      >
        {{ localeItem.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#imports'
import { useRuntimeConfig, useRouter } from '#app'
import { useI18n } from 'vue-i18n' 
import { useLocalePath } from '#i18n'

const { locale } = useI18n()
const localePath = useLocalePath() 
const config = useRuntimeConfig()
const router = useRouter()

const locales = ref(config.public.i18n.locales)

const setLocale = (localeCode) => {
  locale.value = localeCode
  router.push(localePath('/settings'))
}

useHead({
  title: 'Settings - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your events and venues from the dashboard.'
    }
  ]
})
</script>
