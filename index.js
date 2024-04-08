const express = require("express")
const app = express()

const data =
  [
      { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  ]

app.use(express.json())

app.get("/api/persons", (req, res) => {
  res.json(data)
})

app.get("/api/persons/:id", (req, res) => {
  console.log("retrieving info of person...")
  const id = Number(req.params.id)
  console.log(id)
  const person = data.find(p => p.id === id)
  console.log(person)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
  
})

app.get("/info", (req, res) => {
  const date = Date()
  const ppl = data.length
  res.send(
    `
      <p>Phonebook has info for ${ppl} people</p>
      <p>${date}</p>
    `
  )
})

const PORT = 3001
app.listen(PORT)