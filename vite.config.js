import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const backendTarget = "http://localhost:3000";
const proxyPaths = ["/api", "/socket.io"];

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
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
