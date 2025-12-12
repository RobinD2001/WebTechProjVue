import i18n from "@/i18n";

function getLocaleHeader() {
	const locale = i18n?.global?.locale?.value || "en";
	// Propagate locale so backend can return translated content without extra params.
	return { "X-Locale": locale };
}

async function apiRequest(path, options = {}) {
	const res = await fetch(path, {
		headers: {
			"Content-Type": "application/json",
			...getLocaleHeader(),
			...(options.headers || {}),
		},
		...options,
	});

	let data;
	try {
		data = await res.json();
	} catch (e) {
		// Some endpoints return empty bodies (204) on success/failure.
		data = null;
	}

	if (!res.ok) {
		const message = data?.message ? data.message : "Request failed";
		const error = new Error(message);
		error.status = res.status;
		error.body = data;
		throw error;
	}

	return data;
}

export function apiPost(path, body) {
	return apiRequest(path, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export function apiPut(path, body) {
	return apiRequest(path, {
		method: "PUT",
		body: JSON.stringify(body),
	});
}

export function apiGet(path) {
	return apiRequest(path, {
		method: "GET",
	});
}

export function apiAuth(path, auth) {
	return apiRequest(path, {
		method: "GET",
		headers: {
			Authorization: auth,
		},
	});
}
