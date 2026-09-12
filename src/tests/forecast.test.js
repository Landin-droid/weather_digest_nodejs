import { test } from "node:test";
import assert from "node:assert/strict";
import { getForecast } from "../api/forecast.js";

test("getForecast корректно разбирает ответ API в массив по дням", async t => {
  const mockResponse = {
    daily: {
      time: ["2026-09-13", "2026-09-14"],
      temperature_2m_max: [20.5, 22.1],
      temperature_2m_min: [12.0, 13.5],
      precipitation_sum: [0, 1.2],
    },
  };

  t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => mockResponse,
  }));

  const result = await getForecast({
    latitude: 60.17,
    longitude: 24.94,
    days: 2,
  });

  assert.equal(result.length, 2);
  assert.deepEqual(result[0], {
    date: "2026-09-13",
    tempMax: 20.5,
    tempMin: 12.0,
    precipitation: 0,
  });
});
