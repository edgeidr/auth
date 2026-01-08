<template>
	<TheHeader />

	<TheMain>
		<div class="relative mx-auto flex justify-between gap-4 px-8">
			<aside class="sticky top-0 h-screen w-sm pt-16">
				<ScrollPanel :pt="passthrough.sidebar">
					<div class="space-y-4 pt-8 pb-8">
						<slot name="sidebar-left" />
					</div>
				</ScrollPanel>
			</aside>

			<section class="w-xl pt-16">
				<div class="relative min-h-full pt-8 pb-8">
					<slot />
				</div>
			</section>

			<aside class="sticky top-0 h-screen w-sm pt-16">
				<ScrollPanel :pt="passthrough.sidebar">
					<div class="space-y-4 pt-8 pb-8">
						<slot name="sidebar-right" />
					</div>
				</ScrollPanel>
			</aside>
		</div>
	</TheMain>
</template>

<script lang="ts" setup>
	import TheHeader from "@/app-shells/TheHeader.vue";
	import TheMain from "@/app-shells/TheMain.vue";
	import type { ScrollPanelPassThroughOptions } from "primevue/scrollpanel";

	const slots = useSlots();
	const hasLeftSidebar = !!slots["sidebar-left"];
	const hasRightSidebar = !!slots["sidebar-right"];

	const passthrough = {
		sidebar: <ScrollPanelPassThroughOptions>{
			barY: "translate-x-4",
			root: "h-full",
		},
	};

	const sidebarCount = computed(() => [hasLeftSidebar, hasRightSidebar].filter(Boolean).length);
</script>
