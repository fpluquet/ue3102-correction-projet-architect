import express from 'express';
import cors from 'cors';


// models
let projects = [
  {
    id: 1,
    name: "Project 1 from server",
    description: "Le projet en cours"
  }
]

let nextProjectId = 2

// api

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", express.static("../public"))

app.get('/projects', (req, res) => {
  res.send(projects)
})

app.post('/project', (req, res) => {
  const projectData = req.body

  const newProject = {
    id: nextProjectId++,
    name: projectData.name,
    description: projectData.description ?? "Description par défaut"
  }
  projects.push(newProject)
  res.send(newProject)
})

app.put('/project/:id', (req, res) => {
  const projectData = req.body
  const project = projects.find(project => project.id === Number(req.params.id))
  if(!project) return res.status(404).send("Not found")
  project.name = projectData.name
  project.description = projectData.description
  res.send(project)
})

app.delete('/project/:id', (req, res) => {
  projects = projects.filter(project => project.id !== Number(req.params.id))
  res.send("Ok :D")
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
