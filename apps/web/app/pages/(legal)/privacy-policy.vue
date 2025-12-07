<template>
	<Card>
		<template #title>
			<div class="flex items-center">
				<Icon :name="Icons.lock" class="mr-2" />
				{{ $t("privacyPolicy.header.title") }}
			</div>
		</template>
	</Card>

	<div class="mt-4 flex items-center justify-between gap-4">
		<Button
			:label="$t('privacyPolicy.actions.login')"
			variant="text"
			:as="NuxtLink"
			:to="{ name: 'login' }">
			<template #icon="slotProps">
				<Icon :name="Icons.left" :class="slotProps.class" />
			</template>
		</Button>

		<Button
			:label="$t('privacyPolicy.actions.termsOfService')"
			variant="text"
			iconPos="right"
			:as="NuxtLink"
			:to="{ name: 'terms-of-service' }">
			<template #icon="slotProps">
				<Icon :name="Icons.right" :class="slotProps.class" />
			</template>
		</Button>
	</div>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import { NuxtLink } from "#components";

	definePageMeta({
		layout: "legal",
	});
</script>
