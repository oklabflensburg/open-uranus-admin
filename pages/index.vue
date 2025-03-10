<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <Search />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Search from '~/components/Search.vue';


export default defineComponent({
  components: {
    Search
  }
})
</script>