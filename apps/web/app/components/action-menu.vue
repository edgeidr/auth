<template>
	<div>
		<Button @click="menu?.toggle" severity="secondary" :loading="props.loading">
			<template #icon>
				<Icon :name="Icons.moreVertical" size="large" />
			</template>
		</Button>

		<Menu ref="menu" :model="menuItems" popup />
	</div>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import type { MenuItem } from "primevue/menuitem";

	const props = defineProps<{
		loading: boolean | undefined;
		menuItems: MenuItem[];
	}>();

	const menu = ref();
</script>
