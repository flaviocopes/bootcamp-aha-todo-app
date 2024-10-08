export async function getProjects(pb: any) {
  const projects = await pb.collection('projects').getFullList()

  return projects
}

export async function addProject(pb: any, name: string) {
  const newProject = await pb.collection('projects').create({
    name,
    status: 'not started',
  })

  return newProject
}

export async function getProject(pb: any, id: string) {
  const project = await pb.collection('projects').getOne(id)

  return project
}

export async function addTask(pb: any, project_id: string, text: string) {
  const newTask = await pb.collection('tasks').create({
    project: project_id,
    text,
  })

  return newTask
}

export async function getTasks(pb: any, project_id: string) {
  const options = {
    filter: `project = "${project_id}"`,
  }

  const tasks = await pb.collection('tasks').getFullList(options)

  return tasks
}
