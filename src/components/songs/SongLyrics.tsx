import { useMutation, useQuery } from "convex/react"
import LyricViewer from "../lyrics/LyricViewer"
import { api } from "../../../convex/_generated/api"
import {
	singerLabels,
	type Section,
	type Singer,
	type SingerFilter,
	type ViewMode,
} from "../lyrics/types"
import { useMemo, useState } from "react"
import LyricEditor from "../lyrics/LyricEditor"
import Icon from "../app/Icon"
import type { Id } from "../../../convex/_generated/dataModel"

function SongLyrics({
	songId,
	showEditButton = true,
}: {
	songId: Id<"songs">
	showEditButton?: boolean
}) {
	const lyrics = useQuery(api.lyrics.getForSong, {
		songId,
	})

	const saveLyrics = useMutation(api.lyrics.replace)

	const [view, setView] = useState<ViewMode>("full")
	const [singerFilter, setSingerFilter] = useState<SingerFilter>("all")
	const [practiceMode, setPracticeMode] = useState<"start" | "end">("start")
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState<Section[]>([])
	const [saving, setSaving] = useState(false)

	const sections = useMemo<Section[]>(() => {
		if (!lyrics) {
			return []
		}

		return lyrics.sections.map((section) => ({
			title: section.title,
			position: section.position,
			repeatOfIndex: section.repeatOf
				? lyrics.sections.findIndex(
						(candidate) => candidate._id === section.repeatOf,
					)
				: undefined,
			lines: lyrics.lines
				.filter((line) => line.sectionId === section._id)
				.sort((a, b) => a.position - b.position)
				.map((line) => ({
					text: line.text,
					position: line.position,
					singers: line.singers as Singer[],
				})),
		}))
	}, [lyrics])

	function startEditing() {
		setDraft(
			sections.length
				? structuredClone(sections)
				: [
						{
							title: "Verse 1",
							position: 0,
							lines: [
								{
									text: "",
									position: 0,
									singers: ["tom"],
								},
							],
						},
					],
		)
		setEditing(true)
	}

	function addSection() {
		setDraft((current) => [
			...current,
			{
				title: `Section ${current.length + 1}`,
				position: current.length,
				lines: [
					{
						text: "",
						position: 0,
						singers: ["tom"],
					},
				],
			},
		])
	}

	function addLine(sectionIndex: number, lineIndex?: number) {
		setDraft((current) =>
			current.map((section, index) =>
				index === sectionIndex
					? {
							...section,
							lines: (() => {
								const insertAt =
									lineIndex === undefined ? section.lines.length : lineIndex + 1
								const lines = [...section.lines]
								lines.splice(insertAt, 0, {
									text: "",
									position: insertAt,
									singers: ["tom"],
								})
								return lines.map((line, position) => ({ ...line, position }))
							})(),
						}
					: section,
			),
		)
	}

	function pasteLines(sectionIndex: number, lineIndex: number, text: string[]) {
		setDraft((current) =>
			current.map((section, index) =>
				index === sectionIndex
					? {
							...section,
							lines: [
								...section.lines.slice(0, lineIndex),
								...text.map((lineText) => ({
									text: lineText,
									position: 0,
									singers: section.lines[lineIndex].singers,
								})),
								...section.lines.slice(lineIndex + 1),
							].map((line, position) => ({ ...line, position })),
						}
					: section,
			),
		)
	}

	function updateSectionTitle(index: number, title: string) {
		setDraft((current) =>
			current.map((section, sectionIndex) =>
				sectionIndex === index ? { ...section, title } : section,
			),
		)
	}

	function updateLine(sectionIndex: number, lineIndex: number, text: string) {
		setDraft((current) =>
			current.map((section, index) =>
				index === sectionIndex
					? {
							...section,
							lines: section.lines.map((line, currentLine) =>
								currentLine === lineIndex ? { ...line, text } : line,
							),
						}
					: section,
			),
		)
	}

	function toggleSinger(
		sectionIndex: number,
		lineIndex: number,
		singer: Singer,
	) {
		setDraft((current) =>
			current.map((section, index) => {
				if (index !== sectionIndex) {
					return section
				}

				return {
					...section,
					lines: section.lines.map((line, currentLine) => {
						if (currentLine !== lineIndex) {
							return line
						}

						const singers = line.singers.includes(singer)
							? line.singers.filter((value) => value !== singer)
							: [...line.singers, singer]

						return {
							...line,
							singers: singers.length ? singers : [singer],
						}
					}),
				}
			}),
		)
	}

	function setRepeat(index: number, repeatOfIndex: number | undefined) {
		setDraft((current) =>
			current.map((section, sectionIndex) =>
				sectionIndex === index
					? {
							...section,
							repeatOfIndex,
							lines: repeatOfIndex === undefined ? section.lines : [],
						}
					: section,
			),
		)
	}

	async function save() {
		setSaving(true)

		try {
			await saveLyrics({
				songId,
				sections: draft.map((section, position) => ({
					title: section.title.trim() || `Section ${position + 1}`,
					position,
					repeatOfIndex: section.repeatOfIndex,
					lines:
						section.repeatOfIndex === undefined
							? section.lines
									.filter((line) => line.text.trim())
									.map((line, linePosition) => ({
										text: line.text.trim(),
										position: linePosition,
										singers: line.singers,
									}))
							: [],
				})),
			})

			setEditing(false)
		} finally {
			setSaving(false)
		}
	}

	if (lyrics === undefined) {
		return (
			<div className="page">
				<div className="page-empty">Loading lyrics…</div>
			</div>
		)
	}

	return (
		<section className="lyrics-section">
			<div className="lyrics-header">
				<div className="lyrics-title-wrap">
					<div className="eyebrow-row">
						<p className="eyebrow">LYRICS</p>
						{!editing && showEditButton ? (
							<button
								className="icon-button"
								type="button"
								onClick={startEditing}
								aria-label="Edit lyrics">
								<Icon name="edit" className="icon-button-icon" />
							</button>
						) : null}
					</div>
					<div className="lyrics-title-row">
						<h2>{editing ? "Edit lyrics" : ""}</h2>
					</div>
				</div>

				{editing ? (
					<div className="lyrics-actions">
						<button
							className="button button-secondary"
							type="button"
							onClick={() => setEditing(false)}>
							Cancel
						</button>

						<button
							className="button"
							type="button"
							onClick={save}
							disabled={saving}>
							{saving ? "Saving…" : "Save lyrics"}
						</button>
					</div>
				) : null}
			</div>

			{editing ? (
				<LyricEditor
					sections={draft}
					onAddSection={addSection}
					onAddLine={addLine}
					onPasteLines={pasteLines}
					onUpdateSectionTitle={updateSectionTitle}
					onUpdateLine={updateLine}
					onToggleSinger={toggleSinger}
					onSetRepeat={setRepeat}
				/>
			) : (
				<>
					<div className="lyrics-toolbar">
						<div className="view-switcher">
							<button
								className={view === "full" ? "active" : ""}
								onClick={() => setView("full")}
								type="button">
								Full
							</button>

							<button
								className={view === "no-repeats" ? "active" : ""}
								onClick={() => setView("no-repeats")}
								type="button">
								No repeats
							</button>

							<button
								className={view === "practice" ? "active" : ""}
								onClick={() => setView("practice")}
								type="button">
								Practice
							</button>
							{view === "practice" && (
								<div className="practice-switcher">
									<button
										className={practiceMode === "start" ? "active" : ""}
										onClick={() => setPracticeMode("start")}
										type="button">
										<Icon name="alignLeft" />
									</button>

									<button
										className={practiceMode === "end" ? "active" : ""}
										onClick={() => setPracticeMode("end")}
										type="button">
										<Icon name="alignRight" />
									</button>
								</div>
							)}
						</div>

						<div className="view-switcher singer-filter-switcher">
							<button
								className={singerFilter === "all" ? "active" : ""}
								onClick={() => setSingerFilter("all")}
								type="button">
								All
							</button>

							{(Object.keys(singerLabels) as Singer[]).map((singer) => (
								<button
									key={singer}
									className={`singer-filter-button singer-filter-${singer} ${
										singerFilter === singer ? "active" : ""
									}`}
									onClick={() => setSingerFilter(singer)}
									title={singerLabels[singer]}
									aria-label={singerLabels[singer]}
									type="button">
									<span className={`singer-avatar singer-avatar-${singer}`}>
										{singer.charAt(0).toUpperCase()}
									</span>
								</button>
							))}
						</div>
					</div>

					<LyricViewer
						sections={sections}
						view={view}
						practiceMode={practiceMode}
						singerFilter={singerFilter}
					/>
				</>
			)}
		</section>
	)
}

export default SongLyrics
