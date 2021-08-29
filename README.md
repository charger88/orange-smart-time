# Orange Smart Time

Library for converting timestamps into texts like "2 hours ago", "Yesterday", etc.

## OrangeSmartTime class

### Methods

#### Constructor

| Argument | Type | Default | Description |
|---|---|---|---|
| `texts` | object, null | `null` | Object with translation (by default English is being used) |
| `timespansRoundLogic` | boolean | `false` | Flag if class should use "round" login instead of "floor" logic for converting numbers for timespans like "2 hours ago" into integers |

#### `convertTimestamp`

Converts timestamp (seconds) into text in relation to the current moment.

| Argument | Type | Default | Description |
|---|---|---|---|
| `timestamp` | number | | Timestamp like `1629935777` |

#### `convertTimestampMs`

Converts timestamp (milliseconds) into text in relation to the current moment.

| Argument | Type | Default | Description |
|---|---|---|---|
| `timestampMs` | number | | Timestamp like `1629935777000` |

#### `convertTimespan`

Converts timespan (in seconds) into text

| Argument | Type | Default | Description |
|---|---|---|---|
| `seconds` | number | | Number of seconds like `300` (it will be converted to `5 minutes`) |

#### `convertTimespanMs`

Converts timespan (in milliseconds) into text

| Argument | Type | Default | Description |
|---|---|---|---|
| `milliseconds` | number | | Number of milliseconds like `300000` (it will be converted to `5 minutes`) |

### Properties

You can set properties to modify behavior of the library.

| Property | Type | Default | Description |
|---|---|---|---|
| `now` | number | current timestamp | Current timestamp in seconds (overrides current timestamp with static value). Affects `nowMs` property too. |
| `nowMs` | number | current timestamp | Current timestamp in milliseconds (overrides current timestamp with static value). Affects `now` property too. |
| `weeks` | number | `5` | Number of weeks when phrase like "N weeks ago" will have priority over "N months ago". For example something happened 35 days ago. If this property is >= 5 it will be converted into "5 weeks ago", in other case it will be "1 month ago" |
| `lastTexts` | boolean | `false` | Allow date-based texts like "last year", "yesterday", etc. for the past |
| `nextTexts` | boolean | `false` | Allow date-based texts like "next year", "tomorrow", etc. for the future |
| `lastNextTextMinDelta` | number | `7200` | Minimal delta (in seconds) for showing "last ..."-type of texts |
| `lastNextToIntegerFunction` | function | `v => Math.round(v)` or `v => Math.floor(v)` | Function which is being used to calculate integer number of time timespans (hours, days, months, etc.) based on delta |
| `stringNowSecondsLimit` | number | `5` | Maximal number of seconds identified as "now" |

## Example

```javascript
const OrangeSmartTime = require('orange-smart-time')
const ost = new OrangeSmartTime()
const timestamp = ost.now - 10 // Obviously you don't need to calculate it like that, because you already have timestamp you want to convert
const text = ost.convertTimestamp(timestamp)
console.log(text) // Prints "10 seconds ago" 
```

## Translations

You can provide translations object in the first argument of the class constructor.

### Available translations

* Russian: `languages/ru.json`

### Create your own

If you want to create your own translation, use file `languages/en-basic.json` as example. It contains all required keys for generating texts. Besides, your language may require more customization - look at `languages/en-extended.json`.

For example:

* To define spelling for specific number (1) or hours - define key `hours:1`: `"hours:1": "hour"`
* To define spelling for numbers ending with some number (2) use `hours%2` (works for 0-99 range). For example in Russian translation we have this: `"hours%2": "часа"`

## To do

* Add support of "last week" and "next week" texts