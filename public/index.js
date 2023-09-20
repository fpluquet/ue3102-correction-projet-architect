// models

// const promise = fetch("http://localhost:3000/projects")
//
// promise.then(async response => {
//   response.json().then(projects => {
//     console.log(projects)
//   })
// })

let projects = [
  {
    id: 1,
    name: "Project 1",
  }
]

async function loadProjects() {
  const response = await fetch("http://localhost:3000/projects")
  projects = await response.json()
  console.table(projects)
  updateProjects()
}

loadProjects()


let currentProject = undefined

// elements
const listProjectsElement = document.getElementById("listProjects")

// functions

async function createProject() {
  await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Project ${projects.length + 1}`,
    })
  })
}
function updateProjects() {
  listProjectsElement.innerHTML = ""
  projects.forEach(project => {
    const listItemElement = document.createElement("li")
    const spanName = document.createElement("span")
    spanName.textContent = project.name
    const deleteProjectButton = document.createElement("button")
    deleteProjectButton.textContent = "D"
    listItemElement.appendChild(spanName)
    listItemElement.appendChild(deleteProjectButton)

    deleteProjectButton.addEventListener("click", async () => {
      deleteProject(project)
    })
    listProjectsElement.appendChild(listItemElement)
    listItemElement.addEventListener("click", () => {
      currentProject = project
      listProjectsElement.querySelector(".selected")?.classList.remove("selected")
      listItemElement.classList.add("selected")
    })
  })
}

async function deleteProject(project) {
  projects = projects.filter(p => p.id !== project.id)
  updateProjects()
  await fetch(`http://localhost:3000/project/${project.id}`, {
    method: "DELETE",
  })
  await loadProjects()
}


// events
document.getElementById("createProjectButton").addEventListener("click", async () => {
  projects.push({
    id: projects.length + 1,
    name: `Project ${projects.length + 1}`,
  })
  updateProjects()
  await createProject()
  await loadProjects()
})


