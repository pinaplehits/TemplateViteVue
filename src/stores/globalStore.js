import { defineStore } from 'pinia'
import { mapImagesToUrl } from '@utils/imageUtils.js'

export const useGlobalStore = defineStore('global', () => {
  const rootUrl =
    import.meta.env.MODE === 'development'
      ? `${import.meta.env.VITE_STATIC_FILES}/devdata`
      : `${import.meta.env.VITE_STATIC_FILES}/data`

  const sopAssyDellUrl = `${rootUrl}/SOP/AssemblyDell`

  const imageSopAssyDellUrl = (idSop, idStation, images) => {
    const url = `${sopAssyDellUrl}/${idSop}/${idStation}/`

    return mapImagesToUrl(images, url)
  }

  const pptxSopAssyDellUrl = (idSop, idStation) => {
    return `${sopAssyDellUrl}/${idSop}/${idStation}/${idSop}-${idStation}.pptx`
  }

  return { imageSopAssyDellUrl, pptxSopAssyDellUrl }
})
