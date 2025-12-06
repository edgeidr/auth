export default defineNuxtRouteMiddleware((to, from) => {
	const email = useState<string | null>("forgotPasswordEmail");

	if (!email.value) {
		return navigateTo({ name: "forgot-password" }, { replace: true });
	}
});
