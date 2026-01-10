<template>
	<Card>
		<template #title> {{ $t("account.security.socialAccounts.title") }} </template>

		<template #subtitle> {{ $t("account.security.socialAccounts.subtitle") }} </template>

		<template #content>
			<div class="-m-2">
				<div v-for="provider in providers" class="flex items-center gap-4 rounded-lg p-2">
					<div class="flex aspect-square place-items-center rounded-lg p-3">
						<Icon :name="provider.icon" size="large" />
					</div>

					<div class="flex flex-1 items-center gap-4">
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

					<div>
						<Button
							v-if="provider.isConnected"
							:label="$t('common.actions.disconnect')"
							severity="secondary" />

						<Button v-else :label="$t('common.actions.connect')" severity="secondary" />
					</div>
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";

	const providers = ref<
		{
			title: string;
			icon: string;
			isConnected: boolean;
		}[]
	>([
		{
			title: "Google",
			icon: Icons.googleLogo,
			isConnected: true,
		},
		{
			title: "GitHub",
			icon: Icons.githubLogo,
			isConnected: false,
		},
	]);
</script>
