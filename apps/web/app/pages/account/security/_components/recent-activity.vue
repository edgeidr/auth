<template>
	<Card>
		<template #title> {{ $t("account.security.recentActivity.title") }} </template>

		<template #subtitle> {{ $t("account.security.recentActivity.subtitle") }} </template>

		<template #content>
			<DataView :value="recentActivities">
				<template #list="{ items }">
					<template v-for="(activity, index) in items" :key="index">
						<Divider v-if="index !== 0" />

						<div class="flex justify-between gap-4 space-y-2">
							<div>
								<span>{{ activity.action }}</span>

								<div class="flex items-center gap-2">
									<Icon :name="Icons.location" />
									<span class="text-muted-color">{{ activity.location }}</span>
								</div>
							</div>

							<span class="text-muted-color">{{ activity.createdAt }}</span>
						</div>
					</template>
				</template>
			</DataView>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";

	const recentActivities = ref<
		{
			action: string;
			location: string;
			createdAt: string;
		}[]
	>([
		{
			action: "Password changed",
			location: "Manila, Philippines",
			createdAt: "2 hours ago",
		},
		{
			action: "Login from new device",
			location: "Auckland, New Zealand",
			createdAt: "1 day ago",
		},
		{
			action: "Login from new device",
			location: "Manila, Philippines",
			createdAt: "3 weeks ago",
		},
		{
			action: "Password changed",
			location: "Manila, Philippines",
			createdAt: "6 months ago",
		},
	]);
</script>
