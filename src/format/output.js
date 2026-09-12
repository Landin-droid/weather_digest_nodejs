export function formatCityReport(report) {
  const lines = [];

  lines.push(
    `\n🚩 ${report.city}, ${report.country} (${report.latitude}, ${report.longitude})`,
  );
  if (report.fromCache) {
    lines.push("   (данные из кэша)");
  }

  lines.push("   Дата         Мин, °C   Макс, °C   Осадки, мм");
  for (const day of report.days) {
    lines.push(
      `   ${day.date}   ${padNumber(day.tempMin)}       ${padNumber(day.tempMax)}       ${padNumber(day.precipitation)}`,
    );
  }

  return lines.join("\n");
}

export function formatCityError(city, error) {
  return `❗ Ошибка при обработке города "${city}": ${error.message}`;
}

function padNumber(value) {
  return String(value).padStart(5, " ");
}
