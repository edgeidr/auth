<template>
	<header class="bg-surface-0 fixed inset-x-0 z-50 h-16 shadow duration-200">
		<div class="container mx-auto h-full">
			<nav class="grid h-full grid-cols-12 items-center gap-4 py-2 duration-200">
				<div class="col-span-3 justify-items-start">
					<div>
						<NuxtLink :to="{ name: 'account-profile' }">
							<img :src="Images.TransparentLogo" class="h-10" />
						</NuxtLink>
					</div>
				</div>

				<div class="col-span-6 h-full justify-items-center"></div>

				<div class="col-span-3 justify-items-end">
					<ul class="flex items-center gap-4">
						<li>
							<div class="flex">
								<Button
									class="p-0!"
									@click="profileMenu?.toggle"
									variant="text"
									rounded>
									<Avatar :image="undefined" shape="circle" />
								</Button>

								<Menu ref="profileMenu" :model="profileMenuItems" popup>
									<template #start>
										<div class="px-4 py-2">
											<p>John Doe</p>
											<p class="text-muted-color text-sm">
												john.doe@example.com
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
</template>

<script setup lang="ts">
	import { NuxtLink } from "#components";
	import { Icons, Images } from "@repo/assets";

	const { t } = useI18n();
	const profileMenu = ref();
	const profileMenuItems = ref([
		{
			separator: true,
		},
		{
			label: t("header.profileMenu.profile"),
			route: { name: "account-profile" },
			icon: Icons.user,
		},
		{
			label: t("header.profileMenu.settings"),
			route: { name: "account-security" },
			icon: Icons.settings,
		},
		{
			separator: true,
		},
		{
			label: t("common.termsOfService"),
			route: { name: "terms-of-service" },
			icon: Icons.file,
		},
		{
			label: t("common.privacyPolicy"),
			route: { name: "privacy-policy" },
			icon: Icons.lock,
		},
		{
			separator: true,
		},
		{
			label: t("header.profileMenu.logout"),
			icon: Icons.logout,
		},
	]);
</script>
