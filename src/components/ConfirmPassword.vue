<script setup>
  import { ref, watch, computed } from 'vue'

  const props = defineProps({
    showDialog: { type: Boolean, required: true }
  })

  const emit = defineEmits(['update:showDialog'])

  const loading = ref(false)
  const form = ref(null)
  const password = ref('')
  const passwordVisible = ref(false)

  const dialogModel = computed({
    get() {
      return props.showDialog
    },
    set(value) {
      emit('update:showDialog', value)
    }
  })

  const validate = async () => {
    const { valid } = await form.value.validate()

    if (!valid) return

    loading.value = true

    setTimeout(() => {
      loading.value = false
      emit('update:showDialog', false)
    }, 2000)
  }

  watch(
    () => props.showDialog,
    (newValue) => {
      if (!newValue) {
        form.value.reset()
        passwordVisible.value = false
      }
    }
  )
</script>

<template>
  <v-dialog
    persistent
    v-model="dialogModel"
    max-width="525"
  >
    <v-card class="px-2 py-2">
      <v-card-title
        class="mb-n1"
        style="font-weight: bold"
      >
        Confirm Password
      </v-card-title>
      <v-card-subtitle class="mb-5">
        To proceed, please enter your password
      </v-card-subtitle>
      <v-form
        ref="form"
        @submit.prevent
      >
        <v-text-field
          autofocus
          class="mx-4"
          variant="outlined"
          color="primary"
          v-model="password"
          label="Password"
          :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[(value) => !!value || 'Password is required']"
          :disabled="loading"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loading"
            text="Cancel"
            @click.stop="dialogModel = false"
          />
          <v-btn
            text="Delete"
            :disabled="loading"
            :loading="loading"
            type="submit"
            class="delete-button"
            @click="validate"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .v-btn {
    font-weight: bold;
  }
  .delete-button {
    background-color: #b00020;
    color: white;
  }
</style>
