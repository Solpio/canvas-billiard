import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
	publicDir: "src/public",
	plugins: [react()],
	build: {
		outDir: "build",
	},
	resolve: {
		alias: {
			shared: path.resolve(__dirname, "src/shared"),
			features: path.resolve(__dirname, "src/features"),
			pages: path.resolve(__dirname, "src/pages"),
			hooks: path.resolve(__dirname, "src/hooks"),
			public: path.resolve(__dirname, "src/public"),
		},
	},
});
