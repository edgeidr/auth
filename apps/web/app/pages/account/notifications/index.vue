<template>
	<div class="space-y-4">
		<CommunicationChannels />
		<SecurityAlerts />
		<AccountActivity />
	</div>
</template>

<script setup lang="ts">
	import CommunicationChannels from "./_components/communication-channels.vue";
	import SecurityAlerts from "./_components/security-alerts.vue";
	import AccountActivity from "./_components/account-activity.vue";

	definePageMeta({
		layout: "account",
	});
</script>
