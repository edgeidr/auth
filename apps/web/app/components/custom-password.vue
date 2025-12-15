<template>
	<Password
		v-model="model"
		:promptLabel="' '"
		:weakLabel="' '"
		:mediumLabel="' '"
		:strongLabel="' '"
		strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})"
		v-bind="$attrs">
		<template #footer>
			<span class="text-sm">
				{{ $t("common.passwordRules.feedbackLabel") }}
			</span>

			<ul class="mt-1 mb-0 list-disc pl-5 text-sm leading-normal">
				<li v-for="(rule, index) in rules" :key="index">
					<span :class="{ 'text-green-500': rule.condition }">
						{{ rule.label }}
					</span>
				</li>
			</ul>
		</template>
	</Password>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	const model = defineModel({ default: "" });

	const { t } = useI18n();
	const rules = ref([
		{
			label: t("common.passwordRules.requireUppercase"),
			condition: computed(() => hasUppercase.value),
		},
		{
			label: t("common.passwordRules.requireLowercase"),
			condition: computed(() => hasLowercase.value),
		},
		{
			label: t("common.passwordRules.requireNumber"),
			condition: computed(() => hasNumber.value),
		},
		{
			label: t("common.passwordRules.requireSymbol"),
			condition: computed(() => hasSymbol.value),
		},
		{
			label: t("common.passwordRules.requireMinCharacters"),
			condition: computed(() => hasMinLength.value),
		},
	]);

	const hasUppercase = computed(() => /[A-Z]/.test(model.value));
	const hasLowercase = computed(() => /[a-z]/.test(model.value));
	const hasNumber = computed(() => /[0-9]/.test(model.value));
	const hasSymbol = computed(() => /[^a-zA-Z0-9]/.test(model.value));
	const hasMinLength = computed(() => model.value.length >= 8);
</script>
