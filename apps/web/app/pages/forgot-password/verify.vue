<template>
	<Card>
		<template #title>{{ $t("forgotPasswordVerify.header.title") }}</template>

		<template #subtitle>
			{{ $t("forgotPasswordVerify.header.subtitle", { email: forgotPasswordEmail }) }}
		</template>

		<template #content>
			<div class="space-y-4 text-center">
				<div class="bg-primary-50 mx-auto flex w-fit rounded-full p-4 text-2xl">
					<Icon :name="Icons.key" />
				</div>

				<p>{{ codeTimerLabel }}</p>

				<form>
					<div class="flex flex-col items-center space-y-4">
						<div>
							<InputOtp
								v-model="form.code"
								:length="OTP_LENGTH"
								@change="clearError('code')"
								:invalid="hasError('code')"
								:disabled="pendingVerify"
								integerOnly
								fluid />
							<FieldError :error="getError('code')" class="flex justify-center" />
						</div>
					</div>
				</form>

				<i18n-t
					keypath="forgotPasswordVerify.help.full"
					tag="p"
					class="mt-4 text-center"
					scope="global">
					<template #resend>
						<Button
							:label="resendLabel"
							class="p-0!"
							@click="onResend()"
							:disabled="!!resendTimer || pendingResend"
							:loading="pendingResend"
							iconPos="right"
							variant="link" />
					</template>
				</i18n-t>
			</div>

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
	import { OtpType } from "@repo/shared";

	definePageMeta({
		layout: "auth",
		middleware: ["require-forgot-password-email"],
	});

	const { t } = useI18n();
	const config = useRuntimeConfig();
	const forgotPasswordEmail = useState<string | null>("forgotPasswordEmail");
	const forgotPasswordCodeExpiry = useState<Date | null>("forgotPasswordCodeExpiry");
	const resetPasswordEmail = useState<string | null>("resetPasswordEmail");
	const resetPasswordToken = useState<string | null>("resetPasswordToken");
	const resendExpiry = ref<Date | null>(null);
	const OTP_LENGTH = config.public.otpLength;
	const RESEND_DURATION = 30;
	const codeTimer = useCountdownTimer(forgotPasswordCodeExpiry, "mm:ss");
	const resendTimer = useCountdownTimer(resendExpiry, "s");
	const { form, getError, setErrors, clearError, hasError } = useForm({
		code: "",
		email: forgotPasswordEmail.value,
		type: OtpType.FORGOT_PASSWORD,
	});

	const { execute: onResend, pending: pendingResend } = useCustomFetch("/auth/forgot-password", {
		method: "POST",
		body: {
			email: form.email,
		},
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { expiresAt } = response._data as { expiresAt: string };

			forgotPasswordCodeExpiry.value = new Date(expiresAt);
			resendExpiry.value = new Date(Date.now() + RESEND_DURATION * 1000);
		},
	});

	const { execute: onVerify, pending: pendingVerify } = useCustomFetch("/otps/verify", {
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { value } = response._data as { value: string };

			resetPasswordEmail.value = forgotPasswordEmail.value;
			resetPasswordToken.value = value;

			navigateTo("/reset-password");
		},
		onResponseError: ({ response }) => {
			const { message } = response._data as { message: any };

			if (message && Array.isArray(message)) setErrors(message);
		},
	});

	const codeTimerLabel = computed(() => {
		if (!codeTimer.value) return t("forgotPasswordVerify.code.expired");

		return t("forgotPasswordVerify.code.expiresIn", { expiry: codeTimer.value });
	});

	const resendLabel = computed(() => {
		const timer = resendTimer.value ? `(${resendTimer.value}s)` : null;

		return t("common.actions.resend", { timer });
	});

	onUnmounted(() => {
		forgotPasswordEmail.value = null;
	});

	watch(
		() => form.code,
		(code) => {
			if (code.length === OTP_LENGTH) onVerify();
		},
	);
</script>
