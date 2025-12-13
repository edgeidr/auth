<template>
	<Card>
		<template #title>{{ $t("account.profile.personalInformation.title") }}</template>

		<template #subtitle>{{ $t("account.profile.personalInformation.subtitle") }} </template>

		<template #content>
			<form id="personalInformation" class="space-y-4">
				<FloatLabel variant="in">
					<InputText name="firstName" fluid />
					<label for="firstName">
						{{ $t("common.inputs.firstName") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<InputText name="lastName" fluid />
					<label for="lastName">
						{{ $t("common.inputs.lastName") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<InputText name="email" type="email" fluid />
					<label for="email">
						{{ $t("common.inputs.email") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<InputMask
						name="phone"
						mask="9999-9999-999"
						placeholder="____-____-___"
						fluid />
					<label for="phone">
						{{ $t("common.inputs.phone") }}
					</label>
				</FloatLabel>
			</form>
		</template>

		<template #footer>
			<div class="flex gap-4">
				<Button
					type="submit"
					form="personalInformation"
					:label="$t('common.actions.save')" />
				<Button :label="$t('common.actions.cancel')" severity="secondary" />
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts"></script>
