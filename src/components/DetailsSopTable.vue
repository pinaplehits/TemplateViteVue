<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const loading = defineModel('loading', { type: Boolean, required: true })

  const emit = defineEmits([
    'deleteItem',
    'addStationSuccess',
    'uploadFileSuccess'
  ])

  const props = defineProps({
    items: { type: Array, required: true },
    headers: { type: Array, required: true },
    stations: { type: Array, required: true },
    idSop: { type: String, required: true },
    endpointAddStation: { type: String, required: true },
    textAddButton: { type: String, default: 'Add' }
  })

  const sortBy = ref([])
  const selected = ref([])
  const search = ref('')
  const loadingAddStation = ref(false)
  const loadingFileUpload = ref(false)
  const searchFocused = ref(false)
  const currentStations = ref([])
  const fileSelected = ref({})

  const showDialog = ref(false)
  const images = ref()

  const downloadSop = async (idStation) => {
    // TODO: move rootFolder to a pinia global variable
    let rootFolder
    if (import.meta.env.MODE === 'development') {
      rootFolder = 'devdata'
    } else {
      rootFolder = 'data'
    }

    const url = `https://localhost:3000/${rootFolder}/SOP/AssemblyDell/${props.idSop}/${idStation}/${props.idSop}-${idStation}.pptx`

    window.open(url, '_blank')
  }

  const showImages = async (idStation) => {
    let rootFolder
    if (import.meta.env.MODE === 'development') {
      rootFolder = 'devdata'
    } else {
      rootFolder = 'data'
    }
    const url = `https://localhost:3000/${rootFolder}/SOP/AssemblyDell/${props.idSop}/${idStation}/`

    images.value = props.items
      .find((item) => item.id === idStation)
      ?.Images.split(',')
      .map((imagen) => ({ src: `${url}${imagen}` }))

    try {
      showDialog.value = true
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
      const response = await apiClient.post(
        'AssemblyDell/SlidesToImages',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      fileSelected.value[idStation] = null

      emit('uploadFileSuccess', response)
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

      const response = await apiClient.post(props.endpointAddStation, data)

      currentStations.value = []
      emit('addStationSuccess', response)
    } catch (error) {
      console.error(error)
    } finally {
      loadingAddStation.value = false
    }
  }

  const toggleSort = (key) => {
    let order = 'asc'
    if (sortBy.value[0] && sortBy.value[0].key === key) {
      if (sortBy.value[0].order === 'asc') {
        order = 'desc'
      } else {
        sortBy.value = []
        return
      }
    }

    sortBy.value = [{ key, order }]
  }

  const sortIcon = (key) => {
    if (sortBy.value[0]?.key === key) {
      return sortBy.value[0]?.order === 'asc'
        ? 'mdi-arrow-up'
        : 'mdi-arrow-down'
    }

    return 'mdi-arrow-up'
  }

  watch(search, () => {
    selected.value = []
  })
</script>

<template>
  <v-dialog
    v-model="showDialog"
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
        :src="item.src"
      />
    </v-carousel>
  </v-dialog>
  <v-container fill-height>
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
          <v-col>
            <v-autocomplete
              v-model="currentStations"
              chips
              multiple
              class="mr-4"
              variant="solo"
              item-title="Station"
              item-value="id"
              :items="props.stations"
              label="Stations"
              :disabled="loading"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn
              :disabled="currentStations.length === 0 || loadingAddStation"
              color="primary"
              :loading="loading"
              @click.stop="addStation"
              :text="props.textAddButton"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        :items="props.items"
        :headers="props.headers"
        :loading="loading"
        :search="search"
        :sort-by="sortBy"
        v-model="selected"
        hover
        show-select
        fixed-header
        items-per-page="-1"
        hide-default-footer
        return-object
        class="pa-2"
        density="compact"
      >
        <template #loading>
          <v-skeleton-loader type="table-row-divider@10" />
        </template>
        <template #headers="{ columns, allSelected, selectAll, someSelected }">
          <tr>
            <template
              v-for="column in columns"
              :key="column.key"
            >
              <template v-if="column.value === 'data-table-select'">
                <th>
                  <v-checkbox-btn
                    :indeterminate="someSelected && !allSelected"
                    :model-value="allSelected"
                    color="primary"
                    @update:model-value="selectAll(!allSelected)"
                    @click.stop
                  />
                </th>
              </template>
              <template
                v-else-if="
                  column.key === 'Actions' ||
                  column.key === 'Upload' ||
                  column.key === 'Download' ||
                  column.key === 'Images'
                "
              >
                <th>
                  {{ column.title }}
                </th>
              </template>
              <template v-else>
                <th
                  class="header-no-wrap"
                  @click.stop="toggleSort(column.key)"
                >
                  {{ column.title }}
                  <v-icon
                    small
                    class="sort-icon"
                    :class="{ 'is-sorting': sortBy[0]?.key === column.key }"
                  >
                    {{ sortIcon(column.key) }}
                  </v-icon>
                </th>
              </template>
            </template>
          </tr>
        </template>
        <template #item="{ item, columns }">
          <tr>
            <template
              v-for="column in columns"
              :key="column.key"
            >
              <template v-if="column.key === 'data-table-select'">
                <td style="width: 0px">
                  <v-checkbox-btn
                    v-model="selected"
                    :value="item"
                    color="primary"
                    @click.stop
                  />
                </td>
              </template>
              <template v-else-if="column.key === 'Actions'">
                <td style="text-align: center; width: 0px">
                  <v-icon
                    class="delete-icon"
                    @click.stop="() => emit('deleteItem', item.id)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </template>
              <template v-else-if="column.key === 'Images'">
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
              <template v-else-if="column.key === 'Download'">
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
              <template v-else-if="column.key === 'Upload'">
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
                      fileSelected[item.id]
                        ? ''
                        : 'mdi-file-document-plus-outline'
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
              <template v-else>
                <td>
                  {{ item[column.key] }}
                </td>
              </template>
            </template>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
  .v-data-table {
    height: calc(100vh - 145px);
  }

  :deep(th) {
    background-color: lavender !important;
    font-weight: bold !important;
  }

  .header-no-wrap {
    cursor: pointer;
    white-space: nowrap;
  }

  .header-no-wrap:hover .sort-icon:not(.is-sorting) {
    visibility: visible;
    opacity: 0.5;
  }

  .sort-icon {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .is-sorting {
    visibility: visible;
    opacity: 1;
  }

  .delete-icon {
    color: maroon;
    transition:
      background-color 0.3s,
      border-radius 0.3s,
      padding 0.3s;
    padding: var(--delete-icon-padding, 7px);
    box-sizing: content-box;
  }

  .delete-icon:hover {
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 100%;
  }
</style>
