import { ref, computed } from "vue";
import { apiPost, apiAuth } from "./useApi";
import { syncLocalSolves } from "./useXW";
import { STORAGE_KEYS, readString, writeString } from "@/utils/storage";
import { clearStoredUser, getStoredUser, saveStoredUser } from "@/utils/user";

const user = ref(getStoredUser());
const token = ref(readString(STORAGE_KEYS.token));

const isAuthenticated = computed(() => !!user.value);

function setUser(newUser) {
	user.value = newUser;
	if (newUser) {
		saveStoredUser(newUser);
	} else {
		clearStoredUser();
	}
}

function setToken(newToken) {
	token.value = newToken || null;
	writeString(STORAGE_KEYS.token, token.value);
}

async function authenticate(path, credentials) {
	const data = await apiPost(path, credentials);
	setUser(data.user);
	setToken(data.token);
	await syncLocalSolves();
	return data;
}

export function useAuth() {
	async function login(credentials) {
		return authenticate("/api/auth/login", credentials);
	}

	async function register(credentials) {
		return authenticate("/api/auth/register", credentials);
	}

	function logout() {
		setUser(null);
		setToken(null);
	}

	async function checkAdmin() {
		if (!token.value) {
			return { access: false, message: "No authentication token found." };
		}
		return apiAuth("/api/auth/admincheck", `Bearer ${token.value}`);
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

export function useAcct() {
	async function forgotPassword(email) {
		return apiPost("/api/acct/request-password-reset", {
			email,
		});
	}

	async function resetPassword(token, newPassword) {
		return apiPost("/api/acct/reset-password", {
			token,
			newPassword,
		});
	}

	return {
		forgotPassword,
		resetPassword,
	};
}
