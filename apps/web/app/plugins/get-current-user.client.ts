import { Access } from "@repo/shared";

export default defineNuxtPlugin(() => {
	const { user, hasUser, isLoggedIn, getCurrentUser } = useCurrentUser();
	const route = useRoute();
	const access = route.meta.access ?? [];

	watch(
		isLoggedIn,
		async (loggedIn) => {
			if (loggedIn) await getCurrentUser();
			else user.value = null;
		},
		{ immediate: true },
	);

	watch(
		user,
		(hasUserData) => {
			if (hasUserData && access.length > 0 && !access.includes(Access.AUTHENTICATED)) {
				return navigateTo("/");
			}

			if (!hasUserData && access.length > 0 && !access.includes(Access.GUEST)) {
				return navigateTo("/login");
			}
		},
		{ immediate: true },
	);
});
