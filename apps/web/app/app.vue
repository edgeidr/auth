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
	const access = route.meta.access ?? [];

	watch(hasUser, (hasUserData) => {
		if (hasUserData && access.length > 0 && !access.includes(Access.AUTHENTICATED)) {
			return navigateTo("/");
		}

		if (!hasUserData && access.length > 0 && !access.includes(Access.GUEST)) {
			return navigateTo("/login");
		}
	});
</script>
