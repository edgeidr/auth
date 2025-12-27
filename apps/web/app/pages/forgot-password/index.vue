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
					:label="$t('common.actions.backToLogin')"
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

	definePageMeta({
		layout: "auth",
	});

	const forgotPasswordEmail = useState<string | null>("forgotPasswordEmail");
	const forgotPasswordCodeExpiry = useState<Date | null>("forgotPasswordCodeExpiry");
	const { form, setErrors, getError, clearError } = useForm({
		email: "",
	});

	const { execute: onSubmit, pending } = useCustomFetch("/auth/forgot-password", {
		method: "POST",
		body: form,
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { expiresAt } = response._data as { expiresAt: string };

			forgotPasswordEmail.value = form.email;
			forgotPasswordCodeExpiry.value = new Date(expiresAt);

			navigateTo("/forgot-password/verify");
		},
		onResponseError: ({ response }) => {
			const { message } = response._data as { message: any };

			if (message && Array.isArray(message)) setErrors(message);
		},
	});
</script>
