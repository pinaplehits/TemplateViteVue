<script setup>
  import { ref } from 'vue'
  import GenericTable from '@components/GenericTable.vue'

  const props = defineProps({ endpoint: { type: String, required: true } })

  const dataTable = ref({
    classDataTable: 'pa-2',
    endpoint: props.endpoint,
    addHeaders: [
      { title: 'Download', key: 'Download' },
      { title: 'Upload', key: 'Upload' }
    ]
  })

  const fileSelected = ref({})
  const loadingFileUpload = ref(false)

  const showImages = async (idStation) => console.log(idStation)
</script>

<template>
  <GenericTable v-bind="dataTable">
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
          :append-icon="fileSelected[item.id] ? 'mdi-file-upload-outline' : ''"
          @click:append="
            fileSelected[item.id] && uploadFile(fileSelected[item.id], item.id)
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
</template>
