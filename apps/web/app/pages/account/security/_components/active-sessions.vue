<template>
	<Card>
		<template #title> {{ $t("account.security.activeSessions.title") }} </template>

		<template #subtitle> {{ $t("account.security.activeSessions.subtitle") }} </template>

		<template #content>
			<div class="space-y-4">
				<Panel v-for="session in sessions" :pt="{ header: 'py-1.5!' }">
					<template #default>
						<div class="flex flex-1 justify-between gap-4">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<Icon :name="Icons.computer" />
									<span> {{ session.title }} </span>
									<Tag
										v-if="session.isCurrent"
										severity="secondary"
										:value="
											$t('account.security.activeSessions.currentSession')
										" />
								</div>

								<div class="text-muted-color flex items-center gap-2">
									<Icon :name="Icons.location" />
									<span> {{ session.location }} </span>
								</div>

								<span class="text-muted-color"> {{ session.lastActive }} </span>
							</div>

							<div>
								<Button
									v-if="!session.isCurrent"
									:label="$t('common.actions.revoke')"
									variant="outlined"
									severity="secondary" />
							</div>
						</div>
					</template>
				</Panel>
			</div>
		</template>

		<template #footer>
			<Button :label="$t('common.actions.signOutOtherDevices')" severity="danger">
				<template #icon>
					<Icon :name="Icons.logout" />
				</template>
			</Button>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";

	const sessions = ref<
		{
			title: string;
			location: string;
			lastActive: string;
			isCurrent: boolean;
		}[]
	>([
		{
			title: "Chrome on Windows PC",
			location: "Manila, Philippines",
			lastActive: "Active now",
			isCurrent: true,
		},
		{
			title: "Chrome on Android Phone",
			location: "Manila, Philippines",
			lastActive: "2 hours ago",
			isCurrent: false,
		},
		{
			title: "Chrome on MacBook Pro",
			location: "Manila, Philippines",
			lastActive: "1 day ago",
			isCurrent: false,
		},
	]);
</script>
