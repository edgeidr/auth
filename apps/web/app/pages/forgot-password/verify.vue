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
						<InputOtp v-model="form.code" :length="OTP_LENGTH" integerOnly fluid />
					</div>
				</form>

				<I18nT
					keypath="forgotPasswordVerify.help.full"
					tag="p"
					class="mt-4 text-center"
					scope="global">
					<template #resend>
						<Button
							:label="resendLabel"
							class="p-0!"
							@click="onResend"
							:disabled="!!resendTimer"
							variant="link" />
					</template>
				</I18nT>
			</div>

			<div class="mt-4 text-center">
				<Button
					:label="$t('forgotPasswordVerify.actions.login')"
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
		middleware: ["require-forgot-password-email"],
	});

	const { t } = useI18n();
	const forgotPasswordEmail = useState<string | null>("forgotPasswordEmail");
	const resetPasswordEmail = useState<string | null>("resetPasswordEmail");
	const resetPasswordToken = useState<string | null>("resetPasswordToken");
	const codeExpiry = ref<Date | null>(null);
	const resendExpiry = ref<Date | null>(null);
	const OTP_LENGTH = 6;
	const RESEND_DURATION = 30;
	const codeTimer = useCountdownTimer(codeExpiry, "mm:ss");
	const resendTimer = useCountdownTimer(resendExpiry, "s");
	const form = reactive<{
		code: string;
	}>({
		code: "",
	});

	const codeTimerLabel = computed(() => {
		if (!codeTimer.value) return t("forgotPasswordVerify.code.expired");

		return t("forgotPasswordVerify.code.expiresIn", { expiry: codeTimer.value });
	});

	const resendLabel = computed(() => {
		const timer = resendTimer.value ? `(${resendTimer.value}s)` : null;

		return t("forgotPasswordVerify.help.resend", { timer });
	});

	const resetCodeTimer = () => {
		codeExpiry.value = new Date(Date.now() + useRuntimeConfig().public.otpDuration * 1000);
	};

	const onResend = () => {
		resendExpiry.value = new Date(Date.now() + RESEND_DURATION * 1000);
		resetCodeTimer();
	};

	const onSubmit = () => {
		resetPasswordEmail.value = forgotPasswordEmail.value;
		resetPasswordToken.value = "abc123";
		navigateTo({ name: "reset-password" });
	};

	onMounted(() => {
		resetCodeTimer();
	});

	onUnmounted(() => {
		forgotPasswordEmail.value = null;
	});

	watch(
		() => form.code,
		(code) => {
			if (code.length === OTP_LENGTH) {
				onSubmit();
			}
		},
	);
</script>
