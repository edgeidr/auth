<template>
	<Card>
		<template #title>{{ $t("account.profile.accountInformation.title") }}</template>

		<template #subtitle>{{ $t("account.profile.accountInformation.subtitle") }} </template>

		<template #content>
			<div class="space-y-4">
				<div>
					<label class="text-muted-color text-sm">
						{{ $t("account.profile.accountInformation.labels.accountId") }}
					</label>
					<InputText :value="user?.publicId" class="w-full" disabled unstyled />
				</div>

				<div>
					<label class="text-muted-color text-sm">
						{{ $t("account.profile.accountInformation.labels.status") }}
					</label>
					<InputText
						:value="status"
						:class="{ 'text-red-500': !user?.isActive }"
						class="w-full"
						disabled
						unstyled />
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	const { user } = useCurrentUser();

	const status = computed(() => (user.value?.isActive ? "Active" : "Inactive"));
</script>
