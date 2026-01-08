<template>
	<Card>
		<template #title>{{ $t("account.profile.personalInformation.title") }}</template>

		<template #subtitle>{{ $t("account.profile.personalInformation.subtitle") }} </template>

		<template #content>
			<form @submit.prevent="onSubmit()" id="personalInformation" class="space-y-4">
				<div>
					<FloatLabel variant="in">
						<InputText
							v-model="form.firstName"
							:invalid="hasError('firstName')"
							@input="clearError('firstName')"
							name="firstName"
							required
							fluid />
						<label for="firstName">
							{{ $t("common.inputs.firstName") }}
						</label>
					</FloatLabel>
					<FieldError :error="getError('firstName')" />
				</div>

				<div>
					<FloatLabel variant="in">
						<InputText
							v-model="form.lastName"
							name="lastName"
							:invalid="hasError('lastName')"
							@input="clearError('lastName')"
							required
							fluid />
						<label for="lastName">
							{{ $t("common.inputs.lastName") }}
						</label>
					</FloatLabel>
					<FieldError :error="getError('lastName')" />
				</div>
			</form>
		</template>

		<template #footer>
			<div class="flex justify-end gap-4">
				<Button
					label="Reset"
					@click="resetForm()"
					:disabled="!hasChanged"
					severity="secondary" />

				<Button
					type="submit"
					form="personalInformation"
					:loading="pending"
					:disabled="!hasChanged"
					:label="$t('common.actions.save')" />
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	const toast = useToast();
	const config = useRuntimeConfig();
	const { t } = useI18n();
	const { user, getCurrentUser } = useCurrentUser();
	const { form, getError, hasError, clearError, resetForm, hasChanged, reinitialize } = useForm({
		firstName: user.value?.userProfile?.firstName,
		lastName: user.value?.userProfile?.lastName,
	});

	const { execute: onSubmit, pending } = useCustomFetch("/users/me/profile", {
		method: "PATCH",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { message } = response._data as { message: string };

			await getCurrentUser();
			reinitialize();

			toast.add({
				summary: t("common.status.success"),
				detail: t(message),
				severity: "success",
				life: config.public.toastLife,
			});
		},
	});
</script>
