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

							<Tag severity="secondary" :value="$t('common.tags.enabled')">
								<template #icon>
									<Icon :name="Icons.check" class="text-green-500" />
								</template>
							</Tag>
						</div>

						<p class="text-muted-color text-sm">
							{{ t("common.timestamps.lastChanged", { time: "2 hours ago" }) }}
						</p>
					</div>

					<Button
						@click="sendCode()"
						:label="t('common.actions.change')"
						:disabled="!user?.email || pending"
						:loading="pending"
						severity="secondary" />
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";

	const { t } = useI18n();
	const { user } = useCurrentUser();

	const { execute: sendCode, pending } = useCustomFetch("/auth/password/change/request", {
		method: "POST",
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { token } = response._data as { token: string };

			navigateTo(`/verify-otp?token=${token}`);
		},
	});
</script>
