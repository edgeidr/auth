<template>
	<Card>
		<template #title>{{ $t("login.header.title") }}</template>

		<template #subtitle>{{ $t("login.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="">
				<div class="space-y-4">
					<FloatLabel variant="in">
						<InputText id="email" fluid />
						<label for="email">{{ $t("common.inputs.email") }}</label>
					</FloatLabel>

					<FloatLabel variant="in">
						<Password id="password" :feedback="false" toggleMask fluid />
						<label for="password">{{ $t("common.inputs.password") }}</label>
					</FloatLabel>

					<div class="flex items-center justify-between gap-4">
						<div class="flex items-center">
							<Checkbox inputId="rememberMe" v-model="form.rememberMe" binary />
							<label for="rememberMe" class="cursor-pointer pl-2">
								{{ $t("common.inputs.rememberMe") }}
							</label>
						</div>

						<Button
							variant="link"
							:label="$t('common.actions.forgotPassword')"
							class="p-0!"
							:as="NuxtLink"
							:to="{ name: 'forgot-password' }" />
					</div>

					<Button :label="$t('common.actions.signIn')" fluid />
				</div>
			</form>

			<Divider>
				<p class="text-muted-color">{{ $t("common.social.divider") }}</p>
			</Divider>

			<div class="flex items-center gap-4">
				<Button
					:label="$t('common.social.google')"
					variant="outlined"
					severity="secondary"
					fluid>
					<template #icon>
						<Icon name="logos:google-icon" />
					</template>
				</Button>

				<Button
					:label="$t('common.social.github')"
					variant="outlined"
					severity="secondary"
					fluid>
					<template #icon>
						<Icon name="logos:github-icon" />
					</template>
				</Button>
			</div>

			<i18n-t keypath="login.signUpPrompt" tag="p" scope="global" class="mt-4 text-center">
				<template #signUp>
					<Button
						variant="link"
						:label="$t('common.actions.signUp')"
						class="p-0!"
						:as="NuxtLink"
						:to="{ name: 'register' }" />
				</template>
			</i18n-t>
		</template>
	</Card>

	<i18n-t keypath="login.agreementPrompt" tag="p" scope="global" class="mt-4 text-center text-sm">
		<template #terms>
			<Button
				:as="NuxtLink"
				:to="{ name: 'terms-of-service' }"
				:label="$t('common.pages.terms')"
				size="small"
				variant="link"
				class="p-0!" />
		</template>

		<template #privacy>
			<Button
				:as="NuxtLink"
				:to="{ name: 'privacy-policy' }"
				:label="$t('common.pages.privacy')"
				size="small"
				variant="link"
				class="p-0!" />
		</template>
	</i18n-t>
</template>

<script setup lang="ts">
	import { NuxtLink } from "#components";

	definePageMeta({
		layout: "auth",
	});

	const form = reactive<{
		email: string;
		password: string;
		rememberMe: boolean;
	}>({
		email: "",
		password: "",
		rememberMe: false,
	});
</script>
