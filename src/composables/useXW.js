import { apiPost, apiPut, apiGet } from "@/composables/useApi.js";
import { STORAGE_KEYS, readJson, writeJson } from "@/utils/storage";
import { resolveUsername } from "@/utils/user";

export async function addCrosswordToDB(payload) {
	return apiPost("/api/crosswords/new", payload);
}

export async function addSolve(timeInMs, releaseDate) {
	const username = resolveUsername();
	if (!username || !releaseDate) return;

	const time = Math.round(Number(timeInMs) / 1000);
	if (!Number.isFinite(time)) return;

	// Server expects whole seconds to rank solvers; keep rounding consistent.
	return apiPost("/api/crosswords/solve", { username, time, releaseDate });
}

export async function syncLocalSolves() {
	const entries = readJson(STORAGE_KEYS.solves, []);
	if (!Array.isArray(entries) || !entries.length) return;

	const unsynced = [];
	for (const entry of entries) {
		const { releaseDate, timeMs } = entry ?? {};
		if (!releaseDate || timeMs == null) continue;
		try {
			await addSolve(timeMs, releaseDate);
		} catch (err) {
			console.error("Failed to sync solve", entry, err);
			// Keep unsynced attempts so we can retry after connectivity/auth issues.
			unsynced.push(entry);
		}
	}

	if (unsynced.length) {
		writeJson(STORAGE_KEYS.solves, unsynced);
	} else {
		writeJson(STORAGE_KEYS.solves, null);
	}
}

function buildDateQuery(date) {
	const params = new URLSearchParams({ date });
	return params.toString();
}

export async function getXWFromDate(date) {
	const clues = await apiGet(`/api/crosswords/get?${buildDateQuery(date)}`);
	return clues.clues;
}

export async function getPrivateXWs() {
	const list = await apiGet("/api/crosswords/get/private");
	return list.crosswords;
}

export async function updateCrossword(id, isPublic, releaseDate) {
	return apiPut("/api/crosswords/update/public", { id, isPublic, releaseDate });
}

export async function getXWInfo(date) {
	return apiGet(`/api/crosswords/info?${buildDateQuery(date)}`);
}
