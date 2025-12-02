// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@primevue/nuxt-module"],
	ssr: false,
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	app: {
		head: {
			title: process.env.NUXT_APP_NAME,
		},
	},
	runtimeConfig: {
		public: {
			appName: process.env.NUXT_APP_NAME || "",
			brandName: process.env.NUXT_BRAND_NAME || "",
			apiBaseUrl: process.env.NUXT_API_BASE_URL || "",
			toastLife: Number(process.env.NUXT_TOAST_LIFE) || 5000,
			googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID || "",
		},
	},
	components: [
		{
			path: "@/components",
			pathPrefix: false,
		},
	],
	fonts: {
		families: [{ name: "Inter" }],
	},
	primevue: {
		importTheme: { from: "@/primevue/theme", as: "globalTheme" },
		importPT: { from: "@/primevue/passthrough", as: "globalPassthrough" },
		options: {
			ptOptions: { mergeProps: true },
			ripple: true,
		},
	},
});
