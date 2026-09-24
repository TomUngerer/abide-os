import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"

export default function ShowsListPage() {
	const shows = useQuery(api.shows.list)
	const setlists = useQuery(api.setlists.list)
	const createShow = useMutation(api.shows.create)
	const removeShow = useMutation(api.shows.remove)
	const [title, setTitle] = useState("")
	const [date, setDate] = useState("")
	const [venue, setVenue] = useState("")
	const [setlistId, setSetlistId] = useState("")
	const [saving, setSaving] = useState(false)

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!title.trim() || !date) return

		setSaving(true)
		try {
			await createShow({
				title,
				date,
				venue: venue.trim() || undefined,
				setlistId: setlistId ? (setlistId as any) : undefined,
			})
			setTitle("")
			setDate("")
			setVenue("")
			setSetlistId("")
		} finally {
			setSaving(false)
		}
	}

	const handleDeleteShow = async (showId: string, title: string) => {
		if (!window.confirm(`Supprimer le concert « ${title} » ?`)) return

		await removeShow({ showId: showId as any })
	}

	if (shows === undefined || setlists === undefined) {
		return <div className="page-empty">Chargement des concerts…</div>
	}

	return (
		<div className="page">
			<header className="page-header">
				<div>
					<h1>Concerts</h1>
				</div>
				<span className="page-count">{shows.length} concerts</span>
			</header>

			<form className="detail-grid detail-grid-edit" onSubmit={submit}>
				<div className="detail-field">
					<span>Nom du concert</span>
					<input
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						required
					/>
				</div>
				<div className="detail-field">
					<span>Date</span>
					<input
						type="date"
						value={date}
						onChange={(event) => setDate(event.target.value)}
						required
					/>
				</div>
				<div className="detail-field">
					<span>Lieu</span>
					<input
						value={venue}
						onChange={(event) => setVenue(event.target.value)}
					/>
				</div>
				<div className="detail-field">
					<span>Setlist</span>
					<select
						value={setlistId}
						onChange={(event) => setSetlistId(event.target.value)}>
						<option value="">No setlist assigned</option>
						{setlists.map((setlist) => (
							<option key={setlist._id} value={setlist._id}>
								{setlist.title}
							</option>
						))}
					</select>
				</div>
				<div className="detail-field detail-field-wide">
					<button className="button" type="submit" disabled={saving}>
						{saving ? "Enregistrement…" : "Créer le concert"}
					</button>
				</div>
			</form>

			{shows.length === 0 ? (
				<div className="page-empty">Aucun concert ajouté.</div>
			) : (
				<div className="songs-table shows-table">
					<div className="songs-table-header">
						<span>Concert</span>
						<span>Date</span>
						<span>Lieu</span>
						<span>Setlist</span>
						<span>Action</span>
					</div>
					{shows
						.sort((a, b) => a.date.localeCompare(b.date))
						.map((show) => (
							<div className="song-table-row" key={show._id}>
								<strong>{show.title}</strong>
								<span>
									{new Intl.DateTimeFormat("fr-FR", {
										day: "numeric",
										month: "short",
										year: "numeric",
									}).format(new Date(`${show.date}T12:00:00`))}
								</span>
								<span>{show.venue ?? "À confirmer"}</span>
								<span>{show.setlist?.title ?? "—"}</span>
								<div className="table-actions">
									<button
										className="icon-button button-danger"
										type="button"
										aria-label={`Supprimer ${show.title}`}
										title="Supprimer le concert"
										onClick={() => handleDeleteShow(show._id, show.title)}>
										<Icon name="trash" className="icon-button-icon" />
									</button>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	)
}
