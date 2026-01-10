<template>
	<Card>
		<template #title>{{ $t("account.security.password.title") }}</template>

		<template #subtitle>{{ $t("account.security.password.subtitle") }} </template>

		<template #content>
			<div class="-m-2">
				<div class="flex items-center gap-4 rounded-lg p-2">
					<div class="flex aspect-square place-items-center rounded-lg p-3">
						<Icon :name="Icons.key" size="large" />
					</div>

					<div class="flex-1">
						<div class="flex items-center gap-4">
							<span> {{ t("account.security.password.passwordSignIn") }} </span>

							<Tag
								v-if="user?.passwordEnabled"
								severity="secondary"
								:value="$t('common.tags.enabled')">
								<template #icon>
									<Icon :name="Icons.enabled" class="text-green-500" />
								</template>
							</Tag>

							<Tag v-else severity="secondary" :value="$t('common.tags.disabled')">
								<template #icon>
									<Icon :name="Icons.disabled" class="text-red-500" />
								</template>
							</Tag>
						</div>

						<p class="text-muted-color text-sm">{{ passwordLastChanged }}</p>
					</div>

					<div>
						<Button
							@click="menu?.toggle"
							severity="secondary"
							:disabled="!user?.email || pending"
							:loading="pending">
							<template #icon>
								<Icon :name="Icons.moreVertical" size="large" />
							</template>
						</Button>

						<Menu
							ref="menu"
							:model="user?.passwordEnabled ? menuItemsEnabled : menuItemsDisabled"
							popup />
					</div>
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import type { MenuItem } from "primevue/menuitem";

	const { t } = useI18n();
	const { user } = useCurrentUser();

	const menu = ref();
	const menuItemsEnabled = ref<MenuItem[]>([
		{ label: "Change", command: () => onChange() },
		{ label: "Disable" },
	]);
	const menuItemsDisabled = ref<MenuItem[]>([
		{ label: "Set Password", command: () => onChange() },
	]);

	const { execute: onChange, pending } = useCustomFetch("/auth/password/change/request", {
		method: "POST",
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { token } = response._data as { token: string };

			navigateTo(`/verify-otp?token=${token}`);
		},
	});

	const passwordLastChanged = computed(() => {
		if (!user.value?.passwordEnabled && !user.value?.passwordChangedAt) {
			return t("account.security.password.passwordNeverSet");
		}

		const { value } = useTimeAgo(user.value.passwordChangedAt);
		return t("common.timestamps.lastChanged", { time: value });
	});
</script>
