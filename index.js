require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person.js")

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
  Person
    .find({})
    .then(people => res.json(people))
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body.name) {
    res.status(400).json({ error: "Name is missing" })
  }
  else if (!body.number) {
    res.status(400).json({ error: "Number is missing" })
  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => res.json(savedPerson))
  }
})

app.get("/api/persons/:id", (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => res.json(person))
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