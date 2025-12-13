<template>
	<NuxtLayout name="app">
		<template #sidebar-left>
			<Card>
				<template #content>
					<div class="flex flex-col items-center gap-4">
						<Avatar :image="undefined" shape="circle" class="size-28!" />

						<div class="text-center">
							<span class="text-xl">John Doe</span>
							<p class="text-muted-color">john.doe@example.com</p>
						</div>

						<div>
							<NuxtLink
								v-for="(social, index) in socials"
								:key="index"
								:to="social.link"
								target="_blank"
								class="hover:text-surface-900 text-surface-500 m-1 duration-200">
								<Icon :name="social.icon" size="large" />
							</NuxtLink>
						</div>
					</div>
				</template>
			</Card>

			<Card :pt="{ body: 'p-2!' }">
				<template #content>
					<nav>
						<ul>
							<li v-for="link in navLinks" :key="link.label">
								<Button
									:as="NuxtLink"
									:to="{ name: link.routeName }"
									variant="text"
									severity="contrast"
									fluid>
									<template #default>
										<div
											class="flex w-full items-center gap-4 duration-200"
											:class="{
												'text-primary': $route.name === link.routeName,
											}">
											<Icon :name="link.icon" size="large" />

											<div>
												<span>{{ link.label }}</span>

												<p class="text-muted-color text-sm">
													{{ link.description }}
												</p>
											</div>
										</div>
									</template>
								</Button>
							</li>
						</ul>
					</nav>
				</template>
			</Card>
		</template>

		<slot />
	</NuxtLayout>
</template>

<script setup lang="ts">
	import { Icons } from "@repo/assets";
	import { NuxtLink } from "#components";

	const { t } = useI18n();
	const navLinks: {
		label: string;
		description: string;
		icon: string;
		routeName: string;
	}[] = [
		{
			label: t("common.pages.profile"),
			description: t("layout.sidebar.profile.description"),
			icon: Icons.user,
			routeName: "account-profile",
		},
		{
			label: t("common.pages.security"),
			description: t("layout.sidebar.security.description"),
			icon: Icons.security,
			routeName: "account-security",
		},
		{
			label: t("common.pages.notifications"),
			description: t("layout.sidebar.notifications.description"),
			icon: Icons.notifications,
			routeName: "account-notifications",
		},
	];
	const socials: {
		label: string;
		link: string;
		icon: string;
	}[] = [
		{ label: "LinkedIn", link: "https://www.linkedin.com/", icon: Icons.linkedIn },
		{ label: "GitHub", link: "https://github.com/", icon: Icons.github },
		{ label: "Email", link: "https://gmail.com/", icon: Icons.email },
		{ label: "Instagram", link: "https://www.instagram.com/", icon: Icons.instagram },
	];
</script>
