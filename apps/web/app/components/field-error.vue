<template>
	<div v-if="error?.length" class="mt-1">
		<Message
			v-for="(message, index) in error"
			:key="index"
			severity="error"
			variant="simple"
			size="small">
			{{ message }}
		</Message>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps<{
		error: string[] | null;
	}>();
</script>
