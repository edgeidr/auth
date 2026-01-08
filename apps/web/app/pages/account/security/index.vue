<template>
	<div class="space-y-4">
		<EmailAddress />
		<Password />
		<SocialAccounts />
	</div>
</template>

<script setup lang="ts">
	import EmailAddress from "./_components/email-address.vue";
	import Password from "./_components/password.vue";
	import SocialAccounts from "./_components/social-accounts.vue";
	import { Access } from "@repo/shared";

	definePageMeta({
		layout: "account",
		access: [Access.AUTHENTICATED],
	});
</script>
