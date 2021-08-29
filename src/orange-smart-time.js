const REQUIRED_ENGLISH_TEXTS = require('./../languages/en-basic.json')
const EXTENDED_ENGLISH_TEXTS = require('./../languages/en-extended.json')

/**
 * Class for converting timestamps into text like "2 hours ago", "Yesterday", etc.
 */
class OrangeSmartTime {
  /**
   *
   * @param {?object} texts Object with translation (by default English is being used)
   * @param {boolean} timespansRoundLogic Flag if class should use "round" login instead of "floor" logic for converting numbers for timespans like "2 hours ago" into integers
   */
  constructor (texts = null, timespansRoundLogic = false) {
    this.nowMs = null
    this.stringNowSecondsLimit = 5
    this.weeks = 5
    this.lastNextTextMinDelta = 7200
    this.lastTexts = false
    this.nextTexts = false
    this.lastNextToIntegerFunction = timespansRoundLogic ? v => Math.round(v) : v => Math.floor(v)
    this._texts = Object.assign({}, REQUIRED_ENGLISH_TEXTS, texts || EXTENDED_ENGLISH_TEXTS)
  }

  /**
   * Current timestamp in seconds (overrides current timestamp with static value). Affects `nowMs` property too.
   * @return {?number}
   */
  get now () {
    return Math.floor(this.nowMs / 1000)
  }

  /**
   * Current timestamp in seconds (overrides current timestamp with static value). Affects `nowMs` property too.
   * @param {?number} timestamp
   */
  set now (timestamp) {
    this._now = timestamp * 1000
  }

  /**
   * Current timestamp in milliseconds (overrides current timestamp with static value). Affects `nowMs` property too.
   * @return {number}
   */
  get nowMs () {
    return this._now || Date.now()
  }

  /**
   * Current timestamp in milliseconds (overrides current timestamp with static value). Affects `nowMs` property too.
   * @param {?number} timestampMs
   */
  set nowMs (timestampMs) {
    this._now = timestampMs
  }

  /**
   * Number of weeks when phrase like "N weeks ago" will have priority over "N months ago"
   * @return {number}
   */
  get weeks () {
    return this._weeks
  }

  /**
   * Number of weeks when phrase like "N weeks ago" will have priority over "N months ago"
   * @param {number} n
   */
  set weeks (n) {
    this._weeks = n
  }

  /**
   * Allow date-based texts like "last year", "yesterday", etc. for the past
   * @return {boolean}
   */
  get lastTexts () {
    return this._lastTexts
  }

  /**
   * Allow date-based texts like "last year", "yesterday", etc. for the past
   * @param {boolean} v
   */
  set lastTexts (v) {
    this._lastTexts = v
  }

  /**
   * Allow date-based texts like "next year", "tomorrow", etc. for the future
   * @return {boolean}
   */
  get nextTexts () {
    return this._nextTexts
  }

  /**
   * Allow date-based texts like "next year", "tomorrow", etc. for the future
   * @param {boolean} v
   */
  set nextTexts (v) {
    this._nextTexts = v
  }

  /**
   * Minimal delta (in seconds) for showing "last ..."-type of texts
   * @return {number}
   */
  get lastNextTextMinDelta () {
    return this._lastNextTextMinDelta
  }

  /**
   * Minimal delta (in seconds) for showing "last ..."-type of texts
   * @param {number} seconds
   */
  set lastNextTextMinDelta (seconds) {
    this._lastNextTextMinDelta = seconds
  }

  /**
   * Function which is being used to calculate integer number of time timespans (hours, days, months, etc.) based on delta
   * @return {function}
   */
  get lastNextToIntegerFunction () {
    return this._lastNextToIntegerFunction
  }

  /**
   * Function which is being used to calculate integer number of time timespans (hours, days, months, etc.) based on delta
   * @param {function} v
   */
  set lastNextToIntegerFunction (v) {
    this._lastNextToIntegerFunction = v
  }

  /**
   * Number of seconds identified as "now"
   * @return {number}
   */
  get stringNowSecondsLimit () {
    return this._stringNowSecondsLimit
  }

  /**
   * Number of seconds identified as "now"
   * @param {number} seconds
   */
  set stringNowSecondsLimit (seconds) {
    this._stringNowSecondsLimit = seconds
  }

  /**
   * Returns text for time timespan names based on number (like "hour" for 1 and "hours" for 2)
   *
   * @param {number} number
   * @param {string} name
   * @return {string}
   * @private
   */
  _getTextForNumber (number, name) {
    return this._texts[`${name}:${number}`] || this._texts[`${name}%${number % 100}`] || this._texts[`${name}%${number % 10}`] || this._texts[name]
  }

  /**
   * Generates string like "2 hours ago" from number or days|weeks|months|etc. and past/undefined/future argument
   *
   * @param {number} number
   * @param {string} name
   * @param {?boolean} isPast
   * @return {string}
   * @private
   */
  _getTimeString (number, name, isPast) {
    return (isPast === null ? this._texts.timespan_pattern : (isPast ? this._texts.ago_pattern : this._texts.later_pattern))
      .replace('{number}', number)
      .replace('{name}', this._getTextForNumber(number, name))
  }

  /**
   * Returns date-based texts
   *
   * @todo Add support of "last week", "next week"
   * @param {number} timestampMs
   * @param {boolean} isPast
   * @return {?string}
   * @private
   */
  _getLastNextTextString (timestampMs, isPast) {
    let tD, d
    if (Math.abs(timestampMs - this.nowMs) / 1000 < this.lastNextTextMinDelta) {
      return null
    }
    if (this.lastTexts && isPast) {
      tD = new Date(timestampMs)
      d = new Date(this.nowMs)
      if ((d.getDate() === tD.getDate()) && (d.getMonth() === tD.getMonth()) && (d.getFullYear() === tD.getFullYear())) {
        return this._texts.today
      }
      d.setDate(d.getDate() - 1)
      if ((d.getDate() === tD.getDate()) && (d.getMonth() === tD.getMonth()) && (d.getFullYear() === tD.getFullYear())) {
        return this._texts.last_day
      }
      d = new Date(this.nowMs)
      d.setMonth(d.getMonth() - 1)
      if ((d.getMonth() === tD.getMonth()) && (d.getFullYear() === tD.getFullYear())) {
        return this._texts.last_month
      }
      d = new Date(this.nowMs)
      d.setFullYear(d.getFullYear() - 1)
      if (d.getFullYear() === tD.getFullYear()) {
        return this._texts.last_year
      }
    } else if (this.nextTexts && !isPast) {
      tD = new Date(timestampMs)
      d = new Date(this.nowMs)
      if ((d.getDate() === tD.getDate()) && (d.getMonth() === tD.getMonth()) && (d.getFullYear() === tD.getFullYear())) {
        return this._texts.today
      }
      d.setDate(d.getDate() + 1)
      if ((d.getDate() === tD.getDate()) && (d.getMonth() === tD.getMonth()) && (d.getFullYear() === tD.getFullYear())) {
        return this._texts.next_day
      }
      d = new Date(this.nowMs)
      d.setMonth(d.getMonth() + 1)
      if ((d.getMonth() === tD.getMonth()) && (d.getFullYear() === tD.getFullYear())) {
        return this._texts.next_month
      }
      d = new Date(this.nowMs)
      d.setFullYear(d.getFullYear() + 1)
      if (d.getFullYear() === tD.getFullYear()) {
        return this._texts.next_year
      }
    }
    return null
  }

  /**
   * Formats number of milliseconds into text
   *
   * @param {number} milliseconds
   * @param {?boolean} isPast
   * @return {string}
   * @private
   */
  _format (milliseconds, isPast) {
    const sDiff = Math.floor(milliseconds / 1000)
    if (sDiff < 60) {
      return this._getTimeString(sDiff, 'seconds', isPast)
    }
    const iDiff = Math.floor(sDiff / 60)
    if (iDiff < 60) {
      return this._getTimeString(iDiff, 'minutes', isPast)
    }
    const hDiff = Math.floor(iDiff / 60)
    if (hDiff < 24) {
      return this._getTimeString(hDiff, 'hours', isPast)
    }
    const dDiff = Math.floor(hDiff / 24)
    if (this.weeks && (dDiff >= 7) && (dDiff <= this.weeks * 7)) {
      return this._getTimeString(Math.floor(dDiff / 7), 'weeks', isPast)
    }
    if (dDiff < 31) {
      return this._getTimeString(dDiff, 'days', isPast)
    }
    const mDiff = Math.floor(dDiff / 30) // It is ~
    if (mDiff < 12) {
      return this._getTimeString(mDiff, 'months', isPast)
    }
    const yDiff = Math.floor(dDiff / 365) // It is ~
    return this._getTimeString(yDiff, 'years', isPast)
  }

  /**
   * Converts timestamp (seconds) into text in relation to the current moment.
   *
   * @param timestamp Timestamp like 1629935777
   * @return {string}
   */
  convertTimestamp (timestamp) {
    return this.convertTimestampMs(timestamp * 1000)
  }

  /**
   * Converts timestamp (milliseconds) into text in relation to the current moment.
   *
   * @param {number} timestampMs Timestamp like 1629935777000
   * @return {string}
   */
  convertTimestampMs (timestampMs) {
    const msDelta = Math.abs(this.nowMs - timestampMs)
    const sDelta = msDelta / 1000
    const isPast = this.nowMs > timestampMs
    if (sDelta <= this.stringNowSecondsLimit) {
      return this._texts.now
    }
    const lastNextTimespan = this._getLastNextTextString(timestampMs, isPast)
    if (lastNextTimespan !== null) {
      return lastNextTimespan
    }
    return this._format(msDelta, isPast)
  }

  /**
   * Converts timespan (in seconds) into text
   *
   * @param {number} seconds Number of seconds like "300" (it will be converted into "5 minutes")
   * @return {string}
   */
  convertTimespan (seconds) {
    return this.convertTimespanMs(seconds * 1000)
  }

  /**
   * Converts timespan (in milliseconds) into text
   *
   * @param {number} milliseconds Number of milliseconds like "300000" (it will be converted into "5 minutes")
   * @return {string}
   */
  convertTimespanMs (milliseconds) {
    return this._format(milliseconds, null)
  }
}

module.exports = OrangeSmartTime
