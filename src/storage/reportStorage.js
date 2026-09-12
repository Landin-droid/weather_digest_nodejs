import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const REPORTS_DIR = process.env.REPORTS_DIR ?? "reports";

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function reportFileName(city) {
  const safeCity = city.replace(/[\\/:*?"<>|]/g, "_");
  return `${safeCity}-${todayDateString()}.json`;
}

function reportFilePath(city) {
  return path.join(REPORTS_DIR, reportFileName(city));
}

export async function readCachedReport(city) {
  const filePath = reportFilePath(city);
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function saveReport(city, data) {
  await mkdir(REPORTS_DIR, { recursive: true });
  const filePath = reportFilePath(city);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return filePath;
}
