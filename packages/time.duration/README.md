# @wjminis/time.duration

![NPM Version](https://img.shields.io/npm/v/%40wjminis/time.duration?color=444&label=&logo=npm)


A micro-DSL for time durations in JavaScript.

## Install

It only takes `` duration`1 moment` ``\*!

```sh
pnpm add @wjminis/time.duration
```

<sup>\* `moment` is not a valid <a href="#supported-units">unit specifier</a></sup>

## Usage

Simply type what you want in plain and simple English.

```js
import { duration } from "@wjminis/time.duration";

// 3_600_000
duration`1hr`;

//  5_400_000
duration`1hr 30min`;

// 5_400_000
duration`1hr and 30mins`;

// 31_795_200_017
duration`1yr, 3d, 17ms`;

// 16.66...
duration`${1 / 60}s`;

// 1
duration`${1}f`;
```

### Syntax

The syntax for time.duration is incredibly simple. Either interpolate a number,
or write a number in the template string, followed by a
[unit specifier](#supported-units). You may insert `and`, `plus`, `&`, `+`, and
`,` anywhere you like. Spaces are optional between numbers and specifiers, but
are required between specifiers and `and` or `plus`.

```js
// these are all identical
duration`1y7M2w4d19h47m16s2f`;
duration`1 y 7 M 2 w 4 d 19 h 47 m 16 s 2 f`;
duration`1 year, 7 months, 2 weeks, 4 days, 19 hours, 47 minutes, 16 seconds, and 2 milliseconds`;
duration`1y7M2w4d19h47m16s2f and and and and and and and`; // `and` - it's pretty much a comment
```

### Supported Units

For the greatest freedom of expression, time.duration supports 9 time units with 74 aliases.

- Milliseconds - `f`
  - `frac` `fracs` `fraction` `fractions` `ms` `mil` `mils` `milli` `millis` `millisecond` `milliseconds`
  - The four aliases with double `l` can also be entered with only one `l`. eg: `milis`, `milisecond`
- Seconds - `s`
  - `sec` `secs` `second` `seconds`
- Minutes - `m`
  - `min` `mins` `minute` `minutes`
- Hours - `h`
  - `hr` `hrs` `hour` `hours`
- Days - `d`
  - `day` `days`
- Weeks - `w`
  - `wk` `wks` `week` `weeks`
- Months (30 days) - `M`
  - `mo` `mos` `month` `months`
- Years (365 days) - `y`
  - `yr` `yrs` `year` `years`
- Leap Years Accounted (365.2425 days) - `Y`
  - any of the "Years" alternative specifiers, preceeded by either `x`, `ex`, or `exact`. Spaces between permitted.
    eg: `xyr`, `x years`, `exyrs`, `ex years`, `exact years`, etc.

## License

`@wjminis/time.duration` is free and open-source software licensed under the
[GPL-3.0 License](./LICENSE).
