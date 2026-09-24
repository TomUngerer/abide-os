import { getVocalistClass, practiceLine } from "./lyricUtils"
import type { Section, SingerFilter, ViewMode } from "./types"

function LyricViewer({
	sections,
	view,
	practiceMode,
	singerFilter,
}: {
	sections: Section[]
	view: ViewMode
	practiceMode: "start" | "end"
	singerFilter: SingerFilter
}) {
	if (!sections.length) {
		return (
			<div className="lyrics-empty">
				<p>Aucune parole n'a encore été ajoutée.</p>
				<p>Utilisez « Modifier les paroles » pour structurer le morceau.</p>
			</div>
		)
	}

	return (
		<div className={`lyrics-view lyrics-view-${view}`}>
			{sections.map((section, index) => {
				if (
					(view === "no-repeats" || view === "practice") &&
					section.repeatOfIndex !== undefined
				) {
					return (
						<div className="lyrics-repeat" key={index}>
							{section.title} <span>× répétition</span>
						</div>
					)
				}

				const sourceSection =
					section.repeatOfIndex !== undefined
						? sections[section.repeatOfIndex]
						: section

				const visibleLines =
					singerFilter === "all"
						? sourceSection.lines
						: sourceSection.lines.filter((line) =>
								line.singers.includes(singerFilter),
							)

				return (
					<section className="lyric-section" key={index}>
						<div className="lyric-section-title">
							{section.title}

							{section.repeatOfIndex !== undefined && <span>répétition</span>}
						</div>

						<div className="lyric-lines">
							{visibleLines.map((line, lineIndex) => (
								<div className="lyric-line" key={lineIndex}>
									<div
										className={`lyric-text vocalist-${getVocalistClass(line.singers)}`}>
										{view === "practice"
											? practiceLine(line.text, practiceMode)
											: line.text}
									</div>
								</div>
							))}
						</div>
					</section>
				)
			})}
		</div>
	)
}

export default LyricViewer
