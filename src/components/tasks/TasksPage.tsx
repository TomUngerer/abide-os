import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import Icon from "../app/Icon"

const statusLabels = {
	todo: "À faire",
	in_progress: "En cours",
	done: "Terminé",
} as const

const priorityLabels = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute",
} as const

export default function TasksPage() {
	const tasks = useQuery(api.tasks.list)
	const createTask = useMutation(api.tasks.create)
	const updateStatus = useMutation(api.tasks.updateStatus)
	const removeTask = useMutation(api.tasks.remove)
	const [title, setTitle] = useState("")
	const [priority, setPriority] =
		useState<keyof typeof priorityLabels>("medium")
	const [dueDate, setDueDate] = useState("")
	const [saving, setSaving] = useState(false)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!title.trim()) return

		setSaving(true)
		try {
			await createTask({
				title,
				priority,
				dueDate: dueDate || undefined,
			})
			setTitle("")
			setDueDate("")
		} finally {
			setSaving(false)
		}
	}

	if (tasks === undefined)
		return <div className="page-empty">Chargement des tâches…</div>

	const openTasks = tasks.filter((task) => task.status !== "done")
	const completedTasks = tasks.filter((task) => task.status === "done")

	const completeTask = (taskId: string) =>
		updateStatus({ taskId: taskId as any, status: "done" })

	return (
		<div className="page tasks-page">
			<header className="page-header">
				<div>
					<h1>Tâches</h1>
				</div>
				<span className="page-count">{openTasks.length} ouvertes</span>
			</header>

			<form className="task-create-form" onSubmit={handleSubmit}>
				<div className="detail-field task-title-field">
					<span>Tâche</span>
					<input
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Préparer le guide vocal"
						required
					/>
				</div>
				<div className="detail-field">
					<span>Priorité</span>
					<select
						value={priority}
						onChange={(event) =>
							setPriority(event.target.value as keyof typeof priorityLabels)
						}>
						{Object.entries(priorityLabels).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>
				<div className="detail-field">
					<span>Date limite</span>
					<input
						type="date"
						value={dueDate}
						onChange={(event) => setDueDate(event.target.value)}
					/>
				</div>
				<button
					className="button task-create-button"
					type="submit"
					disabled={saving}>
					{saving ? "Ajout…" : "Ajouter la tâche"}
				</button>
			</form>

			<section className="task-list-section">
				<div className="task-section-heading">
					<span>Tâches ouvertes</span>
					<span>{openTasks.length}</span>
				</div>
				{openTasks.length === 0 ? (
					<div className="page-empty">Aucune tâche ouverte.</div>
				) : (
					<div className="task-list">
						{openTasks.map((task) => (
							<div className="task-row" key={task._id}>
								<div className="task-row-main">
									<strong>{task.title}</strong>
									{task.dueDate && <span>Échéance : {task.dueDate}</span>}
								</div>
								<select
									className={`task-status task-status-${task.status}`}
									value={task.status}
									onChange={(event) =>
										updateStatus({
											taskId: task._id,
											status: event.target.value as
												"todo" | "in_progress" | "done",
										})
									}>
									{Object.entries(statusLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
								<div className="task-priority-actions">
									<span className={`priority ${task.priority}`}>
										{priorityLabels[task.priority]}
									</span>
									<div className="task-row-actions">
										<button
											className="icon-button task-complete-button"
											type="button"
											aria-label={`Terminer ${task.title}`}
											title="Terminer la tâche"
											onClick={() => completeTask(task._id)}>
											<Icon name="done" className="icon-button-icon" />
										</button>
										<button
											className="icon-button button-danger"
											type="button"
											aria-label={`Supprimer ${task.title}`}
											title="Supprimer la tâche"
											onClick={() => removeTask({ taskId: task._id })}>
											<Icon name="trash" className="icon-button-icon" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="task-list-section task-list-completed">
				<div className="task-section-heading">
					<span>Terminées</span>
					<span>{completedTasks.length}</span>
				</div>
				{completedTasks.length === 0 ? (
					<div className="page-empty">
						Aucune tâche terminée pour le moment.
					</div>
				) : (
					<div className="task-list">
						{completedTasks.map((task) => (
							<div className="task-row" key={task._id}>
								<div className="task-row-main task-completed-row-main">
									<strong className="task-completed-title">{task.title}</strong>
									<button
										className="icon-button button-danger"
										type="button"
										aria-label={`Supprimer ${task.title}`}
										title="Supprimer la tâche"
										onClick={() => removeTask({ taskId: task._id })}>
										<Icon name="trash" className="icon-button-icon" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	)
}
