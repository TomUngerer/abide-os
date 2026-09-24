import { ConvexProvider, ConvexReactClient } from "convex/react"
import Dashboard from "./Dashboard"
import SongsPage from "../songs/SongsPage"
import SongDetail from "../songs/SongDetail"
import SetlistsPage from "../setlists/SetlistsPage"
import ShowsListPage from "../shows/ShowsListPage"
import SetlistDetail from "../setlists/SetlistDetail"
import TasksPage from "../tasks/TasksPage"

const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!convexUrl) {
	throw new Error("VITE_CONVEX_URL is missing.")
}

const convex = new ConvexReactClient(convexUrl)

type Props = {
	view: "dashboard" | "songs" | "song" | "shows" | "show" | "setlists" | "tasks"
	slug?: string
}

function View({ view, slug }: Props) {
	switch (view) {
		case "songs":
			return <SongsPage />

		case "song":
			return <SongDetail slug={slug ?? ""} />

		case "shows":
			return <ShowsListPage />

		case "setlists":
			return <SetlistsPage />

		case "show":
			return <SetlistDetail slug={slug ?? ""} />

		case "tasks":
			return <TasksPage />

		default:
			return <Dashboard />
	}
}

export default function ConvexApp({ view, slug }: Props) {
	return (
		<ConvexProvider client={convex}>
			<View view={view} slug={slug} />
		</ConvexProvider>
	)
}
