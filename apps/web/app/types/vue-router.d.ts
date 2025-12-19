import type { Access } from "@repo/shared";

declare module "vue-router" {
	interface RouteMeta {
		access?: Access[];
	}
}
