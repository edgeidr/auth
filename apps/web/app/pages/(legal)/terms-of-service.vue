<template>
	<Card>
		<template #title>
			<div class="flex items-center">
				<Icon :name="Icons.file" class="mr-2" />
				{{ $t("common.pages.terms") }}
			</div>
		</template>
	</Card>

	<div class="mt-4 flex items-center justify-between gap-4">
		<Button :label="$t('common.actions.backToLogin')" variant="text" :as="NuxtLink" to="/login">
			<template #icon="slotProps">
				<Icon :name="Icons.left" :class="slotProps.class" />
			</template>
		</Button>

		<Button
			:label="$t('common.pages.privacy')"
			variant="text"
			iconPos="right"
			:as="NuxtLink"
			to="/privacy-policy">
			<template #icon="slotProps">
				<Icon :name="Icons.right" :class="slotProps.class" />
			</template>
		</Button>
	</div>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import { NuxtLink } from "#components";
	import { Access } from "@repo/shared";

	definePageMeta({
		layout: "legal",
		access: [Access.GUEST, Access.AUTHENTICATED],
	});
</script>
