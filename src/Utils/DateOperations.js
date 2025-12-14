import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

// Función para parsear una fecha a formato 'YYYY/MM/DD HH:mm:ss'
function parseDate (date) {
  return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
}

// Verificar si una fecha es la misma que otra fecha (sin considerar la hora)
function isSameDate (date1, date2) {
  return dayjs(date1).startOf('day')
    .isSame(dayjs(date2).startOf('day'))
}

// Función para verificar si una fecha está entre dos fechas dadas (sin considerar la hora)
function isBetweenDates (date, startDate, endDate) {
  const d = dayjs(date).startOf('day')
  const start = dayjs(startDate).startOf('day')
  const end = dayjs(endDate).endOf('day')

  return d.isBetween(start, end, null, '[]')
}

export { parseDate, isSameDate, isBetweenDates }
