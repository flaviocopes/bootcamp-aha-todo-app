import type {
  ProjectsRecord,
  ProjectsResponse,
  TasksRecord,
  TasksResponse,
  TypedPocketBase,
} from '@src/data/pocketbase-types'

type TexpandProject = {
  project?: ProjectsResponse
}

export async function getProjects(pb: TypedPocketBase) {
  const projects = await pb.collection('projects').getFullList()

  return projects.sort((a, b) => getStatus(a) - getStatus(b))
}

export async function addProject(pb: TypedPocketBase, name: string) {
  const newProject = await pb.collection('projects').create({
    name,
    status: 'not started',
  })

  return newProject
}

export async function getProject(pb: TypedPocketBase, id: string) {
  const project = await pb.collection('projects').getOne(id)

  return project
}

export async function addTask(
  pb: TypedPocketBase,
  project_id: string,
  text: string
) {
  const newTask = await pb.collection('tasks').create({
    project: project_id,
    text,
  })

  return newTask
}

export async function getTasks({
  pb,
  project_id = null,
  done = false,
}: {
  pb: TypedPocketBase
  project_id: string | null
  done: boolean
}): Promise<TasksResponse<TexpandProject>[]> {
  const options = {
    filter: '',
  }
  let filter = `completed = ${done}`
  filter += ` && project = "${project_id}"`
  options.filter = filter

  let tasks: TasksResponse<TexpandProject>[] = []

  tasks = await pb.collection('tasks').getFullList(options)

  return tasks
}

function getStatus(project: ProjectsResponse) {
  switch (project.status) {
    case 'not started':
      return 7
    case 'on hold':
      return 6
    case 'started':
      return 5
    case 'in progress':
      return 4
    case 'almost finished':
      return 3
    case 'ongoing':
      return 2
    case 'done':
      return 1
    default:
      return 0
  }
}

export async function deleteProject(pb: TypedPocketBase, id: string) {
  await pb.collection('projects').delete(id)
}

export async function updateProject(
  pb: TypedPocketBase,
  id: string,
  data: ProjectsRecord
) {
  await pb.collection('projects').update(id, data)
}

export async function deleteTask(pb: TypedPocketBase, id: string) {
  await pb.collection('tasks').delete(id)
}

export async function updateTask(
  pb: TypedPocketBase,
  id: string,
  data: TasksRecord
) {
  await pb.collection('tasks').update(id, data)
}

export async function getStarredTasks(
  pb: TypedPocketBase
): Promise<TasksResponse<TexpandProject>[]> {
  const options = {
    sort: '-starred_on',
    filter: 'starred = true && completed = false',
    expand: 'project',
  }

  const tasks: TasksResponse<TexpandProject>[] = await pb
    .collection('tasks')
    .getFullList(options)

  return tasks
}
