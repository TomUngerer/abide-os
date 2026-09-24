import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"
import SongDetail from "./SongDetail"
import { statusLabels } from "./songConstants"

export default function SongsPage() {
	const songs = useQuery(api.songs.list)
	const createSong = useMutation(api.songs.create)
	const updateOrder = useMutation(api.songs.updateOrder)
	const [title, setTitle] = useState("")
	const [creating, setCreating] = useState(false)
	const [createError, setCreateError] = useState("")
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
	const [reordering, setReordering] = useState(false)
	const [orderDraft, setOrderDraft] = useState<string[]>([])
	const [savingOrder, setSavingOrder] = useState(false)

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

	const startReordering = () => {
		setOrderDraft([])
		setReordering(true)
	}

	const toggleOrderSong = (songId: string) => {
		setOrderDraft((current) =>
			current.includes(songId)
				? current.filter((id) => id !== songId)
				: [...current, songId],
		)
	}

	const saveOrder = async () => {
		setSavingOrder(true)
		try {
			if (songs === undefined || orderDraft.length === 0) return
			const remainingSongIds = songs
				.filter((song) => !orderDraft.includes(song._id))
				.map((song) => song._id)
			await updateOrder({
				orderedSongIds: [...orderDraft, ...remainingSongIds] as any,
			})
			setReordering(false)
		} finally {
			setSavingOrder(false)
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
					<h1>Songs</h1>
				</div>

				<div className="page-header-actions">
					<span className="page-count">{songs?.length ?? "—"} morceaux</span>
					<button
						className="button button-secondary"
						type="button"
						onClick={reordering ? () => setReordering(false) : startReordering}
						disabled={savingOrder}>
						{reordering ? "Annuler le tri" : "Réordonner les morceaux"}
					</button>
				</div>
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
						<span>Titre</span>
						<span>Statut</span>
						<span>BPM</span>
						<span>Tonalité / accordage</span>
					</div>

					{songs.map((song) => {
						const order = orderDraft.indexOf(song._id)
						const row = (
							<>
								<strong>
									{reordering && order >= 0
										? `${order + 1}. ${song.title}`
										: song.title}
								</strong>
								<span>{statusLabels[song.status]}</span>
								<span>{song.bpm ?? "—"}</span>
								<span>
									{[song.key, song.tuning].filter(Boolean).join(" / ") || "—"}
								</span>
							</>
						)

						return reordering ? (
							<button
								className={`song-table-row song-order-button ${order >= 0 ? "selected" : ""}`}
								key={song._id}
								type="button"
								onClick={() => toggleOrderSong(song._id)}>
								{row}
							</button>
						) : (
							<a
								className="song-table-row"
								href={`/songs?slug=${encodeURIComponent(song.slug)}`}
								key={song._id}>
								{row}
							</a>
						)
					})}
				</div>
			)}

			{reordering && (
				<div className="detail-actions song-order-actions">
					<span>{orderDraft.length} selected in order</span>
					<button
						className="button"
						type="button"
						onClick={saveOrder}
						disabled={savingOrder}>
						{savingOrder ? "Enregistrement…" : "Enregistrer l'ordre"}
					</button>
				</div>
			)}
		</div>
	)
}
