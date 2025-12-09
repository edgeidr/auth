export default defineNuxtRouteMiddleware((to, from) => {
	if (to.path === "/") {
		return navigateTo({ name: "account-profile" }, { replace: true });
	}

	if (to.path === "/account") {
		return navigateTo({ name: "account-profile" }, { replace: true });
	}
});
