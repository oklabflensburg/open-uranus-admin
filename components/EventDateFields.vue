<template>
  <div class="grid grid-cols-12 gap-4 mb-4">
    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <label class="block text-gray-700" for="eventDateStart">{{ $t('eventForm.eventDateStart') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
      <input 
        type="datetime-local" 
        name="eventDateStart" 
        id="eventDateStart"
        class="mt-1 p-2 w-full border rounded-xs focus-visible" 
        :value="eventDateStart"
        @input="$emit('update:eventDateStart', $event.target.value)"
        @blur="validateField('eventDateStart')"
        aria-describedby="eventDateStartError"
        aria-required="true"
        :aria-invalid="!!errors.eventDateStart"
      >
      <p v-if="errors.eventDateStart" id="eventDateStartError" class="text-red-600">{{ errors.eventDateStart }}</p>
    </div>

    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <label class="block text-gray-700" for="eventDateEnd">{{ $t('eventForm.eventDateEnd') }}</label>
      <input 
        type="datetime-local" 
        name="eventDateEnd" 
        id="eventDateEnd"
        class="mt-1 p-2 w-full border rounded-xs focus-visible" 
        :value="eventDateEnd"
        @input="$emit('update:eventDateEnd', $event.target.value)"
      >
    </div>

    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <label class="block text-gray-700" for="entryTime">{{ $t('eventForm.entryTime') }}</label>
      <input 
        type="time" 
        name="entryTime" 
        id="entryTime"
        class="mt-1 p-2 w-full border rounded-xs focus-visible" 
        :value="entryTime"
        @input="$emit('update:entryTime', $event.target.value)"
        @blur="validateField('entryTime')"
        aria-describedby="entryTimeError"
        :aria-invalid="!!errors.entryTime"
      >
      <p v-if="errors.entryTime" id="entryTimeError" class="text-red-600">{{ errors.entryTime }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  eventDateStart: {
    type: String,
    required: true
  },
  eventDateEnd: {
    type: String,
    default: ''
  },
  entryTime: {
    type: String,
    default: ''
  },
  errors: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validate-field', 'update:eventDateStart', 'update:eventDateEnd', 'update:entryTime'])

const validateField = (field) => {
  emit('validate-field', field)
}
</script>
