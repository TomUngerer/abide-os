import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"
import SongDetail from "./SongDetail"
import { statusLabels } from "./songConstants"

export default function SongsPage() {
	const songs = useQuery(api.songs.list)
	const createSong = useMutation(api.songs.create)
	const [title, setTitle] = useState("")
	const [creating, setCreating] = useState(false)
	const [createError, setCreateError] = useState("")
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
	const [sortKey, setSortKey] = useState<
		"title" | "status" | "bpm" | "details"
	>("title")

	useEffect(() => {
		setSelectedSlug(new URLSearchParams(window.location.search).get("slug"))
	}, [])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!title.trim()) return

		setCreating(true)
		setCreateError("")
		try {
			await createSong({ title })
			setTitle("")
		} catch (error) {
			setCreateError(
				error instanceof Error
					? error.message
					: "Impossible de créer le morceau.",
			)
		} finally {
			setCreating(false)
		}
	}

	if (selectedSlug) {
		return <SongDetail slug={selectedSlug} />
	}

	if (songs === undefined) {
		return (
			<div className="page">
				<header className="page-header">
					<div>
						<h1>Morceaux</h1>
					</div>
				</header>
				<div className="page-empty">Connexion…</div>
			</div>
		)
	}

	return (
		<div className="page">
			<header className="page-header">
				<div>
					<h1>Morceaux</h1>
				</div>

				<span className="page-count">{songs?.length ?? "—"} morceaux</span>
			</header>

			<form className="add-song-form" onSubmit={handleSubmit}>
				<div>
					<label htmlFor="new-song-title">Ajouter un morceau</label>
					<input
						id="new-song-title"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Titre du morceau"
						required
					/>
				</div>
				<button className="button add-action" type="submit" disabled={creating}>
					<Icon name="plus" className="add-action-icon" />
					{creating ? "Ajout…" : "Ajouter le morceau"}
				</button>
				{createError && <p className="form-error">{createError}</p>}
			</form>

			{songs === undefined ? (
				<div className="page-empty">Chargement…</div>
			) : (
				<div className="songs-table">
					<div className="songs-table-header">
						<button
							className="sortable-table-header"
							type="button"
							onClick={() => setSortKey("title")}
							aria-label="Trier par titre">
							Titre
						</button>
						<button
							className="sortable-table-header"
							type="button"
							onClick={() => setSortKey("status")}
							aria-label="Trier par statut">
							Statut
						</button>
						<button
							className="sortable-table-header"
							type="button"
							onClick={() => setSortKey("bpm")}
							aria-label="Trier par BPM">
							BPM
						</button>
						<button
							className="sortable-table-header"
							type="button"
							onClick={() => setSortKey("details")}
							aria-label="Trier par tonalité et accordage">
							Tonalité / accordage
						</button>
					</div>

					{[...songs]
						.sort((a, b) => {
							if (sortKey === "bpm") return (a.bpm ?? -1) - (b.bpm ?? -1)
							const aValue =
								sortKey === "title"
									? a.title
									: sortKey === "status"
										? statusLabels[a.status]
										: [a.key, a.tuning].filter(Boolean).join(" / ")
							const bValue =
								sortKey === "title"
									? b.title
									: sortKey === "status"
										? statusLabels[b.status]
										: [b.key, b.tuning].filter(Boolean).join(" / ")
							return aValue.localeCompare(bValue, "fr", {
								sensitivity: "base",
							})
						})
						.map((song) => (
							<a
								className="song-table-row"
								href={`/songs?slug=${encodeURIComponent(song.slug)}`}
								key={song._id}>
								<strong>{song.title}</strong>
								<span>{statusLabels[song.status]}</span>
								<span>{song.bpm ?? "—"}</span>
								<span>
									{[song.key, song.tuning].filter(Boolean).join(" / ") || "—"}
								</span>
							</a>
						))}
				</div>
			)}
		</div>
	)
}
