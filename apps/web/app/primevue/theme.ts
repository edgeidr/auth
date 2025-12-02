import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import type { AuraBaseTokenSections } from "@primeuix/themes/aura/base";
import type { Preset } from "@primeuix/themes/types";

const MyPreset = definePreset(Aura, <Preset>{
	semantic: <AuraBaseTokenSections.Semantic>{
		primary: {
			50: "{cyan.50}",
			100: "{cyan.100}",
			200: "{cyan.200}",
			300: "{cyan.300}",
			400: "{cyan.400}",
			500: "{cyan.500}",
			600: "{cyan.600}",
			700: "{cyan.700}",
			800: "{cyan.800}",
			900: "{cyan.900}",
			950: "{cyan.950}",
		},
	},
	components: {},
});

export default {
	preset: MyPreset,
	options: {
		darkModeSelector: ".p-dark",
		cssLayer: {
			order: "theme, base, primevue",
		},
	},
};
