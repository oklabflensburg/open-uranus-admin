<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <AddOrganizerForm />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AddOrganizerForm from '~/components/AddOrganizerForm.vue';


export default defineComponent({
  components: {
    AddOrganizerForm
  }
})
</script>