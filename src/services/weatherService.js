import { geocodeCity } from "../api/geocoding.js";
import { getForecast } from "../api/forecast.js";
import { readCachedReport, saveReport } from "../storage/reportStorage.js";

export async function getCityWeather(city, days, { noCache = false } = {}) {
  if (!noCache) {
    const cached = await readCachedReport(city);
    if (cached && cached.days.length >= days) {
      return { ...cached, days: cached.days.slice(0, days), fromCache: true };
    }
  }

  const location = await geocodeCity(city);
  const forecast = await getForecast({ ...location, days });

  const report = {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    days: forecast,
  };

  await saveReport(location.name, report);

  return { ...report, fromCache: false };
}
