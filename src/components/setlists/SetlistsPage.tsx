import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"
import SetlistDetail from "./SetlistDetail"

export default function SetlistsPage() {
	const setlists = useQuery(api.setlists.list)
	const songs = useQuery(api.songs.list)
	const createSetlist = useMutation(api.setlists.create)
	const [title, setTitle] = useState("")
	const [notes, setNotes] = useState("")
	const [selectedSongIds, setSelectedSongIds] = useState<string[]>([])
	const [submitting, setSubmitting] = useState(false)
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
	const [showCreateForm, setShowCreateForm] = useState(false)

	useEffect(() => {
		setSelectedSlug(new URLSearchParams(window.location.search).get("slug"))
	}, [])

	const latestSetlist =
		[...(setlists ?? [])].sort(
			(a, b) => b._creationTime - a._creationTime,
		)[0] ?? null

	const toggleSong = (songId: string) => {
		setSelectedSongIds((current) =>
			current.includes(songId)
				? current.filter((id) => id !== songId)
				: [...current, songId],
		)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!title || selectedSongIds.length === 0) return

		setSubmitting(true)
		try {
			await createSetlist({
				title,
				notes: notes || undefined,
				songIds: selectedSongIds as any,
			})
			setTitle("")
			setNotes("")
			setSelectedSongIds([])
			setShowCreateForm(false)
		} finally {
			setSubmitting(false)
		}
	}

	const applyLatestSetlist = () => {
		if (!latestSetlist) return

		const nextSongIds = Array.from(
			new Set((latestSetlist.songs ?? []).map((row) => row.songId.toString())),
		)

		setSelectedSongIds(nextSongIds)
	}

	const selectAllSongs = () => {
		setSelectedSongIds(songs!.map((song) => song._id))
	}

	if (selectedSlug) {
		return <SetlistDetail slug={selectedSlug} />
	}

	if (setlists === undefined || songs === undefined) {
		return (
			<div className="page">
				<header className="page-header">
					<div>
						<h1>Setlists</h1>
					</div>
				</header>
				<div className="page-empty">Loading setlists…</div>
			</div>
		)
	}

	return (
		<div className="page">
			<header className="page-header">
				<div>
					<h1>Setlists</h1>
				</div>

				<span className="page-count">{setlists.length} setlists</span>
			</header>

			{setlists.length === 0 ? (
				<div className="page-empty">
					No setlists have been added yet. Add a setlist to populate this
					screen.
				</div>
			) : (
				<div className="songs-table">
					<div className="songs-table-header">
						<span>Setlist</span>
						<span>Created</span>
						<span>Songs</span>
					</div>

					{setlists.map((setlist) => (
						<a
							className="song-table-row"
							href={`/setlists?slug=${encodeURIComponent(setlist.slug)}`}
							key={setlist._id}>
							<strong>{setlist.title}</strong>
							<span>
								{new Intl.DateTimeFormat("en-GB", {
									day: "numeric",
									month: "short",
									year: "numeric",
								}).format(new Date(setlist._creationTime))}
							</span>
							<span>{setlist.songs?.length ?? 0}</span>
						</a>
					))}
				</div>
			)}

			<div className="setlist-add-area">
				{!showCreateForm ? (
					<button
						className="button button-secondary add-action"
						type="button"
						onClick={() => setShowCreateForm(true)}>
						<Icon name="plus" className="add-action-icon" />
						Add setlist
					</button>
				) : (
					<form
						className="detail-grid detail-grid-edit"
						onSubmit={handleSubmit}>
						<div className="detail-field">
							<span>Title</span>
							<input
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="Opening night"
								required
							/>
						</div>

						<div className="detail-field detail-field-wide setlist-picker-field">
							<div className="setlist-picker-heading">
								<div>
									<span>Setlist songs</span>
									<strong>
										{selectedSongIds.length} of {songs.length} selected
									</strong>
								</div>
								<div className="setlist-picker-actions">
									<button
										type="button"
										className="text-button"
										onClick={selectAllSongs}
										disabled={selectedSongIds.length === songs.length}>
										Select all
									</button>
									<button
										type="button"
										className="text-button"
										onClick={() => setSelectedSongIds([])}
										disabled={selectedSongIds.length === 0}>
										Clear
									</button>
								</div>
							</div>
							<div
								className="song-checklist"
								role="group"
								aria-label="Setlist songs">
								{songs.map((song) => (
									<label
										key={song._id}
										className={`checkbox-row ${selectedSongIds.includes(song._id) ? "selected" : ""}`}>
										<input
											type="checkbox"
											checked={selectedSongIds.includes(song._id)}
											onChange={() => toggleSong(song._id)}
										/>
										<span className="checkbox-row-copy">
											<strong>{song.title}</strong>
											<small>
												{song.bpm ? `${song.bpm} BPM` : "BPM unset"}
												{song.key ? ` · ${song.key}` : ""}
											</small>
										</span>
										{selectedSongIds.includes(song._id) && (
											<em>{selectedSongIds.indexOf(song._id) + 1}</em>
										)}
									</label>
								))}
							</div>
						</div>

						<div className="detail-field detail-field-wide">
							<span>Notes</span>
							<textarea
								value={notes}
								onChange={(event) => setNotes(event.target.value)}
								rows={4}
							/>
						</div>

						<div className="detail-field detail-field-wide">
							<div className="detail-actions">
								<button
									type="button"
									className="button button-secondary"
									onClick={applyLatestSetlist}
									disabled={!latestSetlist}>
									Copy latest setlist
								</button>
								<div className="setlist-form-actions">
									<button
										type="button"
										className="button button-secondary"
										onClick={() => setShowCreateForm(false)}>
										Cancel
									</button>
									<button
										className="button"
										type="submit"
										disabled={submitting}>
										{submitting ? "Saving…" : "Create setlist"}
									</button>
								</div>
							</div>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}
