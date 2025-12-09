<template>
	<Card>
		<template #title>{{ $t("account.profile.accountInformation.title") }}</template>

		<template #subtitle>{{ $t("account.profile.accountInformation.subtitle") }} </template>

		<template #content>
			<div class="columns-2 space-y-4">
				<div>
					<label class="text-muted-color text-sm">
						{{ $t("account.profile.accountInformation.labels.accountId") }}
					</label>
					<InputText v-model="data.accountId" class="w-full" disabled unstyled />
				</div>

				<div>
					<label class="text-muted-color text-sm">
						{{ $t("account.profile.accountInformation.labels.createdAt") }}
					</label>
					<InputText v-model="data.createdAt" class="w-full" disabled unstyled />
				</div>

				<div>
					<label class="text-muted-color text-sm">
						{{ $t("account.profile.accountInformation.labels.status") }}
					</label>
					<InputText v-model="data.status" class="w-full" disabled unstyled />
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	const data = reactive({
		accountId: "usr_2kN5xPq9M1LbFg",
		createdAt: "January 15, 2024",
		status: "Active",
	});
</script>
