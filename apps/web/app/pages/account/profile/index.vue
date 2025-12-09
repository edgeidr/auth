<template>
	<div class="space-y-4">
		<PersonalInformation />
		<AccountInformation />
	</div>
</template>

<script setup lang="ts">
	import AccountInformation from "./_components/account-information.vue";
	import PersonalInformation from "./_components/personal-information.vue";

	definePageMeta({
		layout: "account",
	});
</script>
