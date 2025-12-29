interface FormError {
	field: string;
	error: string[];
}

type FormShape = Record<string, any>;

export const useForm = <T extends FormShape>(initialValues: T) => {
	const { t } = useI18n();
	const form = reactive<T>({ ...initialValues });
	const errors = ref<FormError[]>([]);
	const initialSnapshot = reactive(structuredClone(initialValues));

	const hasChanged = computed(() => {
		return JSON.stringify(form) !== JSON.stringify(initialSnapshot);
	});

	const hasError = (field: keyof T | string): boolean => {
		return errors.value.some((e) => e.field === field);
	};

	const getError = (field: keyof T | string): string[] | null => {
		const error = errors.value.find((e) => e.field === field);
		return error ? error.error.map((key) => t(key)) : null;
	};

	const setErrors = (newErrors: FormError[]) => {
		errors.value = newErrors;
	};

	const clearError = (field: keyof T | string) => {
		errors.value = errors.value.filter((e) => e.field !== field);
	};

	const clearAllErrors = () => {
		errors.value = [];
	};

	const resetForm = () => {
		Object.assign(form, structuredClone({ ...initialSnapshot }));
		clearAllErrors();
	};

	const reinitialize = () => {
		Object.assign(initialSnapshot, structuredClone({ ...form }));
	};

	return {
		form,
		errors,
		hasChanged,
		reinitialize,
		hasError,
		getError,
		setErrors,
		clearError,
		clearAllErrors,
		resetForm,
	};
};
