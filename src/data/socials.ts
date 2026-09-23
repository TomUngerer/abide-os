import { socials } from "../content/site.json"

export type SocialPlatform = keyof typeof socials

export interface SocialLink {
	key: SocialPlatform
	label: string
	url: string
}

const platformLabels = {
	bandcamp: "Bandcamp",
	subvert: "Subvert",
	appleMusic: "Apple Music",
	spotify: "Spotify",
	instagram: "Instagram",
	deezer: "Deezer",
	youtube: "YouTube",
} satisfies Record<SocialPlatform, string>

export const socialLinks = Object.entries(socials).map(([key, url]) => ({
	key: key as SocialPlatform,
	label: platformLabels[key as SocialPlatform],
	url,
})) satisfies SocialLink[]
