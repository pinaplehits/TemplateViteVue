<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const emit = defineEmits(['submitSuccess'])
  const showForm = defineModel('showForm', {
    type: Boolean,
    required: true
  })

  const props = defineProps({
    title: { type: String, required: true },
    subtitle: {
      type: String,
      default: 'Please ensure all fields are filled out before proceeding.'
    },
    buttonText: { type: String, required: true },
    endpoint: { type: String, required: true },
    data: { type: Object, default: () => {} }
  })

  const form = ref(null)
  const errorMessage = ref(null)
  const loading = ref(false)

  const submitForm = async () => {
    form.value.resetValidation()

    const { valid } = await form.value.validate()
    if (!valid) return

    try {
      loading.value = true

      const response = await apiClient.post(props.endpoint, props.data)
      showForm.value = false
      emit('submitSuccess', response)
    } catch (error) {
      errorMessage.value = error
    } finally {
      loading.value = false
    }
  }

  watch(showForm, (value) => {
    if (!value) {
      form.value.reset()
      errorMessage.value = null
    }
  })
</script>

<template>
  <v-dialog
    :persistent="loading"
    v-model="showForm"
    max-width="600"
  >
    <v-card class="px-2 py-2">
      <v-card-title
        class="mb-n1"
        style="font-weight: bold"
      >
        {{ props.title }}
      </v-card-title>
      <v-card-subtitle class="mb-5">
        {{ props.subtitle }}
      </v-card-subtitle>
      <v-form
        ref="form"
        @submit.prevent
      >
        <slot />
        <v-card-text
          v-if="errorMessage"
          style="color: #b00020"
        >
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loading"
            text="Cancel"
            @click.stop="showForm = false"
          />
          <v-btn
            :text="props.buttonText"
            :disabled="loading"
            :loading="loading"
            type="submit"
            @click.stop="submitForm"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .v-btn {
    text-transform: none;
  }
</style>
