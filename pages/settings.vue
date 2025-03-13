<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    Einstellungen

    <div class="relative group">
      <button class="px-3 py-2 rounded hover:bg-gray-100 focus:outline-none">{{ $t('menu.language') }}</button>
      <div class="cursor-pointer w-64 absolute hidden group-hover:block bg-gray-200 rounded shadow-lg">
        <div v-for="locale in locales" :key="locale.code" class="cursor-pointer block px-4 py-2 hover:bg-gray-100" @click="setLocale(locale.code)">
          {{ locale.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'
import { useRuntimeConfig } from '#app'

const { locale } = useI18n()
const config = useRuntimeConfig()

const locales = ref(config.public.i18n.locales)

const setLocale = (localeCode) => {
  locale.value = localeCode
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