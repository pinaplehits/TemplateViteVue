<script setup>
  import { ref } from 'vue'
  import GenericTable from '@components/Sop/AssemblyHp/GenericTable.vue'
  import GenericForm from '@components/Sop/AssemblyHp/GenericForm.vue'
  import ConfirmPassword from '@components/Sop/AssemblyHp/ConfirmPassword.vue'

  const search = ref('')
  const searchFocused = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)
  const currentItem = ref({})

  const reload = defineModel('reload', { type: Boolean, default: false })

  const props = defineProps({
    sortKey: { type: String, default: '' },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    textAddButton: { type: String, required: true },
    titleForm: { type: String, required: true },
    textFormButton: { type: String, required: true },
    formInputs: { type: Object, required: true },
    endpointGet: { type: String, required: true },
    endpointDelete: { type: String, required: true },
    endpointCreate: { type: String, required: true }
  })

  const dataTable = ref({
    classTr: 'cursor-pointer',
    density: 'compact',
    endpoint: props.endpointGet,
    sortKey: props.sortKey
  })

  const dataConfirmPassword = ref({
    endpoint: props.endpointDelete,
    data: currentItem.value
  })

  const form = ref({
    title: props.titleForm,
    buttonText: props.textFormButton,
    endpoint: props.endpointCreate,
    data: props.formInputs
  })

  const deleteItem = async (item) => {
    currentItem.value.id = item
    showConfirmPassword.value = true
  }
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    v-bind="dataConfirmPassword"
    @success="reload = true"
  />
  <GenericForm
    v-model:showForm="showForm"
    v-bind="form"
    @submit-success="reload = true"
  >
    <slot />
  </GenericForm>
  <v-container fill-height>
    <h1 class="ml-2">
      {{ props.title }}
    </h1>
    <h4 class="ml-3 mb-2">
      {{ props.subtitle }}
    </h4>
    <v-card elevation="4">
      <v-container>
        <v-row align="center">
          <v-col>
            <v-text-field
              v-model="search"
              density="compact"
              label="Search"
              :prepend-inner-icon="searchFocused ? '' : 'mdi-magnify'"
              single-line
              variant="outlined"
              flat
              color="primary"
              class="my-1"
              style="max-width: 500px"
              hide-details
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              style="text-transform: none"
              prepend-icon="mdi-plus"
              @click.stop="showForm = true"
              :text="props.textAddButton"
            />
          </v-col>
        </v-row>
      </v-container>
      <GenericTable
        v-bind="dataTable"
        v-model:search="search"
        v-model:reload="reload"
        @delete-item="deleteItem"
      />
    </v-card>
  </v-container>
</template>

<style scoped>
  h1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  h4 {
    font-weight: 300;
    color: gray;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
