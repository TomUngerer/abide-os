// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

export default defineConfig({
	integrations: [react()],
	vite: {
		define: {
			"import.meta.env.VITE_CONVEX_URL": JSON.stringify(
				"https://fine-jackal-629.eu-west-1.convex.cloud",
			),
		},
	},
})
