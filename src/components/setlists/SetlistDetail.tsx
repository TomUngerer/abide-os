import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core"
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"
import SongLyrics from "../songs/SongLyrics"

type Props = {
	slug: string
}

type SetlistSong = {
	_id: string
	songId: string
	song: {
		title: string
		status: string
	} | null
}

type SortableSongRowProps = {
	row: SetlistSong
	index: number
}

function SortableSongRow({ row, index }: SortableSongRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: row.songId })

	return (
		<div
			ref={setNodeRef}
			className={`song-table-row ${isDragging ? "dragging" : ""}`}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			{...attributes}>
			<button
				className="setlist-drag-handle"
				type="button"
				aria-label={`Réordonner ${row.song?.title ?? "le morceau"}`}
				{...listeners}>
				⋮⋮
			</button>
			<strong>{index + 1}</strong>
			<strong>{row.song?.title ?? "Morceau inconnu"}</strong>
		</div>
	)
}

export default function SetlistDetail({ slug }: Props) {
	const setlist = useQuery(api.setlists.getBySlug, { slug })
	const updateSongOrder = useMutation(api.setlists.updateSongOrder)
	const updateSetlist = useMutation(api.setlists.update)
	const removeSetlist = useMutation(api.setlists.remove)
	const [activeSongId, setActiveSongId] = useState<string | null>(null)
	const [orderedSongIds, setOrderedSongIds] = useState<string[] | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)
	const [practiceIndex, setPracticeIndex] = useState<number | null>(null)
	const [practiceFullscreen, setPracticeFullscreen] = useState(false)
	const touchStart = useRef<{ x: number; y: number } | null>(null)
	const [draft, setDraft] = useState({
		title: "",
		notes: "",
	})
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 180, tolerance: 6 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	useEffect(() => {
		if (setlist && !editing) {
			setDraft({
				title: setlist.title,
				notes: setlist.notes ?? "",
			})
		}
	}, [setlist, editing])

	if (setlist === undefined) {
		return <div className="page-empty">Chargement du setlist…</div>
	}

	if (setlist === null) {
		return (
			<div className="page">
				<p className="eyebrow">404</p>
				<h1>Setlist introuvable</h1>
			</div>
		)
	}

	const handleDelete = async () => {
		if (!window.confirm(`Supprimer la setlist « ${setlist.title} » ?`)) return

		setDeleting(true)
		try {
			await removeSetlist({ setlistId: setlist._id })
			window.location.href = "/setlists"
		} finally {
			setDeleting(false)
		}
	}

	const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!draft.title.trim()) return

		setSaving(true)
		try {
			const updated = await updateSetlist({
				setlistId: setlist._id,
				title: draft.title.trim(),
				notes: draft.notes.trim() || undefined,
			})
			window.location.href = `/setlists?slug=${encodeURIComponent(updated.slug)}`
		} finally {
			setSaving(false)
		}
	}

	const practiceSongs = setlist.songs ?? []
	const orderedSongs = orderedSongIds
		? orderedSongIds
				.map((songId) => practiceSongs.find((row) => row.songId === songId))
				.filter((row): row is (typeof practiceSongs)[number] => Boolean(row))
		: practiceSongs
	const currentPracticeSong =
		practiceIndex === null ? null : practiceSongs[practiceIndex]

	const handleDragStart = ({ active }: { active: { id: string | number } }) => {
		setActiveSongId(String(active.id))
	}

	const handleDragEnd = async ({ active, over }: DragEndEvent) => {
		setActiveSongId(null)
		if (!over || active.id === over.id) return

		const currentIds = orderedSongs.map((row) => row.songId.toString())
		const oldIndex = currentIds.indexOf(String(active.id))
		const newIndex = currentIds.indexOf(String(over.id))
		if (oldIndex === -1 || newIndex === -1) return

		const nextIds = arrayMove(currentIds, oldIndex, newIndex)
		setOrderedSongIds(nextIds)

		try {
			await updateSongOrder({
				setlistId: setlist._id,
				orderedSongIds: nextIds as any,
			})
		} catch {
			setOrderedSongIds(null)
		}
	}

	const togglePractice = () => {
		if (practiceIndex === null) {
			setPracticeIndex(0)
			setPracticeFullscreen(true)
		} else {
			setPracticeIndex(null)
			setPracticeFullscreen(false)
		}
	}

	const handlePracticeTouchStart = (event: React.TouchEvent<HTMLElement>) => {
		if (!practiceFullscreen) return

		const touch = event.touches[0]
		touchStart.current = { x: touch.clientX, y: touch.clientY }
	}

	const handlePracticeTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
		if (!practiceFullscreen || !touchStart.current || practiceIndex === null)
			return

		const touch = event.changedTouches[0]
		const deltaX = touch.clientX - touchStart.current.x
		const deltaY = touch.clientY - touchStart.current.y
		touchStart.current = null

		if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) return

		setPracticeIndex((current) => {
			if (current === null) return current

			const direction = deltaX < 0 ? 1 : -1
			return Math.max(
				0,
				Math.min(practiceSongs.length - 1, current + direction),
			)
		})
	}

	return (
		<div className="page setlist-detail">
			<header className="page-header song-detail-header">
				<div className="song-detail-title-wrap">
					<div className="page-header-actions">
						<a className="back-link" href="/setlists">
							← SETLISTS
						</a>
					</div>
					<div className="song-hero-copy">
						<div className="eyebrow-row">
							<span className="eyebrow">Fiche du setlist</span>
							{!editing ? (
								<button
									className="icon-button"
									type="button"
									onClick={() => setEditing(true)}
									aria-label="Modifier la setlist">
									<Icon name="edit" className="icon-button-icon" />
								</button>
							) : null}
							<button
								className="icon-button button-danger"
								type="button"
								aria-label={`Supprimer ${setlist.title}`}
								title="Supprimer la setlist"
								disabled={deleting}
								onClick={handleDelete}>
								<Icon name="trash" className="icon-button-icon" />
							</button>
						</div>
						<h1>{setlist.title}</h1>
					</div>
				</div>

				<div className="setlist-detail-header-meta">
					<div className="song-meta-badges">
						<span className="meta-pill">
							{practiceSongs.length}{" "}
							{practiceSongs.length === 1 ? "morceau" : "morceaux"}
						</span>
						<span className="meta-pill">
							Créé le{" "}
							{new Intl.DateTimeFormat("fr-FR", {
								day: "numeric",
								month: "short",
								year: "numeric",
							}).format(new Date(setlist._creationTime))}
						</span>
					</div>
					<div className="page-header-actions">
						{practiceSongs.length > 0 && (
							<button
								className="button button-secondary"
								type="button"
								onClick={togglePractice}
								disabled={editing || saving || deleting}>
								{practiceIndex === null
									? "Répéter la setlist"
									: "Quitter la répétition"}
							</button>
						)}
					</div>
				</div>
			</header>

			{editing ? (
				<form className="detail-grid detail-grid-edit" onSubmit={handleSave}>
					<div className="detail-field">
						<span>Titre</span>
						<input
							value={draft.title}
							onChange={(event) =>
								setDraft((current) => ({
									...current,
									title: event.target.value,
								}))
							}
							required
						/>
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

					<div className="detail-field detail-field-wide">
						<button className="button" type="submit" disabled={saving}>
							{saving ? "Enregistrement…" : "Enregistrer les modifications"}
						</button>
					</div>
				</form>
			) : (
				setlist.notes && (
					<section className="detail-field detail-field-wide">
						<span>Notes</span>
						<strong>{setlist.notes}</strong>
					</section>
				)
			)}

			{currentPracticeSong && practiceIndex !== null && (
				<section
					className={`practice-panel ${practiceFullscreen ? "practice-panel-fullscreen" : ""}`}
					aria-live="polite"
					onTouchStart={handlePracticeTouchStart}
					onTouchEnd={handlePracticeTouchEnd}>
					<div className="practice-panel-heading">
						<div>
							<span>Répétition en cours</span>
							<strong>
								{currentPracticeSong.song?.title ?? "Morceau inconnu"}
							</strong>
						</div>
						<span>
							{practiceIndex + 1} / {practiceSongs.length}
						</span>
						<button
							className="button button-secondary"
							type="button"
							onClick={togglePractice}>
							Quitter la répétition
						</button>
					</div>

					<div className="practice-song-meta">
						<span>{currentPracticeSong.song?.bpm ?? "—"} BPM</span>
						<span>
							{currentPracticeSong.song?.key ?? "Tonalité non définie"}
						</span>
						<span>
							{currentPracticeSong.song?.tuning ?? "Accordage non défini"}
						</span>
					</div>

					<div className="practice-progress">
						<span
							style={{
								width: `${((practiceIndex + 1) / practiceSongs.length) * 100}%`,
							}}
						/>
					</div>

					<div className="practice-actions">
						<button
							className="button button-secondary"
							type="button"
							disabled={practiceIndex === 0}
							onClick={() =>
								setPracticeIndex((current) => Math.max(0, (current ?? 0) - 1))
							}>
							Morceau précédent
						</button>
						<button
							className="button"
							type="button"
							disabled={practiceIndex === practiceSongs.length - 1}
							onClick={() =>
								setPracticeIndex((current) =>
									Math.min(practiceSongs.length - 1, (current ?? 0) + 1),
								)
							}>
							Morceau suivant
						</button>
					</div>

					<SongLyrics
						songId={currentPracticeSong.songId}
						showEditButton={false}
					/>
				</section>
			)}

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragCancel={() => setActiveSongId(null)}
				onDragEnd={handleDragEnd}>
				<section className="songs-table setlist-songs-table">
					<div className="songs-table-header">
						<span>Order</span>
						<span>#</span>
						<span>Morceau</span>
					</div>

					<SortableContext
						items={orderedSongs.map((row) => row.songId)}
						strategy={verticalListSortingStrategy}>
						{orderedSongs.map((row, index) => (
							<SortableSongRow
								key={row._id}
								row={row as SetlistSong}
								index={index}
							/>
						))}
					</SortableContext>
				</section>

				<DragOverlay>
					{activeSongId ? (
						<div className="setlist-drag-overlay">
							{orderedSongs.find((row) => row.songId === activeSongId)?.song
								?.title ?? "Morceau"}
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	)
}
