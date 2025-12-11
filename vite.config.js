import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const backendTarget = "http://localhost:3000";
const proxyPaths = ["/api", "/socket.io"];

// https://vite.dev/config/
const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
	plugins: [vue(), !isProd && vueDevTools()].filter(Boolean),
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		proxy: proxyPaths.reduce((config, path) => {
			config[path] = {
				target: backendTarget,
				changeOrigin: true,
				ws: path === "/socket.io",
			};
			return config;
		}, {}),
	},
});
