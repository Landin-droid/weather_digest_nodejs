import { parseArgs } from "node:util";
import { getCityWeather } from "./services/weatherService.js";
import { formatCityReport, formatCityError } from "./format/output.js";

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      city: { type: "string" },
      days: { type: "string" },
      "no-cache": { type: "boolean", default: false },
    },
  });

  const rawCity = values.city ?? process.env.CITY;
  const rawDays = values.days ?? process.env.DAYS ?? "3";
  const noCache = values["no-cache"] || process.env.NO_CACHE === "true";

  if (!rawCity || rawCity.trim() === "") {
    throw new Error(
      'Параметр --city обязателен (или переменная окружения CITY). Пример: --city "Томск, Москва"',
    );
  }

  const days = Number(rawDays);
  if (!Number.isInteger(days) || days < 1 || days > 7) {
    throw new Error(`Параметр --days должен быть целым числом от 1 до 7 включительно (получено: ${rawDays})`);
  }

  const cities = rawCity
    .split(",")
    .map(c => c.trim())
    .filter(c => c.length > 0);

  return { cities, days, noCache };
}

async function main() {
  let args;
  try {
    args = parseCliArgs();
  } catch (err) {
    console.error(`Ошибка аргументов: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const { cities, days, noCache } = args;

  const results = await Promise.allSettled(
    cities.map(city => getCityWeather(city, days, { noCache })),
  );

  let hasErrors = false;

  results.forEach((result, i) => {
    const city = cities[i];
    if (result.status === "fulfilled") {
      console.log(formatCityReport(result.value));
    } else {
      hasErrors = true;
      console.error(formatCityError(city, result.reason));
    }
  });

  process.exitCode = hasErrors ? 1 : 0;
}

main().catch(err => {
  console.error(`Непредвиденная ошибка: ${err.message}`);
  process.exitCode = 1;
});

process.on("unhandledRejection", reason => {
  console.error(
    `Необработанная ошибка промиса: ${reason instanceof Error ? reason.message : reason}`,
  );
  process.exitCode = 1;
});
