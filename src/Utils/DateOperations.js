import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

function parseDate (date) {
  return dayjs(date).format('YYYY/MM/DD')
}

function isBetweenDates (date, startDate, endDate) {
  const d = dayjs(date)
  return d.isAfter(dayjs(startDate)) && d.isBefore(dayjs(endDate))
}

export { parseDate, isBetweenDates }
