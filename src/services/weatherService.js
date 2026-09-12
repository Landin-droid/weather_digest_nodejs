import { geocodeCity } from "../api/geocoding.js";
import { getForecast } from "../api/forecast.js";

export async function getCityWeather(city, days) {
  const location = await geocodeCity(city);
  const forecast = await getForecast({ ...location, days });

  return {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    days: forecast,
  };
}
