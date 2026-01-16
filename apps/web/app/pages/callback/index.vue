<template></template>

<script setup lang="ts">
	const route = useRoute();
	const error = route.query.error as string | undefined;
	const toast = useToast();
	const config = useRuntimeConfig();
	const { t } = useI18n();

	onMounted(async () => {
		await navigateTo("/login", { replace: true });

		if (error) {
			const summary = t("common.status.error");
			const detail = t(error);

			toast.add({
				summary,
				detail,
				severity: "error",
				life: config.public.toastLife,
			});
		}
	});
</script>
