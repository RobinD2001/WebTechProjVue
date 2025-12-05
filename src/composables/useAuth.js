import { ref, computed } from "vue";
import { apiPost } from "./useApi";
import { syncLocalSolves } from "./useXW";

const storedUser = localStorage.getItem("currentUser");
const storedToken = localStorage.getItem("token");
const user = ref(storedUser ? JSON.parse(storedUser) : null);

const isAuthenticated = computed(() => !!user.value);

function setUser(newUser) {
	user.value = newUser;
	if (newUser) {
		localStorage.setItem("currentUser", JSON.stringify(newUser));
	} else {
		localStorage.removeItem("currentUser");
	}
}

export function useAuth() {
	async function login(credentials) {
		const data = await apiPost("/api/login", credentials);
		setUser(data.user);
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
		const isAdmin = await apiPost("/api/admincheck", { token: storedToken });
		return isAdmin;
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
