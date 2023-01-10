import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

export function addDate(numberOfDaysToAdd = 3, today = new Date()) {
  return dayjs(today).add(numberOfDaysToAdd, 'day').$d
}

export function subtractDate(numberOfDaysToSubtract = 3, today = new Date()) {
  return today.setDate(today.getDate() - numberOfDaysToSubtract)
}

export function addHour(numberOfHoursToAdd = 2, today = new Date()) {
  return today.setTime(today.getTime() + (numberOfHoursToAdd * 60 * 60 * 1000))
}

export function addMinute(numberOfMinutesToAdd = 2, today = new Date()) {
  return today.setTime(today.getTime() + (numberOfMinutesToAdd * 60 * 1000))
}

export function formatDate(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10)
}

export function isExpired(expiredDate, today = new Date()) {
  if (expiredDate < today) return true
  return false
}

export function getDefferentDate(endDate = new Date(), startDate = new Date()) {
  const startDateDayjs = dayjs(startDate || new Date())
  const endDateDayjs = dayjs(endDate || new Date())

  const hours = endDateDayjs.diff(startDateDayjs, 'hours')
  return Math.floor(hours / 24)
}

export const getDate = ({ date = new Date(), separator = '.' }) => {
  if (!date) return '-'
  return dayjs(date).format(`DD${separator}MM${separator}YYYY`)
}

export const getDifferentSecond = (start, end) => {
  const timeStart = dayjs(start)
  return `${timeStart.diff(end, 's')} Seconds`
}

export function formatDayjs(date, format = 'YYYY-MM-DD') {
  if (date === null || date === undefined) return null
  const result = dayjs(date).format(format)
  if (result === 'Invalid Date') return null
  return result
}
