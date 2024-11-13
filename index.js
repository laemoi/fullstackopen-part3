require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person.js')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(people => res.json(people))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name) {
    res.status(400).json({ error: 'Name is missing' })
  }
  else if (!body.number) {
    res.status(400).json({ error: 'Number is missing' })
  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person
      .save()
      .then(savedPerson => res.json(savedPerson))
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(person => {
      if (person) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', async (req, res) => {
  const date = Date()
  let ppl
  await Person
    .find({})
    .then(people => ppl = people.length)

  res.send(
    `
      <p>Phonebook has info for ${ppl} people</p>
      <p>${date}</p>
    `
  )
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted id' } )
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)