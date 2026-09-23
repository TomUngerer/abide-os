import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"
import SongLyrics from "./SongLyrics"
import { keyOptions, statusLabels, tuningOptions } from "./songConstants"

type Props = {
	slug: string
}

export default function SongDetail({ slug }: Props) {
	const song = useQuery(api.songs.getBySlug, { slug })
	const updateSong = useMutation(api.songs.update)
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState({
		title: "",
		status: "unknown",
		releaseDate: "",
		bpm: "",
		key: "",
		tuning: "",
		notes: "",
	})
	const [saving, setSaving] = useState(false)

	if (song === undefined) {
		return <div className="page-empty">Loading…</div>
	}

	if (song === null) {
		return (
			<div className="page">
				<p className="eyebrow">404</p>
				<h1>Song not found</h1>
			</div>
		)
	}

	const beginEditing = () => {
		setDraft({
			title: song.title,
			status: song.status,
			releaseDate: song.releaseDate ?? "",
			bpm: song.bpm?.toString() ?? "",
			key: song.key ?? "",
			tuning: song.tuning ?? "",
			notes: song.notes ?? "",
		})
		setEditing(true)
	}

	const saveSong = async () => {
		setSaving(true)
		try {
			await updateSong({
				songId: song._id,
				title: draft.title,
				status: draft.status as keyof typeof statusLabels,
				releaseDate: draft.releaseDate === "" ? undefined : draft.releaseDate,
				bpm: draft.bpm === "" ? undefined : Number(draft.bpm),
				key:
					draft.key === ""
						? undefined
						: (draft.key as (typeof keyOptions)[number]),
				tuning:
					draft.tuning === ""
						? undefined
						: (draft.tuning as (typeof tuningOptions)[number]),
				notes: draft.notes,
			})
			setEditing(false)
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="page song-detail">
			<header className="page-header song-detail-header">
				<div className="song-detail-title-wrap">
					<div className="page-header-actions">
						<a className="back-link" href="/songs">
							← SONGS
						</a>
					</div>
					<div className="song-hero-copy">
						<div className="eyebrow-row">
							<span className="eyebrow">Song profile</span>
							{!editing ? (
								<button
									className="icon-button"
									type="button"
									onClick={beginEditing}
									aria-label="Edit song details">
									<Icon name="edit" className="icon-button-icon" />
								</button>
							) : null}
						</div>
						<h1>{song.title}</h1>
					</div>
				</div>

				<div className="song-meta-badges">
					<span className="status-badge">{statusLabels[song.status]}</span>
					{song.key ? <span className="meta-pill">{song.key}</span> : null}
					{song.bpm ? <span className="meta-pill">{song.bpm} BPM</span> : null}
					{song.tuning ? (
						<span className="meta-pill">{song.tuning}</span>
					) : null}
				</div>
			</header>

			<section className="song-detail-body">
				{editing && (
					<section className="detail-grid detail-grid-edit">
						<div className="detail-field detail-field-full">
							<span>Title</span>
							<input
								value={draft.title}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										title: event.target.value,
									}))
								}
							/>
						</div>

						<div className="detail-field detail-field-full">
							<span>Release date</span>
							<input
								type="date"
								value={draft.releaseDate}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										releaseDate: event.target.value,
									}))
								}
							/>
						</div>

						<div className="detail-field">
							<span>Status</span>
							<select
								value={draft.status}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										status: event.target.value,
									}))
								}>
								{Object.entries(statusLabels).map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</div>

						<div className="detail-field">
							<span>BPM</span>
							<input
								type="number"
								value={draft.bpm}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										bpm: event.target.value,
									}))
								}
							/>
						</div>

						<div className="detail-field">
							<span>Key</span>
							<select
								value={draft.key}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										key: event.target.value,
									}))
								}>
								<option value="">Unknown</option>
								{keyOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>

						<div className="detail-field">
							<span>Tuning</span>
							<select
								value={draft.tuning}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										tuning: event.target.value,
									}))
								}>
								<option value="">Unknown</option>
								{tuningOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>

						<div className="detail-field detail-field-wide">
							<span>Notes</span>
							<textarea
								value={draft.notes}
								onChange={(event) =>
									setDraft((current) => ({
										...current,
										notes: event.target.value,
									}))
								}
								rows={4}
							/>
						</div>
					</section>
				)}

				{editing && (
					<div className="lyrics-actions detail-actions-inline">
						<button
							className="button button-secondary"
							type="button"
							onClick={() => setEditing(false)}>
							Cancel
						</button>
						<button
							className="button"
							type="button"
							onClick={saveSong}
							disabled={saving}>
							{saving ? "Saving…" : "Save song"}
						</button>
					</div>
				)}
			</section>

			<SongLyrics songId={song._id} />
		</div>
	)
}
