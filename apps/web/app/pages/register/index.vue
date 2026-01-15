<template>
	<Card>
		<template #title>{{ $t("register.header.title") }}</template>

		<template #subtitle>{{ $t("register.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="register()">
				<div class="space-y-4">
					<div>
						<FloatLabel variant="in">
							<InputText
								id="firstName"
								v-model="form.firstName"
								:invalid="hasError('firstName')"
								@input="clearError('firstName')"
								required
								fluid />
							<label for="firstName">{{ $t("common.inputs.firstName") }}</label>
						</FloatLabel>
						<FieldError :error="getError('firstName')" />
					</div>

					<div>
						<FloatLabel variant="in">
							<InputText
								id="lastName"
								v-model="form.lastName"
								:invalid="hasError('lastName')"
								@input="clearError('lastName')"
								required
								fluid />
							<label for="lastName">{{ $t("common.inputs.lastName") }}</label>
						</FloatLabel>
						<FieldError :error="getError('lastName')" />
					</div>

					<div>
						<FloatLabel variant="in">
							<InputText
								id="email"
								v-model="form.email"
								inputmode="email"
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
							<CustomPassword
								v-model="form.password"
								id="password"
								:invalid="hasError('password')"
								@input="clearError('password')"
								fluid />
							<label for="password">{{ $t("common.inputs.password") }}</label>
						</FloatLabel>
						<FieldError :error="getError('password')" />
					</div>

					<div>
						<FloatLabel variant="in">
							<Password
								id="confirmPassword"
								v-model="form.confirmPassword"
								:feedback="false"
								:invalid="hasError('confirmPassword')"
								@input="clearError('confirmPassword')"
								required
								fluid />
							<label for="confirmPassword">
								{{ $t("common.inputs.confirmPassword") }}
							</label>
						</FloatLabel>
						<FieldError :error="getError('confirmPassword')" />
					</div>

					<div>
						<div class="flex items-center">
							<Checkbox
								inputId="agreement"
								v-model="form.agreement"
								:invalid="hasError('agreement')"
								@change="clearError('agreement')"
								required
								binary />
							<label for="agreement" class="cursor-pointer pl-2">
								<i18n-t keypath="register.agreementPrompt" tag="p" scope="global">
									<template #terms>
										<Button
											:as="NuxtLink"
											to="/terms-of-service"
											:label="$t('common.pages.terms')"
											variant="link"
											class="p-0!" />
									</template>

									<template #privacy>
										<Button
											:as="NuxtLink"
											to="/privacy-policy"
											:label="$t('common.pages.privacy')"
											variant="link"
											class="p-0!" />
									</template>
								</i18n-t>
							</label>
						</div>
						<FieldError :error="getError('agreement')" />
					</div>

					<Button
						type="submit"
						:label="$t('common.actions.signUp')"
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

			<i18n-t keypath="register.signInPrompt" tag="p" scope="global" class="mt-4 text-center">
				<template #signIn>
					<Button
						variant="link"
						:label="$t('common.actions.signIn')"
						class="p-0!"
						:as="NuxtLink"
						to="/login" />
				</template>
			</i18n-t>
		</template>
	</Card>
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
	const toast = useToast();
	const { t } = useI18n();
	const { form, clearError, getError, hasError, setErrors } = useForm({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreement: false,
	});

	const { execute: register, pending } = useCustomFetch("/auth/register", {
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { message } = response._data as { message: string };

			await navigateTo("/login");

			toast.add({
				summary: t("common.status.success"),
				detail: t(message),
				severity: "success",
				life: useRuntimeConfig().public.toastLife,
			});
		},
		onResponseError: ({ response }) => {
			const { message } = response._data as { message: any };

			if (message && Array.isArray(message)) setErrors(message);
		},
	});
</script>
