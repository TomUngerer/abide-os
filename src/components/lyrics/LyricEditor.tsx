import { useEffect, useRef } from "react"
import Icon from "../app/Icon"
import { singerLabels, type Section, type Singer } from "./types"

function LyricEditor({
	sections,
	onAddSection,
	onRemoveSection,
	onAddLine,
	onPasteLines,
	onUpdateSectionTitle,
	onUpdateLine,
	onToggleSinger,
	onSetRepeat,
}: {
	sections: Section[]
	onAddSection: () => void
	onRemoveSection: (sectionIndex: number) => void
	onAddLine: (sectionIndex: number, lineIndex?: number) => void
	onPasteLines: (
		sectionIndex: number,
		lineIndex: number,
		text: string[],
	) => void
	onUpdateSectionTitle: (index: number, title: string) => void
	onUpdateLine: (sectionIndex: number, lineIndex: number, text: string) => void
	onToggleSinger: (
		sectionIndex: number,
		lineIndex: number,
		singer: Singer,
	) => void
	onSetRepeat: (index: number, repeatOfIndex: number | undefined) => void
}) {
	const pendingFocus = useRef<{
		sectionIndex: number
		lineIndex: number
	} | null>(null)

	useEffect(() => {
		if (!pendingFocus.current) return

		const { sectionIndex, lineIndex } = pendingFocus.current
		const input = document.querySelector<HTMLInputElement>(
			`[data-lyric-section="${sectionIndex}"][data-lyric-line="${lineIndex}"]`,
		)

		if (!input) return

		input.focus()
		pendingFocus.current = null
	}, [sections])

	return (
		<div className="lyrics-editor">
			{sections.map((section, sectionIndex) => (
				<div className="editor-section" key={sectionIndex}>
					<div className="editor-section-header">
						<div className="editor-section-title-row">
							<input
								value={section.title}
								onChange={(event) =>
									onUpdateSectionTitle(sectionIndex, event.target.value)
								}
								aria-label="Nom de la section"
							/>

							<button
								className="icon-button button-danger editor-section-remove"
								type="button"
								aria-label={`Supprimer ${section.title || "la section"}`}
								title="Supprimer la section"
								onClick={() => onRemoveSection(sectionIndex)}>
								<Icon name="trash" className="icon-button-icon" />
							</button>
						</div>

						<select
							value={
								section.repeatOfIndex === undefined ? "" : section.repeatOfIndex
							}
							onChange={(event) =>
								onSetRepeat(
									sectionIndex,
									event.target.value === ""
										? undefined
										: Number(event.target.value),
								)
							}>
							<option value="">Section originale</option>

							{sections.slice(0, sectionIndex).map((candidate, index) => (
								<option value={index} key={index}>
									Répéter : {candidate.title}
								</option>
							))}
						</select>
					</div>

					{section.repeatOfIndex === undefined && (
						<div className="editor-lines">
							{section.lines.map((line, lineIndex) => (
								<div className="editor-line" key={lineIndex}>
									<input
										data-lyric-section={sectionIndex}
										data-lyric-line={lineIndex}
										value={line.text}
										onPaste={(event) => {
											const pastedText = event.clipboardData.getData("text")
											if (!pastedText.includes("\n")) return

											event.preventDefault()
											const start =
												event.currentTarget.selectionStart ?? line.text.length
											const end = event.currentTarget.selectionEnd ?? start
											const nextText = `${line.text.slice(0, start)}${pastedText}${line.text.slice(end)}`
											const pastedLines = nextText.split(/\r?\n/)
											pendingFocus.current = {
												sectionIndex,
												lineIndex: lineIndex + pastedLines.length - 1,
											}
											onPasteLines(sectionIndex, lineIndex, pastedLines)
										}}
										onKeyDown={(event) => {
											if (event.key !== "Enter") return

											event.preventDefault()
											pendingFocus.current = {
												sectionIndex,
												lineIndex: lineIndex + 1,
											}
											onAddLine(sectionIndex, lineIndex)
										}}
										onChange={(event) =>
											onUpdateLine(sectionIndex, lineIndex, event.target.value)
										}
										placeholder="Ligne de paroles…"
									/>

									<div className="singer-buttons">
										{(Object.keys(singerLabels) as Singer[]).map((singer) => (
											<button
												key={singer}
												type="button"
												className={
													line.singers.includes(singer) ? "active" : ""
												}
												title={singerLabels[singer]}
												aria-label={singerLabels[singer]}
												onClick={() =>
													onToggleSinger(sectionIndex, lineIndex, singer)
												}>
												<span
													className={`singer-avatar singer-avatar-${singer}`}>
													{singer.charAt(0).toUpperCase()}
												</span>
											</button>
										))}
									</div>
								</div>
							))}

							<button
								className="add-line"
								type="button"
								onClick={() => onAddLine(sectionIndex)}>
								+ Ajouter une ligne
							</button>
						</div>
					)}
				</div>
			))}

			<button className="add-section" type="button" onClick={onAddSection}>
				+ Ajouter une section
			</button>
		</div>
	)
}

export default LyricEditor
