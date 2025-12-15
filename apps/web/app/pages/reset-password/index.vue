<template>
	<Card>
		<template #title>{{ $t("resetPassword.header.title") }}</template>

		<template #subtitle>{{ $t("resetPassword.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="onSubmit">
				<div class="space-y-4">
					<FloatLabel variant="in">
						<Password
							id="password"
							v-model="form.password"
							:promptLabel="' '"
							:weakLabel="' '"
							:mediumLabel="' '"
							:strongLabel="' '"
							strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})"
							fluid>
							<template #footer>
								<span class="text-sm">
									{{ $t("common.passwordRules.feedbackLabel") }}
								</span>
								<ul class="mt-1 mb-0 list-disc pl-5 text-sm leading-normal">
									<li v-for="(rule, index) in passwordRules" :key="index">
										<span :class="{ 'text-green-500': rule.condition }">
											{{ rule.label }}
										</span>
									</li>
								</ul>
							</template>
						</Password>
						<label for="password">{{ $t("common.inputs.newPassword") }}</label>
					</FloatLabel>

					<FloatLabel variant="in">
						<Password
							id="confirmPassword"
							v-model="form.confirmPassword"
							:feedback="false"
							fluid />
						<label for="confirmPassword">
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
					:to="{ name: 'login' }"
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
		password: string;
		confirmPassword: string;
	}>({
		password: "",
		confirmPassword: "",
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

	const hasUppercase = computed(() => /[A-Z]/.test(form.password));
	const hasLowercase = computed(() => /[a-z]/.test(form.password));
	const hasNumber = computed(() => /[0-9]/.test(form.password));
	const hasSymbol = computed(() => /[^a-zA-Z0-9]/.test(form.password));
	const hasMinLength = computed(() => form.password.length >= 8);

	const onSubmit = () => {
		navigateTo({ name: "login" });
	};

	onUnmounted(() => {
		resetPasswordEmail.value = null;
		resetPasswordToken.value = null;
	});
</script>
