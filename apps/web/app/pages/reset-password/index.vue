<template>
	<Card>
		<template #title>{{ $t("resetPassword.header.title") }}</template>

		<template #subtitle>{{ $t("resetPassword.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="onSubmit">
				<div class="space-y-4">
					<FloatLabel variant="in">
						<CustomPassword v-model="form.newPassword" id="newPassword" fluid />
						<label for="newPassword">{{ $t("common.inputs.newPassword") }}</label>
					</FloatLabel>

					<FloatLabel variant="in">
						<Password
							id="confirmNewPassword"
							v-model="form.confirmNewPassword"
							:feedback="false"
							fluid />
						<label for="confirmNewPassword">
							{{ $t("common.inputs.confirmNewPassword") }}
						</label>
					</FloatLabel>

					<Button type="submit" :label="$t('common.actions.resetPassword')" fluid />
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

	const { t } = useI18n();
	const resetPasswordEmail = useState<string | null>("resetPasswordEmail");
	const resetPasswordToken = useState<string | null>("resetPasswordToken");
	const form = reactive<{
		newPassword: string;
		confirmNewPassword: string;
	}>({
		newPassword: "",
		confirmNewPassword: "",
	});

	const passwordRules = ref([
		{
			label: t("common.passwordRules.requireUppercase"),
			condition: computed(() => hasUppercase.value),
		},
		{
			label: t("common.passwordRules.requireLowercase"),
			condition: computed(() => hasLowercase.value),
		},
		{
			label: t("common.passwordRules.requireNumber"),
			condition: computed(() => hasNumber.value),
		},
		{
			label: t("common.passwordRules.requireSymbol"),
			condition: computed(() => hasSymbol.value),
		},
		{
			label: t("common.passwordRules.requireMinCharacters"),
			condition: computed(() => hasMinLength.value),
		},
	]);

	const hasUppercase = computed(() => /[A-Z]/.test(form.newPassword));
	const hasLowercase = computed(() => /[a-z]/.test(form.newPassword));
	const hasNumber = computed(() => /[0-9]/.test(form.newPassword));
	const hasSymbol = computed(() => /[^a-zA-Z0-9]/.test(form.newPassword));
	const hasMinLength = computed(() => form.newPassword.length >= 8);

	const onSubmit = () => {
		navigateTo("/login");
	};

	onUnmounted(() => {
		resetPasswordEmail.value = null;
		resetPasswordToken.value = null;
	});
</script>
