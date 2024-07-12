import { defineStore } from 'pinia'
import { mapImagesToUrl } from '@utils/imageUtils.js'

export const useGlobalStore = defineStore('global', () => {
  const rootUrl =
    import.meta.env.MODE !== 'production'
      ? `${import.meta.env.VITE_STATIC_FILES}/devdata`
      : `${import.meta.env.VITE_STATIC_FILES}/data`

  const sopAssyHpUrl = `${rootUrl}/SOP/AssemblyHp`

  const imageSopAssyHpUrl = (idSop, idStation, images) => {
    const url = `${sopAssyHpUrl}/${idSop}/${idStation}/`

    return mapImagesToUrl(images, url)
  }

  const pptxSopAssyHpUrl = (idSop, idStation) => {
    return `${sopAssyHpUrl}/${idSop}/${idStation}/${idSop}-${idStation}.pptx`
  }

  return { imageSopAssyHpUrl, pptxSopAssyHpUrl }
})
