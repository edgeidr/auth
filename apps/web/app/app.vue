<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<Toast />
</template>

<script setup lang="ts">
	import { Access } from "@repo/shared";

	const { hasUser } = useCurrentUser();
	const route = useRoute();

	watchEffect(() => {
		const access = route.meta.access ?? [];

		if (
			hasUser.value &&
			access.length > 0 &&
			!access.includes(Access.AUTHENTICATED) &&
			route.path !== "/"
		) {
			return navigateTo("/");
		}

		if (
			!hasUser.value &&
			access.length > 0 &&
			!access.includes(Access.GUEST) &&
			route.path !== "/login"
		) {
			return navigateTo("/login");
		}
	});
</script>
