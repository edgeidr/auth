<template>
	<div class="flex min-h-screen items-center justify-center">
		<div class="container max-w-xl py-8">
			<div class="mb-4 flex items-center justify-center">
				<img :src="Images.TransparentLogo" alt="logo" class="max-w-20" />
			</div>

			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { Images } from "@repo/assets";
</script>
