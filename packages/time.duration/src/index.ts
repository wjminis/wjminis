const baseUnits = {
  f: (qty: number) => qty * 1,
  s: (qty: number) => baseUnits.f(qty) * 1000,
  m: (qty: number) => baseUnits.s(qty) * 60,
  h: (qty: number) => baseUnits.m(qty) * 60,
  d: (qty: number) => baseUnits.h(qty) * 24,
  w: (qty: number) => baseUnits.d(qty) * 7,
  M: (qty: number) => baseUnits.d(qty) * 30,
  y: (qty: number) => baseUnits.d(qty) * 365,
  Y: (qty: number) => baseUnits.d(qty) * 365.2425,
};

const aliases = {
  // fractions
  frac: baseUnits.f,
  fracs: baseUnits.f,
  fraction: baseUnits.f,
  fractions: baseUnits.f,
  ms: baseUnits.f,
  mil: baseUnits.f,
  mils: baseUnits.f,
  mili: baseUnits.f,
  milis: baseUnits.f,
  milli: baseUnits.f,
  millis: baseUnits.f,
  milisecond: baseUnits.f,
  miliseconds: baseUnits.f,
  millisecond: baseUnits.f,
  milliseconds: baseUnits.f,
  // seconds
  sec: baseUnits.s,
  secs: baseUnits.s,
  second: baseUnits.s,
  seconds: baseUnits.s,
  // minutes
  min: baseUnits.m,
  mins: baseUnits.m,
  minute: baseUnits.m,
  minutes: baseUnits.m,
  // hours
  hr: baseUnits.h,
  hrs: baseUnits.h,
  hour: baseUnits.h,
  hours: baseUnits.h,
  // days
  day: baseUnits.d,
  days: baseUnits.d,
  // weeks
  wk: baseUnits.w,
  wks: baseUnits.w,
  week: baseUnits.w,
  weeks: baseUnits.w,
  // months
  mo: baseUnits.M,
  mos: baseUnits.M,
  month: baseUnits.M,
  months: baseUnits.M,
  // years
  yr: baseUnits.y,
  yrs: baseUnits.y,
  year: baseUnits.y,
  years: baseUnits.y,
  // exact years
  ...Object.fromEntries(
    ["yr", "yrs", "year", "years"]
      .flatMap((key) => [
        `x${key}`,
        `x ${key}`,
        `ex${key}`,
        `ex ${key}`,
        `exact${key}`,
        `exact ${key}`,
      ])
      .map((key) => [key, baseUnits.Y]),
  ),
};

type Unit = keyof typeof baseUnits | keyof typeof aliases;

const units = ([...Object.keys(baseUnits), ...Object.keys(aliases)] as Unit[]).sort(
  (a, b) => b.length - a.length,
);

const numberLit = /^[\d_]+\.?[\d_]*$/g;

function tokenize(content: string) {
  const tokens: (Unit | number)[] = [];

  const chars = content.split("");
  mainloop: while (chars.length) {
    let idx = -1;
    while (
      chars
        .slice(0, idx + 2)
        .join("")
        .match(numberLit)
    )
      idx++;
    if (idx >= 0) {
      const num = chars.splice(0, idx + 1).join("");
      tokens.push(Number(num.replace("_", "")));
      continue;
    }

    if (chars[0] === "+" || chars[0] === "&" || chars[0] === ",") {
      chars.shift();
      continue;
    }
    if (chars.slice(0, 3).join("") === "and") {
      chars.splice(0, 3);
      continue;
    }
    if (chars.slice(0, 4).join("") === "plus") {
      chars.splice(0, 4);
      continue;
    }

    for (const keyword of units) {
      if (chars.slice(0, keyword.length).join("") === keyword) {
        if (chars[keyword.length]?.match(/[a-zA-Z]/)) {
          let length = keyword.length;
          while (chars[length]?.match(/[a-zA-Z]/)) length++;
          const token = chars.splice(0, length).join("");
          throw new Error(`Invalid token \`${token}\``);
        }
        tokens.push(keyword);
        chars.splice(0, keyword.length);
        continue mainloop;
      }
    }

    chars.shift();
  }
  return tokens;
}

function parse(content: (string | number)[]) {
  const result: (Unit | number)[] = [];
  for (const item of content) {
    if (typeof item === "number") result.push(item);
    else if (typeof item === "string") result.push(...tokenize(item));
  }
  return result;
}

function repr(segments: string[], ...substitutions: number[]) {
  const source = ["duration`"];
  for (let i = 0; i < segments.length; i++) {
    source.push(segments[i]);
    if (substitutions[i]) source.push(`\${${substitutions[i]}}`);
  }
  source.push("`");
  return source.join("");
}

export function duration(segments: TemplateStringsArray, ...substitutions: number[]) {
  try {
    const params = parse(
      substitutions.reduce((acc, sub, i) => [...acc, sub, segments[i + 1]], [segments[0]] as (
        | string
        | number
      )[]) || [],
    );

    let total = 0;

    for (let i = 0; i < params.length; ) {
      const expectNumber = params[i++];
      if (typeof expectNumber !== "number")
        throw new Error(`Expected number, got \`${expectNumber}\``);

      const expectUnit = params[i++];
      if (!units.includes(expectUnit as Unit))
        throw new Error(`Expected unit, got \`${expectUnit}\``);

      const unitFn =
        aliases[expectUnit as keyof typeof aliases] ??
        baseUnits[expectUnit as keyof typeof baseUnits];

      total += unitFn(expectNumber);
    }

    return total;
  } catch (err) {
    const source = repr([...segments], ...substitutions);
    if (!(err instanceof Error)) throw new Error(`time.duration: ${err}\n${source}`);
    err.message = `time.duration: ParserError: ${err.message}\n${source}`;
    throw err;
  }
}
