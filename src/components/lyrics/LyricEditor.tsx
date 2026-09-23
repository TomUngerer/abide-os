import { singerLabels, type Section, type Singer } from "./types"

function LyricEditor({
	sections,
	onAddSection,
	onAddLine,
	onUpdateSectionTitle,
	onUpdateLine,
	onToggleSinger,
	onSetRepeat,
}: {
	sections: Section[]
	onAddSection: () => void
	onAddLine: (sectionIndex: number) => void
	onUpdateSectionTitle: (index: number, title: string) => void
	onUpdateLine: (sectionIndex: number, lineIndex: number, text: string) => void
	onToggleSinger: (
		sectionIndex: number,
		lineIndex: number,
		singer: Singer,
	) => void
	onSetRepeat: (index: number, repeatOfIndex: number | undefined) => void
}) {
	return (
		<div className="lyrics-editor">
			{sections.map((section, sectionIndex) => (
				<div className="editor-section" key={sectionIndex}>
					<div className="editor-section-header">
						<input
							value={section.title}
							onChange={(event) =>
								onUpdateSectionTitle(sectionIndex, event.target.value)
							}
							aria-label="Section name"
						/>

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
							<option value="">Original section</option>

							{sections.slice(0, sectionIndex).map((candidate, index) => (
								<option value={index} key={index}>
									Repeat: {candidate.title}
								</option>
							))}
						</select>
					</div>

					{section.repeatOfIndex === undefined && (
						<div className="editor-lines">
							{section.lines.map((line, lineIndex) => (
								<div className="editor-line" key={lineIndex}>
									<input
										value={line.text}
										onChange={(event) =>
											onUpdateLine(sectionIndex, lineIndex, event.target.value)
										}
										placeholder="Lyric line…"
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
								+ Add line
							</button>
						</div>
					)}
				</div>
			))}

			<button className="add-section" type="button" onClick={onAddSection}>
				+ Add section
			</button>
		</div>
	)
}

export default LyricEditor
