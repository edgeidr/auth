import type { UseFetchOptions } from "nuxt/app";
import type { NitroFetchOptions } from "nitropack";

export const useCustomFetch = <T>(url: string | (() => string), options?: UseFetchOptions<T>) => {
	const { t, te } = useNuxtApp().$i18n;
	const toast = useToast();
	const runtimeConfig = useRuntimeConfig();
	const isLoggedIn = useCookie<boolean>("isLoggedIn");

	const showToast = ({
		summary,
		detail,
		severity = "error",
	}: {
		summary: string;
		detail: string;
		severity?: "info" | "success" | "warn" | "error";
	}) => {
		setTimeout(() => {
			toast.add({
				summary,
				detail,
				severity,
				life: useRuntimeConfig().public.toastLife,
			});
		}, 10);
	};

	const fetchUrl = ref(typeof url === "function" ? url() : url);

	const nuxtFetch = useFetch(fetchUrl, {
		...options,
		$fetch: useNuxtApp().$api as typeof $fetch,
		immediate: false,
		watch: false,
		lazy: true,
		credentials: "include",
		baseURL: runtimeConfig.public.apiBaseUrl,
		onRequestError: ({ error }) => {
			if (error.name === "AbortError" || error.message === "Request aborted") return;

			showToast({
				summary: t("common.status.serverError"),
				detail: t("common.message.tryAgain"),
			});
		},
		onResponseError: async (ctx) => {
			const { response, request, options: fetchOptions } = ctx;
			const { message, payload } = response._data as { message: any; payload: any };
			const defaultDetail = t("common.message.tryAgain");
			let summary;

			if (response.status >= 100 && response.status < 200) {
				summary = t("common.status.info");
			} else if (response.status >= 200 && response.status < 300) {
				summary = t("common.status.success");
			} else if (response.status >= 300 && response.status < 400) {
				summary = t("common.status.info");
			} else if (response.status >= 400 && response.status < 500) {
				summary = t("common.status.error");
			} else {
				summary = t("common.status.serverError");
			}

			if (response.status === 401 && !request.toString().includes("/auth/login")) {
				return await $fetch("/auth/refresh", {
					method: "POST",
					credentials: "include",
					baseURL: runtimeConfig.public.apiBaseUrl,
					onResponse: async ({ response }) => {
						if (!response.ok) return;

						return await $fetch(
							request,
							fetchOptions as NitroFetchOptions<typeof request>,
						);
					},
					onResponseError: ({ response }) => {
						const { message } = response._data;
						const detail = te(message) ? t(message, payload || {}) : defaultDetail;

						isLoggedIn.value = false;

						showToast({ summary, detail });
					},
				});
			}

			if (typeof options?.onResponseError === "function") {
				options.onResponseError(ctx);
			}

			if (message) {
				if (!Array.isArray(message)) {
					const detail = te(message) ? t(message, payload || {}) : defaultDetail;

					showToast({ summary, detail });
				}
			} else {
				showToast({ summary, detail: defaultDetail });
			}
		},
	});

	const customExecute = (arg?: string) => {
		if (typeof arg === "string") {
			fetchUrl.value = arg;
			return nuxtFetch.execute();
		}

		return nuxtFetch.execute();
	};

	return {
		...nuxtFetch,
		execute: customExecute,
	};
};
