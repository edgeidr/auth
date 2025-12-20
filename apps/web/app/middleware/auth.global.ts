import { Access } from "@repo/shared";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { hasUser, isLoggedIn } = useCurrentUser();
	const access = to.meta.access ?? [];

	if (isLoggedIn.value) {
		await until(() => hasUser.value)
			.toBe(true, { timeout: 5000, throwOnTimeout: true })
			.catch(() => {
				isLoggedIn.value = false;
			});
	}

	if (hasUser.value && access.length > 0 && !access.includes(Access.AUTHENTICATED)) {
		return navigateTo("/");
	}

	if (!hasUser.value && access.length > 0 && !access.includes(Access.GUEST)) {
		return navigateTo("/login");
	}
});
