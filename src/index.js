import { parseArgs } from "node:util";
import { getCityWeather } from "./services/weatherService.js";

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      city: { type: "string" },
      days: { type: "string", default: "3" },
      "no-cache": { type: "boolean", default: false },
    },
  });

  if (!values.city || values.city.trim() === "") {
    throw new Error(
      'Параметр --city обязателен. Пример: --city "Хельсинки,Москва"',
    );
  }

  const days = Number(values.days);
  if (!Number.isInteger(days) || days < 1 || days > 7) {
    throw new Error(
      `Параметр --days должен быть целым числом от 1 до 7 (получено: ${values.days})`,
    );
  }

  const cities = values.city
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  return { cities, days, noCache: values["no-cache"] };
}

async function main() {
  let args;
  try {
    args = parseCliArgs();
  } catch (err) {
    console.error(`Ошибка аргументов: ${err.message}`);
    process.exit(1);
  }

  const { cities, days } = args;

  const results = await Promise.allSettled(
    cities.map((city) => getCityWeather(city, days)),
  );

  let hasErrors = false;

  results.forEach((result, i) => {
    const city = cities[i];
    if (result.status === "fulfilled") {
      console.log(JSON.stringify(result.value, null, 2)); // временный вывод — заменим на шаге 6
    } else {
      hasErrors = true;
      console.error(
        `Ошибка при обработке города "${city}": ${result.reason.message}`,
      );
    }
  });

  process.exit(hasErrors ? 1 : 0);
}

main();
