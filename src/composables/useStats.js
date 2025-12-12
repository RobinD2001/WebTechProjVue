import { ref } from "vue";
import { apiGet } from "@/composables/useApi.js";
import { resolveUsername } from "@/utils/user";

const userQuery = ref("");

function refreshUserQuery() {
	const username = resolveUsername();

	if (!username) {
		// Anonymous visitors still load leaderboards without leaking previous user info.
		userQuery.value = "";
		return;
	}

	const params = new URLSearchParams({ username });
	userQuery.value = `?${params.toString()}`;
}

refreshUserQuery();

export async function getDailyLeaderboard() {
	refreshUserQuery();
	const data = await apiGet(`/api/stats/daily${userQuery.value}`);
	const { crosswordID = null, leaderboard = [], userPlacement = null } = data || {};
	return { crosswordID, leaderboard, userPlacement };
}

export async function getWeeklyLeaderboard() {
	refreshUserQuery();
	const data = await apiGet(`/api/stats/weekly${userQuery.value}`);
	const { leaderboard = [], userPlacement = null } = data || {};
	return { leaderboard, userPlacement };
}

export async function getUserStats() {
	refreshUserQuery();
	return apiGet(`/api/stats/user${userQuery.value}`);
}

export async function fetchAllStats() {
	const daily = await getDailyLeaderboard();
	const weekly = await getWeeklyLeaderboard();
	const userStats = await getUserStats();
	return { daily, weekly, userStats };
}

export function getStats() {
	refreshUserQuery();
	return {
		getDailyLeaderboard,
		getWeeklyLeaderboard,
		getUser: getUserStats,
	};
}
