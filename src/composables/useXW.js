import { apiPost, apiPut, apiGet } from "@/composables/useApi.js";

export async function addCrosswordToDB(payload) {
	const res = await apiPost("/api/crosswords/new", payload);
	console.log(res.message);
	return res;
}

export async function addSolve(timeInMs, releaseDate) {
	const stored = localStorage.getItem("currentUser");
	const user = stored ? JSON.parse(stored) : null;
	const username = user?.name;
	const time = Number(timeInMs / 1000);
	console.log(username, releaseDate);

	if (!username || !releaseDate) return;
	const res = await apiPost("/api/crosswords/solve", { username, time, releaseDate });
	console.log(res.message);
	return res;
}

export async function getXWFromDate(date) {
	const formattedDate = new URLSearchParams({
		date: date,
	});
	//console.log("useXW:", formattedDate);

	const clues = await apiGet(`/api/crosswords/get?${formattedDate}`);
	//console.log(clues.message);
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
	const formattedDate = new URLSearchParams({
		date: date,
	});
	console.log("request crossword information", formattedDate);
	const info = await apiGet(`/api/crosswords/info?${formattedDate}`);
	return info;
}
