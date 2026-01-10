<template>
	<Card>
		<template #title>{{ $t("account.security.emailAddress.title") }}</template>

		<template #subtitle>{{ $t("account.security.emailAddress.subtitle") }} </template>

		<template #content>
			<div class="-m-2">
				<div v-if="user?.email" class="flex items-center gap-4 rounded-lg p-2">
					<div class="flex aspect-square place-items-center rounded-lg p-3">
						<Icon :name="Icons.mail" size="large" />
					</div>

					<div class="flex flex-1 items-center gap-4">
						<span> {{ user.email }} </span>

						<Tag severity="secondary" :value="$t('common.tags.verified')">
							<template #icon>
								<Icon :name="Icons.enabled" class="text-green-500" />
							</template>
						</Tag>
					</div>

					<Button :label="t('common.actions.change')" severity="secondary" />
				</div>

				<Button v-else :label="t('common.actions.addEmail')" />
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";

	const { user } = useCurrentUser();
	const { t } = useI18n();
</script>
