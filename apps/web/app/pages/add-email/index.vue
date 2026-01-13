<template>
	<Card>
		<template #title>{{ $t("addEmail.header.title") }}</template>

		<template #subtitle>{{ $t("addEmail.header.subtitle") }}</template>

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
						:label="$t('common.actions.save')"
						:loading="pending"
						fluid />
				</div>
			</form>

			<div class="mt-4 text-center">
				<Button
					:label="$t('common.actions.backTo', { page: 'Home' })"
					variant="link"
					:as="NuxtLink"
					to="/"
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
		access: [Access.AUTHENTICATED],
	});

	const route = useRoute();
	const toast = useToast();
	const { getCurrentUser } = useCurrentUser();
	const { t } = useI18n();
	const { form, setErrors, getError, clearError } = useForm({
		token: route.query.token,
		tokenId: route.query.tokenId,
		email: "",
	});

	const { execute: onSubmit, pending } = useCustomFetch("/auth/email/add", {
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { message } = response._data as { message: string };

			await getCurrentUser();
			await navigateTo("/");

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
