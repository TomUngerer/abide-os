import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { statusLabels as songStatusLabels } from "../songs/songConstants"

const statusLabels: Record<string, string> = {
	todo: "To do",
	in_progress: "In progress",
	done: "Done",
}

export default function Dashboard() {
	const songs = useQuery(api.songs.list)
	const releases = useQuery(api.releases.list)
	const tasks = useQuery(api.tasks.list)
	const setlists = useQuery(api.setlists.list)

	const openTasks = tasks?.filter((task) => task.status !== "done") ?? []

	const activeSongs =
		songs?.filter(
			(song) => song.status !== "released" && song.status !== "cover",
		) ?? []

	const nextRelease =
		releases
			?.filter((release) => release.draft)
			.sort((a, b) =>
				(a.releaseDate ?? "").localeCompare(b.releaseDate ?? ""),
			)[0] ?? null

	const latestSetlist =
		[...(setlists ?? [])].sort(
			(a, b) => b._creationTime - a._creationTime,
		)[0] ?? null

	return (
		<div className="os-dashboard">
			<header className="page-header">
				<div>
					<h1>Dashboard</h1>
				</div>

				<div className="header-date">
					{new Intl.DateTimeFormat("fr-FR", {
						day: "numeric",
						month: "short",
						year: "numeric",
					}).format(new Date())}
				</div>
			</header>

			<section className="focus">
				<p className="eyebrow">CURRENT FOCUS</p>

				<h2>
					{openTasks.length > 0
						? `${openTasks.length} things need attention`
						: "Nothing is currently assigned"}
				</h2>

				<p>
					{openTasks.length > 0
						? "Work through the outstanding tasks below."
						: "Add a task when there is something the band needs to move forward."}
				</p>
			</section>

			<div className="dashboard-grid">
				<section className="panel">
					<div className="panel-heading">
						<span>Tasks</span>
						<span>{openTasks.length}</span>
					</div>

					{tasks === undefined ? (
						<div className="empty">Loading…</div>
					) : openTasks.length === 0 ? (
						<div className="empty">No outstanding tasks.</div>
					) : (
						<div className="list">
							{openTasks.map((task) => (
								<div className="list-row" key={task._id}>
									<div>
										<strong>{task.title}</strong>
										<span>{statusLabels[task.status]}</span>
									</div>

									<span className={`priority ${task.priority}`}>
										{task.priority}
									</span>
								</div>
							))}
						</div>
					)}
				</section>

				<section className="panel">
					<div className="panel-heading">
						<span>Latest setlist</span>
					</div>

					{latestSetlist ? (
						<div className="release-focus">
							<strong>{latestSetlist.title}</strong>

							<span>
								{new Intl.DateTimeFormat("en-GB", {
									day: "numeric",
									month: "long",
									year: "numeric",
								}).format(new Date(latestSetlist._creationTime))}
							</span>
						</div>
					) : (
						<div className="empty">No setlists have been recorded.</div>
					)}
				</section>

				<section className="panel">
					<div className="panel-heading">
						<span>Next release</span>
					</div>

					{nextRelease ? (
						<div className="release-focus">
							<strong>{nextRelease.title}</strong>

							<span>
								{nextRelease.releaseDate
									? new Intl.DateTimeFormat("en-GB", {
											day: "numeric",
											month: "long",
											year: "numeric",
										}).format(new Date(`${nextRelease.releaseDate}T12:00:00`))
									: "Date unknown"}
							</span>

							<span>{nextRelease.status}</span>
						</div>
					) : (
						<div className="empty">
							No upcoming release is currently recorded.
						</div>
					)}
				</section>

				<section className="panel panel-wide">
					<div className="panel-heading">
						<span>Songs in progress</span>
						<span>{activeSongs.length}</span>
					</div>

					{songs === undefined ? (
						<div className="empty">Loading…</div>
					) : (
						<div className="song-list">
							{activeSongs.map((song) => (
								<a
									className="song-row"
									href={`/songs?slug=${encodeURIComponent(song.slug)}`}
									key={song._id}>
									<strong>{song.title}</strong>
									<span>{songStatusLabels[song.status]}</span>
								</a>
							))}
						</div>
					)}
				</section>

				<section className="panel">
					<div className="panel-heading">
						<span>Recent activity</span>
					</div>

					<div className="empty">
						Activity history will appear here as the OS starts recording
						changes.
					</div>
				</section>
			</div>
		</div>
	)
}
