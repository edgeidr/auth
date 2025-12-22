import type { User } from "@repo/shared";

export const useCurrentUser = () => {
	const user = useState<User | null>("user");
	const isLoggedIn = useCookie<boolean>("isLoggedIn");

	const hasUser = computed(() => !!user.value);

	const fullName = computed(() => {
		if (!hasUser.value) return "";

		return [user.value?.userProfile?.firstName, user.value?.userProfile?.lastName]
			.filter(Boolean)
			.join(" ");
	});

	const { execute: getCurrentUser, pending } = useCustomFetch<User>("/auth/me", {
		method: "GET",
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const userData = response._data!;
			user.value = userData;
		},
		onRequestError: () => {
			user.value = null;
		},
		onResponseError: () => {
			user.value = null;
		},
	});

	return { user, isLoggedIn, hasUser, pending, fullName, getCurrentUser };
};
