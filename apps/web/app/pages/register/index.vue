<template>
	<Card>
		<template #title>{{ $t("register.header.title") }}</template>

		<template #subtitle>{{ $t("register.header.subtitle") }}</template>

		<template #content>
			<form class="mt-4">
				<div class="space-y-4">
					<FloatLabel variant="in">
						<InputText id="firstName" v-model="form.firstName" fluid />
						<label for="firstName">{{ $t("register.form.firstName") }}</label>
					</FloatLabel>

					<FloatLabel variant="in">
						<InputText id="lastName" v-model="form.lastName" fluid />
						<label for="lastName">{{ $t("register.form.lastName") }}</label>
					</FloatLabel>

					<FloatLabel variant="in">
						<InputText id="email" v-model="form.email" type="email" fluid />
						<label for="email">{{ $t("register.form.email") }}</label>
					</FloatLabel>

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
						<label for="password">{{ $t("register.form.password") }}</label>
					</FloatLabel>

					<FloatLabel variant="in">
						<Password
							id="confirmPassword"
							v-model="form.confirmPassword"
							:feedback="false"
							fluid />
						<label for="confirmPassword">
							{{ $t("register.form.confirmPassword") }}
						</label>
					</FloatLabel>

					<div class="flex items-center">
						<Checkbox inputId="agreement" v-model="form.agreement" binary />
						<label for="agreement" class="cursor-pointer pl-2">
							<I18nT keypath="register.form.agreement" tag="p" scope="global">
								<template #terms>
									<Button
										:label="$t('common.termsOfService')"
										variant="link"
										class="p-0!" />
								</template>

								<template #privacy>
									<Button
										:label="$t('common.privacyPolicy')"
										variant="link"
										class="p-0!" />
								</template>
							</I18nT>
						</label>
					</div>

					<Button :label="$t('register.actions.signUp')" fluid />
				</div>
			</form>

			<Divider>
				<p class="text-muted-color">{{ $t("common.social.divider") }}</p>
			</Divider>

			<div class="flex items-center gap-4">
				<Button
					:label="$t('common.social.google')"
					variant="outlined"
					severity="secondary"
					fluid>
					<template #icon>
						<Icon name="logos:google-icon" />
					</template>
				</Button>

				<Button
					:label="$t('common.social.github')"
					variant="outlined"
					severity="secondary"
					fluid>
					<template #icon>
						<Icon name="logos:github-icon" />
					</template>
				</Button>
			</div>

			<I18nT
				keypath="register.actions.signIn.full"
				tag="p"
				scope="global"
				class="mt-4 text-center">
				<template #link>
					<Button
						variant="link"
						:label="$t('register.actions.signIn.link')"
						class="p-0!"
						:as="NuxtLink"
						:to="{ name: 'login' }" />
				</template>
			</I18nT>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import { NuxtLink } from "#components";

	definePageMeta({
		layout: "auth",
	});

	const { t } = useI18n();
	const form = reactive<{
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		confirmPassword: string;
		agreement: boolean;
	}>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreement: false,
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
</script>
