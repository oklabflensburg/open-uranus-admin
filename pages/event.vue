<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <AddEventForm />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AddEventForm from '~/components/AddEventForm.vue'


export default defineComponent({
  components: {
    AddEventForm
  }
})
</script>