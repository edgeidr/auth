<template>
	<Card>
		<template #title> {{ $t("account.security.socialAccounts.title") }} </template>

		<template #subtitle> {{ $t("account.security.socialAccounts.subtitle") }} </template>

		<template #content>
			<div class="-m-2">
				<div
					v-for="(provider, index) in providers"
					:key="provider.title"
					class="flex items-center gap-4 rounded-lg p-2">
					<div class="flex aspect-square place-items-center rounded-lg p-3">
						<Icon :name="provider.icon" size="large" />
					</div>

					<div class="flex-1">
						<div class="flex items-center gap-4">
							<span>{{ provider.title }}</span>

							<Tag
								v-if="provider.isConnected"
								severity="secondary"
								:value="$t('common.tags.connected')">
								<template #icon>
									<Icon :name="Icons.enabled" class="text-green-500" />
								</template>
							</Tag>
						</div>
					</div>

					<ActionMenu
						:loading="pending[provider.title]!"
						:menuItems="menuItems(provider)" />
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import type { MenuItem } from "primevue/menuitem";

	interface Provider {
		title: string;
		icon: string;
		isConnected: boolean;
		connectUrl: string;
		value: string;
	}

	const { t } = useI18n();
	const { user, getCurrentUser } = useCurrentUser();
	const toast = useToast();
	const config = useRuntimeConfig();
	const pending = reactive<Record<string, boolean>>({});
	const providers = ref<Provider[]>([
		{
			title: "Google",
			icon: Icons.googleLogo,
			isConnected: user.value?.googleSub ?? false,
			connectUrl: `${config.public.googleAuthUrl}/connect`,
			value: "google",
		},
		{
			title: "GitHub",
			icon: Icons.githubLogo,
			isConnected: user.value?.githubId ?? false,
			connectUrl: `${config.public.githubAuthUrl}/connect`,
			value: "github",
		},
	]);

	const menuItems = (provider: Provider): MenuItem[] => [
		{
			label: t("common.actions.connect"),
			visible: !provider.isConnected,
			command: () => onConnect(provider),
		},
		{
			label: t("common.actions.disconnect"),
			visible: provider.isConnected,
			command: () => onDisconnect(provider),
		},
	];

	const onConnect = async (provider: Provider) => {
		pending[provider.title] = true;
		window.location.href = provider.connectUrl;
		pending[provider.title] = false;
	};

	const onDisconnect = async (provider: Provider) => {
		pending[provider.title] = true;
		await disconnectProvider(`/users/${provider.value}`);
		pending[provider.title] = false;
	};

	const { execute: disconnectProvider } = useCustomFetch("", {
		method: "DELETE",
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { message } = response._data as { message: string };

			await getCurrentUser();

			toast.add({
				summary: t("common.status.success"),
				detail: t(message),
				severity: "success",
				life: config.public.toastLife,
			});
		},
	});
</script>
