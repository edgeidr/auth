import { Access } from "@repo/shared";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { hasUser, isLoggedIn } = useCurrentUser();
	const access = to.meta.access ?? [];

	if (isLoggedIn.value && !hasUser.value) {
		await until(hasUser).toBe(true, { timeout: 5000, throwOnTimeout: true });
	}

	if (
		hasUser.value &&
		access.length > 0 &&
		!access.includes(Access.AUTHENTICATED) &&
		to.path !== "/"
	) {
		return navigateTo("/");
	}

	if (
		!hasUser.value &&
		access.length > 0 &&
		!access.includes(Access.GUEST) &&
		to.path !== "/login"
	) {
		return navigateTo("/login");
	}
});
