<template>
	<div class="space-y-4">
		<ChangePassword />
		<ActiveSessions />
		<RecentActivity />
	</div>
</template>

<script setup lang="ts">
	import ChangePassword from "./_components/change-password.vue";
	import ActiveSessions from "./_components/active-sessions.vue";
	import RecentActivity from "./_components/recent-activity.vue";

	definePageMeta({
		layout: "account",
	});
</script>
