import type { User } from "@repo/shared";

export const useCurrentUser = () => {
	const user = useState<User | null>("user");
	const isLoggedIn = useCookie<boolean>("isLoggedIn");

	const hasUser = computed(() => !!user.value);

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

	return { user, isLoggedIn, hasUser, pending, getCurrentUser };
};
