// models

let projects = [
  {
    id: 1,
    name: "Project 1",
  }
]
let currentProject = undefined

// elements
const listProjectsElement = document.getElementById("listProjects")
const projectDescriptionElement = document.querySelector(".project-header p")
const projectNameElement = document.querySelector("#project-header-name")
const mainWrapperCenterElement = document.querySelector(".mainWrapper-center")

// functions

function updateProjects() {
  listProjectsElement.innerHTML = ""
  projects.forEach(project => {
    const listItemElement = document.createElement("li")
    if(currentProject == project) {
      listItemElement.classList.add("selected")
    }
    const spanName = document.createElement("span")
    spanName.textContent = project.name
    const deleteProjectButton = document.createElement("button")
    deleteProjectButton.textContent = "D"
    listItemElement.appendChild(spanName)
    listItemElement.appendChild(deleteProjectButton)

    deleteProjectButton.addEventListener("click", async () => {
      api.deleteProject(project)
    })
    listProjectsElement.appendChild(listItemElement)
    listItemElement.addEventListener("click", () => {
      setCurrentProject(project)
      updateProjects()
    })
  })
}
function setNoProject() {
  currentProject = undefined
  mainWrapperCenterElement.classList.add("hidden")
}
function setCurrentProject(project) {
  currentProject = project
  projectNameElement.innerText = project.name
  projectDescriptionElement.innerText = project.description
  mainWrapperCenterElement.classList.remove("hidden")
}

// api calls functions
const baseUrl = "http://localhost:3000"

const api = {
  loadProjects : async function () {
    const response = await fetch(`${baseUrl}/projects`)
    projects = await response.json()
    console.table(projects)
    updateProjects()
  },
  createProject: async function () {
    await fetch(`${baseUrl}/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Project ${projects.length + 1}`,
      })
    })
  },
  updateProject: async function (project) {
    await fetch(`${baseUrl}/project/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project)
    })
  },
  deleteProject: async function (project) {
    projects = projects.filter(p => p.id !== project.id)
    updateProjects()
    await fetch(`${baseUrl}/project/${project.id}`, {
      method: "DELETE",
    })
    setNoProject()
    await api.loadProjects()
  }
}


// events
document.getElementById("createProjectButton").addEventListener("click", async () => {
  projects.push({
    id: projects.length + 1,
    name: `Project ${projects.length + 1}`,
  })
  updateProjects()
  await api.createProject()
  await api.loadProjects()
})

let lastTimeout = undefined

projectNameElement.addEventListener("input", () => {
  const newName = projectNameElement.innerText
  currentProject.name = newName
  updateProjects()
  if(lastTimeout) clearTimeout(lastTimeout)
  lastTimeout = setTimeout(() => {
    api.updateProject(currentProject)
  }, 1000)
})

projectDescriptionElement.addEventListener("input", () => {
  const newDescription = projectDescriptionElement.innerText
  currentProject.description = newDescription
  api.updateProject(currentProject)
})

// main flow

api.loadProjects()

