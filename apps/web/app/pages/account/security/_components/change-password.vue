<template>
	<Card>
		<template #title>{{ $t("account.security.changePassword.title") }}</template>

		<template #subtitle>{{ $t("account.security.changePassword.subtitle") }} </template>

		<template #content>
			<form id="personalInformation" class="space-y-4">
				<FloatLabel variant="in">
					<Password
						id="currentPassword"
						v-model="form.currentPassword"
						:feedback="false"
						fluid />
					<label for="currentPassword">
						{{ $t("common.inputs.currentPassword") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<Password
						id="newPassword"
						v-model="form.newPassword"
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
							<ul class="mt-1 mb-0 list-none text-sm leading-normal">
								<li
									v-for="(rule, index) in passwordRules"
									:key="index"
									class="flex items-center gap-1">
									<Icon name="radix-icons:dot-filled" />
									<span :class="{ 'text-green-500': rule.condition }">
										{{ rule.label }}
									</span>
								</li>
							</ul>
						</template>
					</Password>
					<label for="newPassword">
						{{ $t("common.inputs.newPassword") }}
					</label>
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
			</form>
		</template>

		<template #footer>
			<div class="flex gap-4">
				<Button
					type="submit"
					form="personalInformation"
					:label="$t('common.actions.save')" />
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	const { t } = useI18n();
	const form = reactive<{
		currentPassword: string;
		newPassword: string;
		confirmNewPassword: string;
	}>({
		currentPassword: "",
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
</script>
