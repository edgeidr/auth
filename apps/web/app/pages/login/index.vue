<template>
	<Card>
		<template #title>{{ $t("login.header.title") }}</template>

		<template #subtitle>{{ $t("login.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="login()">
				<div class="space-y-4">
					<div>
						<FloatLabel variant="in">
							<InputText
								v-model="form.email"
								inputmode="email"
								id="email"
								:invalid="hasError('email')"
								@input="clearError('email')"
								required
								fluid />
							<label for="email">{{ $t("common.inputs.email") }}</label>
						</FloatLabel>
						<FieldError :error="getError('email')" />
					</div>

					<div>
						<FloatLabel variant="in">
							<Password
								v-model="form.password"
								:invalid="hasError('password')"
								id="password"
								:feedback="false"
								toggleMask
								@input="clearError('password')"
								required
								fluid />
							<label for="password">{{ $t("common.inputs.password") }}</label>
						</FloatLabel>
						<FieldError :error="getError('password')" />
					</div>

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
							to="/forgot-password" />
					</div>

					<Button
						type="submit"
						:label="$t('common.actions.signIn')"
						:loading="pending"
						fluid />
				</div>
			</form>

			<Divider>
				<p class="text-muted-color">{{ $t("common.social.divider") }}</p>
			</Divider>

			<div class="flex items-center gap-4">
				<Button
					:label="$t('common.social.google')"
					:as="NuxtLink"
					variant="outlined"
					severity="secondary"
					:href="config.public.googleAuthUrl"
					external
					fluid>
					<template #icon>
						<Icon :name="Icons.googleLogo" />
					</template>
				</Button>

				<Button
					:label="$t('common.social.github')"
					:as="NuxtLink"
					variant="outlined"
					severity="secondary"
					:href="config.public.githubAuthUrl"
					external
					fluid>
					<template #icon>
						<Icon :name="Icons.githubLogo" />
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
						to="/register" />
				</template>
			</i18n-t>
		</template>
	</Card>

	<i18n-t keypath="login.agreementPrompt" tag="p" scope="global" class="mt-4 text-center text-sm">
		<template #terms>
			<Button
				:as="NuxtLink"
				to="/terms-of-service"
				:label="$t('common.pages.terms')"
				size="small"
				variant="link"
				class="p-0!" />
		</template>

		<template #privacy>
			<Button
				:as="NuxtLink"
				to="/privacy-policy"
				:label="$t('common.pages.privacy')"
				size="small"
				variant="link"
				class="p-0!" />
		</template>
	</i18n-t>
</template>

<script setup lang="ts">
	import { NuxtLink } from "#components";
	import { Icons } from "@repo/assets";
	import { Access } from "@repo/shared";

	definePageMeta({
		layout: "auth",
		access: [Access.GUEST],
	});

	const config = useRuntimeConfig();
	const { form, setErrors, hasError, clearError, getError } = useForm({
		email: "",
		password: "",
		rememberMe: false,
	});

	const { execute: login, pending } = useCustomFetch("/auth/login", {
		method: "POST",
		body: form,
		onResponseError: async ({ response }) => {
			const { message } = response._data as { message: any };

			if (message && Array.isArray(message)) setErrors(message);
		},
	});
</script>
