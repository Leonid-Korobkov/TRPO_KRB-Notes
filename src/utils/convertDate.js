export function formatDate(timestamp) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

  const date = new Date(timestamp)

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formattedDate = `${day} ${months[month]} ${year}, ${hours}:${minutes > 10 ? minutes : '0' + minutes}`
  return formattedDate
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Добавляем 1, так как месяцы в JavaScript начинаются с 0
  const year = String(date.getFullYear()).slice(-2) // Получаем последние две цифры года
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`
  return formattedDate
}
