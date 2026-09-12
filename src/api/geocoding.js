import { fetchJson } from "./httpClient.js";

const BASE_URL =
  process.env.GEOCODING_BASE_URL ??
  "https://geocoding-api.open-meteo.com/v1/search";

export class CityNotFoundError extends Error {
  constructor(city) {
    super(`Город не найден: ${city}`);
    this.name = "CityNotFoundError";
  }
}

export async function geocodeCity(city) {
  const url = new URL(BASE_URL);
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "ru");
  url.searchParams.set("format", "json");

  const data = await fetchJson(url);

  if (!data.results || data.results.length === 0) {
    throw new CityNotFoundError(city);
  }

  const [result] = data.results;
  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}
