export default defineNuxtRouteMiddleware((to, from) => {
	const email = useState<string | null>("resetPasswordEmail");
	const token = useState<string | null>("resetPasswordToken");

	if (!email.value || !token.value) {
		return navigateTo("/forgot-password", { replace: true });
	}
});
