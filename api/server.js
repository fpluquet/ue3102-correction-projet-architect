import express from 'express';
import cors from 'cors';


// models
let projects = [
  {
    id: 1,
    name: "Project 1 from server",
  }
]

// api

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", express.static("../public"))

app.get('/projects', (req, res) => {
  res.send(projects)
})

app.post('/project', (req, res) => {
  setTimeout(() => {
    console.log(res.body)
    const projectData = req.body

    const newProject = {
      id: projects.length + 1,
      name: projectData.name,
    }
    projects.push(newProject)
      res.send(newProject)
  }, 2000)
})

app.delete('/project/:id', (req, res) => {
  projects = projects.filter(project => project.id !== Number(req.params.id))
  res.send("Ok :D")
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
