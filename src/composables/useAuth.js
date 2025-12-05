import { ref, computed } from "vue";
import { apiPost } from "./useApi";
import { syncLocalSolves } from "./useXW";

const storedUser = localStorage.getItem("currentUser");
const user = ref(storedUser ? JSON.parse(storedUser) : null);
const token = ref(localStorage.getItem("token") || null);

const isAuthenticated = computed(() => !!user.value);

function setUser(newUser) {
	user.value = newUser;
	if (newUser) {
		localStorage.setItem("currentUser", JSON.stringify(newUser));
	} else {
		localStorage.removeItem("currentUser");
	}
}

function setToken(newToken) {
	token.value = newToken;
	if (newToken) localStorage.setItem("token", newToken);
	else localStorage.removeItem("token");
}

export function useAuth() {
	async function login(credentials) {
		const data = await apiPost("/api/login", credentials);
		setUser(data.user);
		setToken(data.token);
		await syncLocalSolves();
		return data;
	}

	async function register(credentials) {
		const data = await apiPost("/api/register", credentials);
		setUser(data.user);
		await syncLocalSolves();
		return data;
	}

	function logout() {
		setUser(null);
	}

	async function checkAdmin() {
		console.log("checking", token.value);

		return apiPost("/api/admincheck", { token: token.value });
	}

	return {
		user,
		isAuthenticated,
		login,
		register,
		logout,
		checkAdmin,
	};
}
