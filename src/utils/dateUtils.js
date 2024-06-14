/**
 * Get the current date and time formatted as a string.
 * The format is "YYYYMMDD-HHMMSS".
 *
 * @returns {string} The formatted date and time string.
 */
export const getFormattedDateForBuild = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export const convertDateProperties = (data) => {
  return data.items.map((item) => {
    for (const [key, type] of Object.entries(data.properties)) {
      if (type === 'System.DateTime' && item[key]) {
        item[key] = formatDate(item[key])
      }
    }

    return item
  })
}
