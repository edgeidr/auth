<template>
	<header class="bg-surface-0 fixed inset-x-0 z-50 h-16 shadow duration-200">
		<div class="mx-auto h-full px-8">
			<nav class="flex h-full items-center justify-between gap-4 py-2 duration-200">
				<div class="w-sm justify-items-start">
					<div>
						<NuxtLink to="/">
							<img :src="Images.TransparentLogo" class="h-10" />
						</NuxtLink>
					</div>
				</div>

				<div class="h-full w-xl justify-items-center"></div>

				<div class="w-sm justify-items-end">
					<ul class="flex items-center gap-4">
						<li>
							<div class="flex">
								<Button
									class="p-0!"
									@click="profileMenu?.toggle"
									variant="text"
									rounded>
									<Avatar :image="user?.userProfile?.photoUrl" shape="circle" />
								</Button>

								<Menu ref="profileMenu" :model="profileMenuItems" popup>
									<template #start>
										<div class="px-4 py-2">
											<p>{{ fullName }}</p>
											<p class="text-muted-color text-sm">
												{{ user?.email }}
											</p>
										</div>
									</template>

									<template #item="{ item, label, props }">
										<component
											:is="item.route ? NuxtLink : 'div'"
											:to="item.route"
											v-bind="props.action">
											<Icon
												v-if="item.icon"
												v-bind="props.icon"
												:name="item.icon" />
											<span v-bind="props.label">{{ label }}</span>
										</component>
									</template>
								</Menu>
							</div>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</header>

	<div v-if="pendingLogout || !user" class="bg-surface-200 fixed inset-0 z-9999"></div>
</template>

<script setup lang="ts">
	import { NuxtLink } from "#components";
	import { Icons, Images } from "@repo/assets";

	const { t } = useI18n();
	const profileMenu = ref();
	const { user, fullName } = useCurrentUser();

	const { execute: logout, pending: pendingLogout } = useCustomFetch("/auth/logout", {
		method: "POST",
	});

	const profileMenuItems = ref([
		{
			separator: true,
		},
		{
			label: t("common.pages.profile"),
			route: "/account/profile",
			icon: Icons.user,
		},
		{
			label: t("layout.header.profileMenu.settings"),
			route: "/account/security",
			icon: Icons.settings,
		},
		{
			separator: true,
		},
		{
			label: t("common.pages.terms"),
			route: "/terms-of-service",
			icon: Icons.file,
		},
		{
			label: t("common.pages.privacy"),
			route: "/privacy-policy",
			icon: Icons.lock,
		},
		{
			separator: true,
		},
		{
			label: t("common.actions.logout"),
			icon: Icons.logout,
			command: () => logout(),
		},
	]);
</script>
