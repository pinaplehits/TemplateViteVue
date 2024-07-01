<script setup>
  import { ref, onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const emit = defineEmits(['success', 'input'])
  const items = defineModel('items', {
    type: Array,
    required: true
  })

  const props = defineProps({
    itemTitle: { type: String, default: 'title' },
    itemValue: { type: String, required: true },
    rules: { type: Array, default: () => [] },
    label: { type: String, required: true },
    endpoint: { type: String, required: true },
    multiple: { type: Boolean, default: false }
  })

  const loading = ref(false)
  const model = ref(null)

  const loadData = async () => {
    loading.value = true
    try {
      const response = await apiClient.get(props.endpoint)

      emit('success', response)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadData)

  watch(model, () => {
    emit('input', model.value)
  })
</script>

<template>
  <v-autocomplete
    class="mx-4"
    variant="solo"
    :disabled="loading"
    :loading="loading"
    v-model="model"
    :items="items"
    :item-title="props.itemTitle"
    :item-value="props.itemValue"
    :label="props.label"
    :rules="props.rules"
    :multiple="props.multiple"
  />
</template>
