<template>
	<Card>
		<template #title>{{ $t("forgotPassword.header.title") }}</template>

		<template #subtitle>{{ $t("forgotPassword.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="onSubmit()">
				<div class="space-y-4">
					<div>
						<FloatLabel variant="in">
							<InputText
								id="email"
								v-model="form.email"
								inputmode="email"
								@input="clearError('email')"
								required
								fluid />
							<label for="email">{{ $t("common.inputs.email") }}</label>
						</FloatLabel>
						<FieldError :error="getError('email')" />
					</div>

					<Button
						type="submit"
						:label="$t('common.actions.sendCode')"
						:loading="pending"
						fluid />
				</div>
			</form>

			<div class="mt-4 text-center">
				<Button
					:label="$t('common.actions.backTo', { page: 'Login' })"
					variant="link"
					:as="NuxtLink"
					to="/login"
					class="p-0!">
					<template #icon="slotProps">
						<Icon :name="Icons.left" :class="slotProps.class" />
					</template>
				</Button>
			</div>
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

	const route = useRoute();
	const { form, setErrors, getError, clearError } = useForm({
		token: route.query.token,
		email: "",
	});

	const { execute: onSubmit, pending } = useCustomFetch("/auth/password/reset/request", {
		method: "POST",
		body: form,
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { token } = response._data as { token: string };

			navigateTo(`/verify-otp?token=${token}`);
		},
		onResponseError: ({ response }) => {
			const { message } = response._data as { message: any };

			if (message && Array.isArray(message)) setErrors(message);
		},
	});
</script>
