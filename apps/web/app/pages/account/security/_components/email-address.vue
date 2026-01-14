<template>
	<Card>
		<template #title>{{ $t("account.security.emailAddress.title") }}</template>

		<template #subtitle>{{ $t("account.security.emailAddress.subtitle") }} </template>

		<template #content>
			<div class="-m-2">
				<div class="flex items-center gap-4 rounded-lg p-2">
					<div class="flex aspect-square place-items-center rounded-lg p-3">
						<Icon :name="Icons.mail" size="large" />
					</div>

					<div class="flex-1">
						<div class="flex items-center gap-4">
							<span>
								{{ user?.email ?? t("account.security.emailAddress.emailNotSet") }}
							</span>

							<template v-if="user?.email">
								<Tag
									v-if="user.emailVerifiedAt"
									severity="secondary"
									:value="$t('common.tags.verified')">
									<template #icon>
										<Icon :name="Icons.enabled" class="text-green-500" />
									</template>
								</Tag>

								<Tag
									v-else
									severity="secondary"
									:value="$t('common.tags.unverified')">
									<template #icon>
										<Icon :name="Icons.unverified" class="text-orange-500" />
									</template>
								</Tag>
							</template>
						</div>

						<p class="text-muted-color text-sm">{{ lastUpdatedLabel }}</p>
					</div>

					<div>
						<Button
							@click="menu?.toggle"
							severity="secondary"
							:disabled="pendingAdd || pendingChange || pendingVerify"
							:loading="pendingAdd || pendingChange || pendingVerify">
							<template #icon>
								<Icon :name="Icons.moreVertical" size="large" />
							</template>
						</Button>

						<Menu ref="menu" :model="menuItems" popup />
					</div>
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import type { MenuItem } from "primevue/menuitem";

	const { user } = useCurrentUser();
	const { t } = useI18n();
	const menu = ref();
	const menuItemsSet = ref<MenuItem[]>([
		{ label: t("common.actions.addEmail"), command: () => onAdd() },
	]);
	const menuItemsVerified = ref<MenuItem[]>([
		{ label: t("common.actions.change"), command: () => onChange() },
	]);
	const menuItemsUnverified = ref<MenuItem[]>([
		{
			label: t("common.actions.change"),
			disabled: !user.value?.emailVerifiedAt,
			command: () => onChange(),
		},
		{ label: t("common.actions.verify"), command: () => onVerify() },
	]);

	const lastUpdatedLabel = computed(() => {
		if (!user.value?.email) {
			return t("account.security.emailAddress.hint");
		}

		const { value } = useTimeAgo(user.value.emailUpdatedAt!);
		return t("common.timestamps.lastUpdated", { time: value });
	});

	const menuItems = computed(() => {
		if (!user.value?.email) return menuItemsSet.value;
		return user.value.emailVerifiedAt ? menuItemsVerified.value : menuItemsUnverified.value;
	});

	const { execute: onAdd, pending: pendingAdd } = useCustomFetch("/auth/email/add/request", {
		method: "POST",
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { token, tokenId } = response._data as { token: string; tokenId: string };

			navigateTo(`/add-email?tokenId=${tokenId}&token=${token}`);
		},
	});

	const { execute: onChange, pending: pendingChange } = useCustomFetch(
		"/auth/email/change/request",
		{
			method: "POST",
			onResponse: ({ response }) => {
				if (!response.ok) return;

				const { token } = response._data as { token: string };

				navigateTo(`/verify-otp?token=${token}`);
			},
		},
	);

	const { execute: onVerify, pending: pendingVerify } = useCustomFetch(
		"/auth/email/verify/request",
		{
			method: "POST",
			onResponse: ({ response }) => {
				if (!response.ok) return;

				const { token } = response._data as { token: string };

				navigateTo(`/verify-otp?token=${token}`);
			},
		},
	);
</script>
