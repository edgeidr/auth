<template>
	<Card>
		<template #title>{{ $t("resetPassword.header.title") }}</template>

		<template #subtitle>{{ $t("resetPassword.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="onSubmit()">
				<div class="space-y-4">
					<div>
						<FloatLabel variant="in">
							<CustomPassword
								v-model="form.newPassword"
								id="newPassword"
								:invalid="hasError('newPassword')"
								@input="clearError('newPassword')"
								required
								fluid />
							<label for="newPassword">{{ $t("common.inputs.newPassword") }}</label>
						</FloatLabel>
						<FieldError :error="getError('newPassword')" />
					</div>

					<div>
						<FloatLabel variant="in">
							<Password
								id="confirmNewPassword"
								v-model="form.confirmNewPassword"
								:invalid="hasError('confirmNewPassword')"
								@input="clearError('confirmNewPassword')"
								:feedback="false"
								required
								fluid />
							<label for="confirmNewPassword">
								{{ $t("common.inputs.confirmNewPassword") }}
							</label>
						</FloatLabel>
						<FieldError :error="getError('confirmNewPassword')" />
					</div>

					<Button
						type="submit"
						:label="$t('common.actions.resetPassword')"
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
		middleware: ["require-reset-password-credentials"],
	});

	const toast = useToast();
	const { t } = useI18n();
	const resetPasswordEmail = useState<string | null>("resetPasswordEmail");
	const resetPasswordToken = useState<string | null>("resetPasswordToken");
	const { form, setErrors, hasError, getError, clearError } = useForm({
		email: resetPasswordEmail.value,
		token: resetPasswordToken.value,
		newPassword: "",
		confirmNewPassword: "",
	});

	const { execute: onSubmit, pending } = useCustomFetch("/auth/reset-password", {
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

	onUnmounted(() => {
		resetPasswordEmail.value = null;
		resetPasswordToken.value = null;
	});
</script>
