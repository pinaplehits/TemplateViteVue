<script setup>
  import { ref } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { useGlobalStore } from '@stores/globalStore.js'
  import GenericTable from '@components/GenericTable.vue'
  import GenericForm from '@components/GenericForm.vue'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import GenericAutocomplete from '@components/GenericAutocomplete.vue'
  import { sortDataByKey } from '@utils/sortUtils.js'

  const search = ref('')
  const searchFocused = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)
  const currentItem = ref({})
  const loadingFileUpload = ref(false)
  const fileSelected = ref({})
  const showCarousel = ref(false)
  const images = ref('')
  const items = ref([])
  const currentStations = ref([])
  const loadingAddStation = ref(false)

  const reload = defineModel('reload', { type: Boolean, default: false })

  const props = defineProps({
    idSop: { type: String, required: true },
    textAddButton: { type: String, required: true },
    titleForm: { type: String, required: true },
    textFormButton: { type: String, required: true },
    formInputs: { type: Object, required: true },
    endpointGet: { type: String, required: true },
    endpointDelete: { type: String, required: true },
    endpointUpdate: { type: String, required: true },
    endpointAddStation: { type: String, required: true }
  })

  const dataTable = ref({
    endpoint: props.endpointGet,
    addHeaders: [
      { title: 'Download', key: 'Download' },
      { title: 'Upload', key: 'Upload' }
    ]
  })

  const dataConfirmPassword = ref({
    endpoint: props.endpointDelete,
    data: currentItem.value
  })

  const form = ref({
    title: props.titleForm,
    buttonText: props.textFormButton,
    endpoint: props.endpointUpdate,
    data: props.formInputs
  })

  const autoComplete = ref({
    itemTitle: 'Station',
    label: 'Stations',
    endpoint: `AssemblyDell/GetStationsNotInSop/${props.idSop}`
  })

  const deleteItem = (item) => {
    currentItem.value.idStation = item
    currentItem.value.idSop = props.idSop
    showConfirmPassword.value = true
  }

  const downloadSop = async (idStation) => {
    const url = useGlobalStore().pptxSopAssyDellUrl(props.idSop, idStation)

    window.open(url, '_blank')
  }

  const showImages = async (idStation) => {
    const station = items.value.find((item) => item.id === idStation)

    images.value = useGlobalStore().imageSopAssyDellUrl(
      props.idSop,
      station.id,
      station.Images
    )
    try {
      showCarousel.value = true
    } catch (error) {
      console.error(error)
    }
  }

  const uploadFile = async (file, idStation) => {
    if (!file) {
      console.error('No file selected')
      return
    }

    loadingFileUpload.value = true
    const formData = new FormData()
    formData.append('PowerPoint', file)
    formData.append('IdStation', idStation)
    formData.append('IdSop', props.idSop)

    try {
      await apiClient.post('AssemblyDell/SlidesToImages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      fileSelected.value[idStation] = null

      reload.value = true
    } catch (error) {
      console.error('Error uploading file', error)
    } finally {
      loadingFileUpload.value = false
    }
  }

  const addStation = async () => {
    loadingAddStation.value = true
    try {
      const data = {
        SopId: props.idSop,
        StationsId: currentStations.value
      }

      await apiClient.post(props.endpointAddStation, data)

      currentStations.value = []
      reload.value = true
    } catch (error) {
      console.error(error)
    } finally {
      loadingAddStation.value = false
    }
  }
</script>

<template>
  <v-dialog
    v-model="showCarousel"
    max-width="1050"
  >
    <v-carousel
      height="100%"
      width="100%"
      show-arrows="hover"
      cycle
    >
      <v-carousel-item
        v-for="(item, i) in images"
        :key="i"
        :src="item"
        eager
      />
    </v-carousel>
  </v-dialog>
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
    <slot name="form" />
  </GenericForm>
  <v-container fill-height>
    <slot name="info" />
    <v-card elevation="4">
      <v-container>
        <v-row align="center">
          <v-icon
            class="ml-4 mr-2 cursor-pointer"
            @click.stop="$router.push({ name: 'SOP' })"
          >
            mdi-arrow-left
          </v-icon>
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
          <GenericAutocomplete
            v-model="currentStations"
            :loading="loadingAddStation"
            v-bind="autoComplete"
            @success="sortDataByKey($event.items, 'Station')"
            color="primary"
            density="compact"
            variant="outlined"
            chips
            multiple
          />
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              style="text-transform: none"
              prepend-icon="mdi-plus"
              @click.stop="addStation"
              :text="props.textAddButton"
              :disabled="currentStations.length === 0 || loadingAddStation"
            />
          </v-col>
        </v-row>
      </v-container>
      <GenericTable
        v-bind="dataTable"
        v-model:search="search"
        v-model:reload="reload"
        v-model:items="items"
        @delete-item="deleteItem"
      >
        <template #images="{ item }">
          <td>
            <v-icon
              color="green"
              class="cursor-pointer"
              v-show="item.Images.length > 0"
              @click.stop="showImages(item.id)"
            >
              mdi-image-multiple-outline
            </v-icon>
          </td>
        </template>
        <template #upload="{ item }">
          <td>
            <v-file-input
              v-model="fileSelected[item.id]"
              class="mt-2 mb-n3"
              accept=".pptx"
              variant="outlined"
              prepend-icon=""
              chips
              density="compact"
              :prepend-inner-icon="
                fileSelected[item.id] ? '' : 'mdi-file-document-plus-outline'
              "
              :append-icon="
                fileSelected[item.id] ? 'mdi-file-upload-outline' : ''
              "
              @click:append="
                fileSelected[item.id] &&
                  uploadFile(fileSelected[item.id], item.id)
              "
              max-width="300"
              color="primary"
              :disabled="loadingFileUpload"
              :loading="loadingFileUpload"
            />
          </td>
        </template>
        <template #download="{ item }">
          <td>
            <v-icon
              color="primary"
              class="cursor-pointer"
              v-show="item.Images.length > 0"
              @click.stop="downloadSop(item.id)"
            >
              mdi-cloud-download-outline
            </v-icon>
          </td>
        </template>
      </GenericTable>
    </v-card>
  </v-container>
</template>
