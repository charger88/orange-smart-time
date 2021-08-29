/* eslint-disable no-undef */

const OrangeSmartTime = require('./../src/orange-smart-time.js')

test('timespans', () => {
  const ost = new OrangeSmartTime()
  expect(ost.convertTimespan(5)).toBe('5 seconds')
  expect(ost.convertTimespan(45)).toBe('45 seconds')
  expect(ost.convertTimespan(60)).toBe('1 minute')
  expect(ost.convertTimespan(65)).toBe('1 minute')
  expect(ost.convertTimespan(120)).toBe('2 minutes')
  expect(ost.convertTimespan(3650)).toBe('1 hour')
  expect(ost.convertTimespan(7200)).toBe('2 hours')
  expect(ost.convertTimespan(86400)).toBe('1 day')
  expect(ost.convertTimespan(86400 * 5)).toBe('5 days')
  expect(ost.convertTimespan(86400 * 365 * 10.5)).toBe('10 years')
})

test('timestamp', () => {
  const now = Math.floor(Date.now() / 1000)
  const ost = new OrangeSmartTime()
  ost.now = now
  expect(ost.convertTimestamp(now + 5)).toBe('Right now')
  expect(ost.convertTimestamp(now - 45)).toBe('45 seconds ago')
  expect(ost.convertTimestamp(now - 65)).toBe('1 minute ago')
  expect(ost.convertTimestamp(now - 7200)).toBe('2 hours ago')
  expect(ost.convertTimestamp(now - 86400)).toBe('1 day ago')
  expect(ost.convertTimestamp(now - 86400 * 5)).toBe('5 days ago')
  expect(ost.convertTimestamp(now + 45)).toBe('45 seconds later')
  expect(ost.convertTimestamp(now + 65)).toBe('1 minute later')
  expect(ost.convertTimestamp(now + 7200)).toBe('2 hours later')
  expect(ost.convertTimestamp(now + 86400)).toBe('1 day later')
  expect(ost.convertTimestamp(now + 86400 * 5)).toBe('5 days later')
})

test('timestamp-timespans', () => {
  const nowMs = Date.parse('2021-06-15 16:00:00')
  const ost = new OrangeSmartTime()
  ost.nowMs = nowMs
  ost.lastTexts = true
  ost.nextTexts = true
  expect(ost.convertTimestampMs(Date.parse('2020-01-01 23:59:00'))).toBe('Last year')
  expect(ost.convertTimestampMs(Date.parse('2020-12-31 23:59:00'))).toBe('Last year')
  expect(ost.convertTimestampMs(Date.parse('2021-05-01 00:00:00'))).toBe('Last month')
  expect(ost.convertTimestampMs(Date.parse('2021-05-31 23:59:00'))).toBe('Last month')
  expect(ost.convertTimestampMs(Date.parse('2021-06-13 23:59:00'))).toBe('1 day ago')
  expect(ost.convertTimestampMs(Date.parse('2021-06-14 01:00:00'))).toBe('Yesterday')
  expect(ost.convertTimestampMs(Date.parse('2021-06-14 23:00:00'))).toBe('Yesterday')
  expect(ost.convertTimestampMs(Date.parse('2021-06-15 00:00:00'))).toBe('Today')
  expect(ost.convertTimestampMs(Date.parse('2021-06-15 15:00:00'))).toBe('1 hour ago')
  expect(ost.convertTimestampMs(Date.parse('2021-06-15 23:59:59'))).toBe('Today')
  expect(ost.convertTimestampMs(Date.parse('2021-06-16 01:00:00'))).toBe('Tomorrow')
  expect(ost.convertTimestampMs(Date.parse('2021-06-16 23:00:00'))).toBe('Tomorrow')
  expect(ost.convertTimestampMs(Date.parse('2021-06-17 23:59:00'))).toBe('2 days later')
  expect(ost.convertTimestampMs(Date.parse('2021-07-01 00:00:00'))).toBe('Next month')
  expect(ost.convertTimestampMs(Date.parse('2021-07-31 23:59:00'))).toBe('Next month')
  expect(ost.convertTimestampMs(Date.parse('2022-01-01 00:00:00'))).toBe('Next year')
  expect(ost.convertTimestampMs(Date.parse('2022-12-31 23:59:00'))).toBe('Next year')
})

test('timestamp weeks', () => {
  const now = Math.floor(Date.now() / 1000)
  const ost = new OrangeSmartTime()
  ost.now = now
  expect(ost.convertTimestamp(now - 86400 * 5)).toBe('5 days ago')
  expect(ost.convertTimestamp(now - 86400 * 10)).toBe('1 week ago')
  expect(ost.convertTimestamp(now - 86400 * 15)).toBe('2 weeks ago')
  expect(ost.convertTimestamp(now - 86400 * 32)).toBe('4 weeks ago')
  expect(ost.convertTimestamp(now - 86400 * 61)).toBe('2 months ago')
  ost.weeks = 0
  expect(ost.convertTimestamp(now - 86400 * 5)).toBe('5 days ago')
  expect(ost.convertTimestamp(now - 86400 * 10)).toBe('10 days ago')
  expect(ost.convertTimestamp(now - 86400 * 15)).toBe('15 days ago')
  expect(ost.convertTimestamp(now - 86400 * 32)).toBe('1 month ago')
  expect(ost.convertTimestamp(now - 86400 * 61)).toBe('2 months ago')
})

test('translation', () => {
  const ru = require('./../languages/ru')
  const ost = new OrangeSmartTime(ru)
  expect(ost.convertTimespan(1)).toBe('1 секунда')
  expect(ost.convertTimespan(2)).toBe('2 секунды')
  expect(ost.convertTimespan(3)).toBe('3 секунды')
  expect(ost.convertTimespan(4)).toBe('4 секунды')
  expect(ost.convertTimespan(14)).toBe('14 секунд')
  expect(ost.convertTimespan(24)).toBe('24 секунды')
  expect(ost.convertTimespan(60)).toBe('1 минута')
  expect(ost.convertTimespan(120)).toBe('2 минуты')
  expect(ost.convertTimespan(3650)).toBe('1 час')
  expect(ost.convertTimespan(7200)).toBe('2 часа')
  expect(ost.convertTimespan(86400)).toBe('1 день')
  expect(ost.convertTimespan(86400 * 365 * 10.5)).toBe('10 лет')
  const now = Math.floor(Date.now() / 1000)
  ost.now = now
  expect(ost.convertTimestamp(now + 86400 * 365 * 10.5)).toBe('Через 10 лет')
  expect(ost.convertTimestamp(now - 86400 * 365 * 10.5)).toBe('10 лет назад')
})
