export interface MerchVariant {
	id: string
	size: string
	colour: string
	style?: string
	gelatoProductUid: string
	printFiles?: MerchPrintFile[]
}

export interface MerchPrintFile {
	type: "default" | "front" | "back" | "front-embroidery"
	url: string
}

export interface MerchProduct {
	slug: string
	name: LocalizedText
	new: boolean
	description: LocalizedText
	price: number
	currency: "EUR"
	images: string[]
	printFileUrl: string
	printFileType: MerchPrintFile["type"]
	colourLinks?: MerchColourLink[]
	variants: MerchVariant[]
}

export interface MerchColourLink {
	colour: string
	slug: string
}

/**
 * Replace the example product UIDs and artwork URLs before opening checkout.
 * Prices are integer cents and are always revalidated on the server.
 */
export const merchProducts: MerchProduct[] = [
	{
		slug: "done-tee",
		name: {
			en: '"done" black tee',
			fr: "t-shirt noir «done»",
		},
		new: true,
		description: {
			en: "A classic black tee featuring the white abide «done» artwork printed on the front. Made from soft ring-spun cotton with a comfortable unisex fit.",
			fr: "Un t-shirt noir classique avec le visuel blanc «done» d’abide imprimé sur le devant. Confectionné en coton filé doux avec une coupe unisexe confortable.",
		},
		price: 2500,
		currency: "EUR",
		images: ["/merch/tee-done-0.webp", "/merch/tee-done-1.webp"],
		printFileUrl: "https://abideband.com/merch/print/tee-done.png",
		printFileType: "front",
		variants: ["s", "m", "l", "xl", "2xl"].map((size) => ({
			id: `done-tee-black-${size}`,
			size: size.toUpperCase(),
			colour: "Black",
			gelatoProductUid: `apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_${size}_gco_black_gpr_4-0-dtf_gildan_64000`,
		})),
	},
	{
		slug: "forget-to-pretend-tee",
		name: {
			en: '"forget" black tee',
			fr: "t-shirt noir «forget»",
		},
		new: true,
		description: {
			en: "A classic black unisex tee featuring the green «forget to pretend» artwork printed on the front and back.",
			fr: "Un t-shirt noir unisexe avec le visuel vert «forget to pretend» imprimé sur le devant et le dos.",
		},
		price: 3000,
		currency: "EUR",
		images: [
			"/merch/tee-forget-black-0.webp",
			"/merch/tee-forget-black-1.webp",
			"/merch/tee-forget-black-2.webp",
			"/merch/tee-forget-black-3.webp",
		],
		printFileUrl: "https://abideband.com/merch/print/tee-logo-front-green.png",
		printFileType: "front",
		colourLinks: [
			{ colour: "Black", slug: "forget-to-pretend-tee" },
			{ colour: "Sand", slug: "forget-to-pretend-sand-tee" },
		],
		variants: ["s", "m", "l", "xl", "2xl"].map((size) => ({
			id: `forget-to-pretend-tee-black-${size}-green`,
			size: size.toUpperCase(),
			colour: "Black",
			gelatoProductUid: `apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_${size}_gco_black_gpr_4-4-dtf_gildan_64000`,
			printFiles: [
				{
					type: "front" as const,
					url: "https://abideband.com/merch/print/tee-logo-front-green.png",
				},
				{
					type: "back" as const,
					url: "https://abideband.com/merch/print/tee-forget-back-green.png",
				},
			],
		})),
	},
	{
		slug: "lullaby-tee",
		name: {
			en: '"lullaby" black tee',
			fr: "t-shirt noir «lullaby»",
		},
		new: true,
		description: {
			en: "A classic black unisex tee featuring red «lullaby lullaby» artwork printed on the front and back.",
			fr: "Un t-shirt noir unisexe avec le visuel rouge «lullaby lullaby» imprimé sur le devant et le dos.",
		},
		price: 3000,
		currency: "EUR",
		images: [
			"/merch/tee-lullaby-0.webp",
			"/merch/tee-lullaby-1.webp",
			"/merch/tee-lullaby-2.webp",
			"/merch/tee-lullaby-3.webp",
		],
		printFileUrl: "https://abideband.com/merch/print/tee-lullaby-front.png",
		printFileType: "front",
		variants: ["s", "m", "l", "xl", "2xl"].map((size) => ({
			id: `lullaby-tee-black-${size}`,
			size: size.toUpperCase(),
			colour: "Black",
			gelatoProductUid: `apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_${size}_gco_black_gpr_4-4-dtf_gildan_64000`,
			printFiles: [
				{
					type: "front" as const,
					url: "https://abideband.com/merch/print/tee-lullaby-front.png",
				},
				{
					type: "back" as const,
					url: "https://abideband.com/merch/print/tee-lullaby-back.png",
				},
			],
		})),
	},
	{
		slug: "forget-to-pretend-sand-tee",
		name: {
			en: '"forget" sand tee',
			fr: "t-shirt écru «forget»",
		},
		new: true,
		description: {
			en: "A sand-colour unisex tee featuring the pink «forget to pretend» artwork printed on the front and back.",
			fr: "Un t-shirt unisexe écru avec le visuel rose «forget to pretend» imprimé sur le devant et le dos.",
		},
		price: 3000,
		currency: "EUR",
		images: [
			"/merch/tee-forget-sand-0.webp",
			"/merch/tee-forget-sand-1.webp",
			"/merch/tee-forget-sand-2.webp",
			"/merch/tee-forget-sand-3.webp",
		],
		printFileUrl: "https://abideband.com/merch/print/tee-logo-front-pink.png",
		printFileType: "front",
		colourLinks: [
			{ colour: "Black", slug: "forget-to-pretend-tee" },
			{ colour: "Sand", slug: "forget-to-pretend-sand-tee" },
		],
		variants: ["s", "m", "l", "xl", "2xl"].map((size) => ({
			id: `forget-to-pretend-sand-tee-${size}`,
			size: size.toUpperCase(),
			colour: "Sand",
			gelatoProductUid: `apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_${size}_gco_sand_gpr_4-4-dtf_gildan_64000`,
			printFiles: [
				{
					type: "front" as const,
					url: "https://abideband.com/merch/print/tee-logo-front-pink.png",
				},
				{
					type: "back" as const,
					url: "https://abideband.com/merch/print/tee-forget-back-pink.png",
				},
			],
		})),
	},
	{
		slug: "knuckles-cap",
		name: {
			en: "knuckles cap",
			fr: "casquette knuckles",
		},
		new: true,
		description: {
			en: "A classic black trucker-style cap featuring a high-quality embroidered abide knuckle logo on the front. One size fits most with an adjustable snapback closure.",
			fr: "Casquette trucker noire classique ornée d’un logo knuckle abide brodé de haute qualité sur le devant. Taille unique avec fermeture snapback réglable.",
		},
		price: 2500,
		currency: "EUR",
		images: ["/merch/cap-knuckles_logo-0.webp"],
		printFileUrl: "https://abideband.com/merch/print/cap-knuckles_logo.png",
		printFileType: "front-embroidery",
		variants: [
			{
				id: "knuckles-cap",
				size: "One Size",
				colour: "Black",
				gelatoProductUid:
					"apparel_product_gca_hat_gsc_trucker-hat_gcu_unisex_gqa_prm_gsi_onesize_gco_black--black_gpr_4-0-emb_flexfit_6606",
			},
		],
	},
]

export function getMerchProduct(slug: string) {
	return merchProducts.find((product) => product.slug === slug)
}

export function getMerchVariant(variantId: string) {
	for (const product of merchProducts) {
		const variant = product.variants.find(({ id }) => id === variantId)
		if (variant) return { product, variant }
	}

	return undefined
}

export function getMerchText(text: LocalizedText, lang: MerchLanguage = "en") {
	return text[lang]
}

export function formatMerchPrice(
	price: number,
	currency: "EUR" = "EUR",
	lang: MerchLanguage = "en",
) {
	return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
		style: "currency",
		currency,
	}).format(price / 100)
}
import type { MerchLanguage } from "./merch-i18n.js"

export type LocalizedText = Record<MerchLanguage, string>
