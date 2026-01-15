<template>
	<Card>
		<template #title>{{ $t("verifyOtp.header.title") }}</template>

		<template #subtitle>
			{{ $t("verifyOtp.header.subtitle") }}
		</template>

		<template #content>
			<div class="space-y-4 text-center">
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
					keypath="verifyOtp.help.full"
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
					:label="$t('common.actions.backTo', { page: hasUser ? 'Home' : 'Login' })"
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
	import { Access } from "@repo/shared";

	definePageMeta({
		layout: "auth",
		access: [Access.AUTHENTICATED, Access.GUEST],
	});

	const { hasUser, getCurrentUser } = useCurrentUser();
	const { t } = useI18n();
	const toast = useToast();
	const config = useRuntimeConfig();
	const route = useRoute();
	const resendExpiry = ref<Date | null>(null);
	const OTP_LENGTH = config.public.otpLength;
	const RESEND_DURATION = 30;
	const resendTimer = useCountdownTimer(resendExpiry, "s");
	const { form, getError, setErrors, clearError, hasError } = useForm({
		code: "",
		token: route.query.token,
	});

	const { execute: onResend, pending: pendingResend } = useCustomFetch("/otps/resend", {
		method: "POST",
		body: { token: route.query.token },
		onResponse: ({ response }) => {
			if (!response.ok) return;

			resendExpiry.value = new Date(Date.now() + RESEND_DURATION * 1000);
		},
	});

	const { execute: onVerify, pending: pendingVerify } = useCustomFetch("/otps/verify", {
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { nextStep, refreshUser, message } = response._data as {
				nextStep: string;
				refreshUser?: boolean;
				message?: string;
			};

			if (refreshUser) await getCurrentUser();

			if (message) {
				toast.add({
					summary: t("common.status.success"),
					detail: t(message),
					severity: "success",
					life: config.public.toastLife,
				});
			}

			await navigateTo(nextStep, { replace: true });
		},
		onResponseError: ({ response }) => {
			const { message } = response._data as { message: any };

			if (message && Array.isArray(message)) setErrors(message);
		},
	});

	const resendLabel = computed(() => {
		const timer = resendTimer.value ? `(${resendTimer.value}s)` : null;

		return t("common.actions.resend", { timer });
	});

	watch(
		() => form.code,
		(code) => {
			if (code.length === OTP_LENGTH) onVerify();
		},
	);
</script>
