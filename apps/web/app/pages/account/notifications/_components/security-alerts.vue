<template>
	<Card>
		<template #title> {{ $t("account.notifications.securityAlerts.title") }} </template>

		<template #subtitle>
			{{ $t("account.notifications.securityAlerts.subtitle") }}
		</template>

		<template #content>
			<DataView :value="options">
				<template #list="{ items }">
					<div class="-m-2">
						<template v-for="(item, index) in items" :key="index">
							<div class="hover:bg-surface-50 flex items-center gap-4 rounded-lg p-2">
								<div class="flex aspect-square place-items-center rounded-lg p-3">
									<Icon :name="item.icon" size="large" />
								</div>

								<div class="flex-1">
									<span>{{ item.title }}</span>
									<p class="text-muted-color text-sm">{{ item.subtitle }}</p>
								</div>

								<ToggleSwitch />
							</div>
						</template>
					</div>
				</template>
			</DataView>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";

	const { t } = useI18n();
	const options = ref<
		{
			title: string;
			subtitle: string;
			icon: string;
		}[]
	>([
		{
			title: t("account.notifications.securityAlerts.options.login.title"),
			subtitle: t("account.notifications.securityAlerts.options.login.subtitle"),
			icon: Icons.login,
		},
		{
			title: t("account.notifications.securityAlerts.options.password.title"),
			subtitle: t("account.notifications.securityAlerts.options.password.subtitle"),
			icon: Icons.key,
		},
		{
			title: t("account.notifications.securityAlerts.options.newDeviceLogin.title"),
			subtitle: t("account.notifications.securityAlerts.options.newDeviceLogin.subtitle"),
			icon: Icons.phone,
		},
	]);
</script>
