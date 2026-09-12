import { test } from "node:test";
import assert from "node:assert/strict";
import { geocodeCity, CityNotFoundError } from "../api/geocoding.js";

test("geocodeCity выбрасывает CityNotFoundError, если results пустой", async (t) => {
  t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => ({ results: [] }),
  }));

  await assert.rejects(
    () => geocodeCity("Несуществующийгород"),
    CityNotFoundError,
  );
});

test("geocodeCity выбрасывает ошибку при статусе 404", async (t) => {
  t.mock.method(globalThis, "fetch", async () => ({
    ok: false,
    status: 404,
  }));

  await assert.rejects(() => geocodeCity("Хельсинки"));
});
