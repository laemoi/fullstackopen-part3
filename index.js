const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

let data =
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
app.use(cors())
app.use(express.static("dist"))
const body = morgan.token("body", (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


app.get("/api/persons", (req, res) => {
  res.json(data)
})

app.post("/api/persons", (req, res) => {
  const person = req.body
  if (!person.name) {
    res.status(400).json({ error: "Name is missing" })
  }
  else if (!person.number) {
    res.status(400).json({ error: "Number is missing" })
  }
  else if (data.map(p => p.name).includes(person.name)) {
    res.status(400).json({ error: "A person with this name is already in the phonebook" })
  }
  else {
    person.id = Math.floor(Math.random() * 100000)
    data = data.concat(person)

    res.json(person)
  }

})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = data.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
  
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  data = data.filter(p => p.id !== id)

  res.status(204).end()

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

const PORT = process.env.PORT || 3001
app.listen(PORT)