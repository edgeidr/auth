import { Access } from "@repo/shared";

export default defineNuxtPlugin(() => {
	const { user, isLoggedIn, getCurrentUser } = useCurrentUser();
	const route = useRoute();

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
			const access = route.meta.access ?? [];

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
