export default defineNuxtPlugin(() => {
	const { user, isLoggedIn, getCurrentUser } = useCurrentUser();

	watch(
		isLoggedIn,
		async (loggedIn) => {
			if (loggedIn) await getCurrentUser();
			else user.value = null;
		},
		{ immediate: true },
	);
});
