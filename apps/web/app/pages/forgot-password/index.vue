<template>
	<Card>
		<template #title>{{ $t("forgotPassword.header.title") }}</template>

		<template #subtitle>{{ $t("forgotPassword.header.subtitle") }}</template>

		<template #content>
			<form @submit.prevent="onSubmit">
				<div class="space-y-4">
					<FloatLabel variant="in">
						<InputText id="email" v-model="form.email" type="email" fluid />
						<label for="email">{{ $t("forgotPassword.form.email") }}</label>
					</FloatLabel>

					<Button type="submit" :label="$t('forgotPassword.actions.send')" fluid />
				</div>
			</form>

			<div class="mt-4 text-center">
				<Button
					:label="$t('forgotPassword.actions.login')"
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
	});

	const forgotPasswordEmail = useState<string | null>("forgotPasswordEmail");
	const form = reactive<{
		email: string;
	}>({
		email: "",
	});

	const onSubmit = () => {
		forgotPasswordEmail.value = form.email;
		navigateTo({ name: "forgot-password-verify" });
	};
</script>
