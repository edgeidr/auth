<template>
	<Card>
		<template #title>{{ $t("account.profile.personalInformation.title") }}</template>

		<template #subtitle>{{ $t("account.profile.personalInformation.subtitle") }} </template>

		<template #content>
			<form id="personalInformation" class="space-y-4">
				<FloatLabel variant="in">
					<InputText name="firstName" fluid />
					<label for="firstName">
						{{ $t("account.profile.personalInformation.form.firstName") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<InputText name="lastName" fluid />
					<label for="lastName">
						{{ $t("account.profile.personalInformation.form.lastName") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<InputText name="email" type="email" fluid />
					<label for="email">
						{{ $t("account.profile.personalInformation.form.email") }}
					</label>
				</FloatLabel>

				<FloatLabel variant="in">
					<InputMask
						name="phone"
						mask="9999-9999-999"
						placeholder="____-____-___"
						fluid />
					<label for="phone">
						{{ $t("account.profile.personalInformation.form.phone") }}
					</label>
				</FloatLabel>
			</form>
		</template>

		<template #footer>
			<div class="flex gap-4">
				<Button
					type="submit"
					form="personalInformation"
					:label="$t('account.profile.personalInformation.actions.save')" />
				<Button
					:label="$t('account.profile.personalInformation.actions.cancel')"
					severity="secondary" />
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts"></script>
