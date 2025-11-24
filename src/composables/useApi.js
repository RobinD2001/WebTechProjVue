const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function apiRequest(path, options = {}) {
    const res = await fetch(API_URL + path, {
        headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
        },
        ...options
    });

    let data;
    try {
        data = await res.json();
    } catch (e) {
        data = null;
    }

    if (!res.ok) {
        const message = data && data.message ? data.message : "Request failed";
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
        body: JSON.stringify(body)
    });
}
