import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { statusLabels as songStatusLabels } from "../songs/songConstants"

const statusLabels: Record<string, string> = {
	todo: "À faire",
	in_progress: "En cours",
	done: "Terminé",
}

const priorityLabels: Record<string, string> = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute",
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
					<h1>Tableau de bord</h1>
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
				<p className="eyebrow">PRIORITÉ ACTUELLE</p>

				<h2>
					{openTasks.length > 0
						? `${openTasks.length} éléments à traiter`
						: "Rien n'est actuellement assigné"}
				</h2>

				<p>
					{openTasks.length > 0
						? "Traitez les tâches en attente ci-dessous."
						: "Ajoutez une tâche lorsque le groupe doit faire avancer un sujet."}
				</p>
			</section>

			<div className="dashboard-grid">
				<section className="panel panel-wide">
					<div className="panel-heading">
						<span>Tâches</span>
						<span>{openTasks.length}</span>
					</div>

					{tasks === undefined ? (
						<div className="empty">Chargement…</div>
					) : openTasks.length === 0 ? (
						<div className="empty">Aucune tâche en attente.</div>
					) : (
						<div className="list">
							{openTasks.map((task) => (
								<div className="list-row" key={task._id}>
									<div>
										<strong>{task.title}</strong>
										<span>{statusLabels[task.status]}</span>
									</div>

									<span className={`priority ${task.priority}`}>
										{priorityLabels[task.priority]}
									</span>
								</div>
							))}
						</div>
					)}
				</section>

				<section className="panel">
					<div className="panel-heading">
						<span>Dernier setlist</span>
					</div>

					{latestSetlist ? (
						<div className="release-focus">
							<strong>{latestSetlist.title}</strong>

							<span>
								{new Intl.DateTimeFormat("fr-FR", {
									day: "numeric",
									month: "long",
									year: "numeric",
								}).format(new Date(latestSetlist._creationTime))}
							</span>
						</div>
					) : (
						<div className="empty">Aucun setlist enregistré.</div>
					)}
				</section>

				<section className="panel">
					<div className="panel-heading">
						<span>Prochaine sortie</span>
					</div>

					{nextRelease ? (
						<div className="release-focus">
							<strong>{nextRelease.title}</strong>

							<span>
								{nextRelease.releaseDate
									? new Intl.DateTimeFormat("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										}).format(new Date(`${nextRelease.releaseDate}T12:00:00`))
									: "Date inconnue"}
							</span>

							<span>{nextRelease.status}</span>
						</div>
					) : (
						<div className="empty">
							Aucune sortie à venir n'est enregistrée.
						</div>
					)}
				</section>

				<section className="panel panel-wide">
					<div className="panel-heading">
						<span>Morceaux en cours</span>
						<span>{activeSongs.length}</span>
					</div>

					{songs === undefined ? (
						<div className="empty">Chargement…</div>
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
			</div>
		</div>
	)
}
