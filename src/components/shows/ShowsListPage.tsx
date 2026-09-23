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
		if (!window.confirm(`Delete show “${title}”?`)) return

		await removeShow({ showId: showId as any })
	}

	if (shows === undefined || setlists === undefined) {
		return <div className="page-empty">Loading shows…</div>
	}

	return (
		<div className="page">
			<header className="page-header">
				<div>
					<h1>Shows</h1>
				</div>
				<span className="page-count">{shows.length} shows</span>
			</header>

			<form className="detail-grid detail-grid-edit" onSubmit={submit}>
				<div className="detail-field">
					<span>Show title</span>
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
					<span>Venue</span>
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
						{saving ? "Saving…" : "Create show"}
					</button>
				</div>
			</form>

			{shows.length === 0 ? (
				<div className="page-empty">No shows have been added yet.</div>
			) : (
				<div className="songs-table shows-table">
					<div className="songs-table-header">
						<span>Show</span>
						<span>Date</span>
						<span>Venue</span>
						<span>Setlist</span>
						<span>Action</span>
					</div>
					{shows
						.sort((a, b) => a.date.localeCompare(b.date))
						.map((show) => (
							<div className="song-table-row" key={show._id}>
								<strong>{show.title}</strong>
								<span>
									{new Intl.DateTimeFormat("en-GB", {
										day: "numeric",
										month: "short",
										year: "numeric",
									}).format(new Date(`${show.date}T12:00:00`))}
								</span>
								<span>{show.venue ?? "TBA"}</span>
								<span>{show.setlist?.title ?? "—"}</span>
								<div className="table-actions">
									<button
										className="icon-button button-danger"
										type="button"
										aria-label={`Delete ${show.title}`}
										title="Delete show"
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
