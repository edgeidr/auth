// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: [
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@primevue/nuxt-module",
		"@nuxtjs/i18n",
		"@vueuse/nuxt",
	],
	ssr: false,
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	app: {
		head: {
			title: process.env.APP_NAME,
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},
	runtimeConfig: {
		public: {
			appName: process.env.APP_NAME || "",
			brandName: process.env.BRAND_NAME || "",
			apiBaseUrl: process.env.API_BASE_URL || "",
			toastLife: Number(process.env.TOAST_LIFE) || 5000,
			otpDuration: Number(process.env.OTP_DURATION) || 300,
			googleAuthUrl: process.env.GOOGLE_AUTH_URL || "",
			githubAuthUrl: process.env.GITHUB_AUTH_URL || "",
			otpLength: Number(process.env.OTP_LENGTH) || 6,
		},
	},
	pages: {
		pattern: ["**/*.vue", "!**/_components/**"],
	},
	routeRules: {
		"/": { redirect: "/account/profile" },
		"/account": { redirect: "/account/profile" },
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
			inputVariant: "filled",
		},
	},
	i18n: {
		locales: [{ code: "en", language: "en-US", file: "en.json" }],
		defaultLocale: "en",
		restructureDir: "",
		strategy: "no_prefix",
		langDir: "../../packages/i18n/locales",
	},
});
