<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <AddVenueForm />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AddVenueForm from '~/components/AddVenueForm.vue'


export default defineComponent({
  components: {
    AddVenueForm
  }
})
</script>