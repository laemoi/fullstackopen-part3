const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Missing argument: password')
  process.exit(1)
}

// Password can be accessed here since there are at least 3 arguments
const password = process.argv[2]
const url =
  `mongodb+srv://lassioinas:${password}@cluster0.v1kocfy.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result
      .map(p => `${p.name} ${p.number}`)
      .forEach(p => console.log(p))
    mongoose.connection.close()
    process.exit(0)
  })

} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({ name, number })
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    process.exit(0)
  })
}

else {
  console.log('Incorrect number of arguments!')
  process.exit(1)
}