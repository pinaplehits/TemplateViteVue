import apiClient from './axiosConfig.js'
import { convertDateProperties } from './dateUtils.js'

export async function populateAdminTable(endpointGet) {
  const response = await apiClient.get(endpointGet)
  let items = []
  let headers = []

  if (response.items) {
    items = convertDateProperties(response)
  }

  if (response.headers) {
    headers = response.headers.filter((header) => header.visible === true)
    headers.push({ title: 'Actions', key: 'Actions' })
  }

  return { items, headers }
}
