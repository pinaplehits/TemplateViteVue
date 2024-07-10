<script setup>
  import { ref } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { useGlobalStore } from '@stores/globalStore.js'
  import GenericTable from '@components/Sop/AssemblyHp/GenericTable.vue'
  import ConfirmPassword from '@components/Sop/AssemblyHp/ConfirmPassword.vue'
  import StationAutocomplete from '@components/Sop/AssemblyHp/StationAutocomplete.vue'

  const search = ref('')
  const searchFocused = ref(false)
  const showConfirmPassword = ref(false)
  const currentItem = ref({})
  const showCarousel = ref(false)
  const images = ref(null)
  const items = ref([])

  const stations = ref({
    selected: [],
    loading: false
  })

  const fileUpload = ref({
    selected: {},
    loading: false
  })

  const reload = defineModel('reload', { type: Boolean, default: false })

  const props = defineProps({
    idSop: { type: String, required: true },
    textAddButton: { type: String, required: true },
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

  const deleteItem = (item) => {
    currentItem.value.idStation = item
    currentItem.value.idSop = props.idSop
    showConfirmPassword.value = true
  }

  const downloadSop = async (idStation) => {
    const url = useGlobalStore().pptxSopAssyHpUrl(props.idSop, idStation)

    window.open(url, '_blank')
  }

  const showImages = async (idStation) => {
    const station = items.value.find((item) => item.id === idStation)

    images.value = useGlobalStore().imageSopAssyHpUrl(
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

    fileUpload.value.loading = true
    const formData = new FormData()
    formData.append('PowerPoint', file)
    formData.append('IdStation', idStation)
    formData.append('IdSop', props.idSop)

    try {
      await apiClient.post('Hp/Sop/AssemblyHpStation/Upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      fileUpload.value.selected[idStation] = null

      reload.value = true
    } catch (error) {
      console.error('Error uploading file', error)
    } finally {
      fileUpload.value.loading = false
    }
  }

  const addStation = async () => {
    stations.value.loading = true
    try {
      const data = {
        SopId: props.idSop,
        StationsId: stations.value.selected
      }

      await apiClient.post(props.endpointAddStation, data)

      stations.value.selected = []
      reload.value = true
    } catch (error) {
      console.error(error)
    } finally {
      stations.value.loading = false
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
          <StationAutocomplete
            class="mt-6"
            max-width="450"
            v-model:reload="reload"
            :endpoint="`Hp/Sop/AssemblyHpStation/GetUnassignedForSop/${idSop}`"
            v-model="stations.selected"
            :loading="stations.loading"
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
              :disabled="stations.selected.length === 0 || stations.loading"
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
              v-model="fileUpload.selected[item.id]"
              class="mt-2 mb-n3"
              accept=".pptx"
              variant="outlined"
              prepend-icon=""
              chips
              density="compact"
              :prepend-inner-icon="
                fileUpload.selected[item.id]
                  ? ''
                  : 'mdi-file-document-plus-outline'
              "
              :append-icon="
                fileUpload.selected[item.id] ? 'mdi-file-upload-outline' : ''
              "
              @click:append="
                fileUpload.selected[item.id] &&
                  uploadFile(fileUpload.selected[item.id], item.id)
              "
              max-width="300"
              color="primary"
              :disabled="fileUpload.loading"
              :loading="fileUpload.loading"
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
