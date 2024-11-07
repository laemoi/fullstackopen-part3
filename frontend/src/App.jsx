import { useState, useEffect } from 'react'
import personService from "./services/persons"

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Filter = ({filter, handleFilter}) =>
  <div>
    Filter names: <input value={filter} onChange={handleFilter}/>
  </div>

const PersonForm = ({name, number, handleSubmit, handleNameChange, handleNumberChange}) =>
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={name} onChange={handleNameChange}/>
      <br></br>
      number: <input value={number} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Persons = ({persons, handleClick}) => 
  <div>
    {persons.map(p =>
      <div key={p.name}>
        {p.name} {p.number} <button id={p.id} value={p.name} onClick={handleClick}>delete</button>
      </div>
    )}
  </div>


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [shownPersons, setShownPersons] = useState([])
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState("success")

  useEffect( 
    () => {
      personService
        .getAll()
        .then(res => {
          setPersons(res)
          setShownPersons(res)
        })
    },  
    []
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...existingPerson, number: newNumber}
        personService
          .update(updatedPerson.id, updatedPerson)
          .then(res => {
            setPersons(persons.map(p => p.id !== updatedPerson.id ? p : updatedPerson))
            setNewName("")
            setNewNumber("")
            setShownPersons(
              persons
                .map(p => p.id !== updatedPerson.id ? p : updatedPerson)
                .filter(p => p.name.toLowerCase().includes(`${filter}`))
            )
            setNotification(`Updated ${updatedPerson.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationType("error")
            setNotification(`Information of ${updatedPerson.name} has already been removed from server`)
            setTimeout(() => {
              setNotificationType("success")
              setNotification(null)
            }, 5000)
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(res => {
          setPersons(persons.concat(res))
          setNewName("")
          setNewNumber("")
          setShownPersons(persons.concat(res).filter(p => p.name.toLowerCase().includes(`${filter}`)))
          setNotification(`Added ${newPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000) 
        })
    }

  }

  const handleRemove = (event) => {
    const id = event.target.id
    const name = event.target.value
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
      const newPersons = persons.filter(p => p.id !== id)
      setPersons(newPersons)
      setShownPersons(newPersons.filter(p => p.name.toLowerCase().includes(`${filter}`)))
    }
  }

  const handleFilter = (event) => {
    const f = event.target.value // This is added in order to filter properly (setFilter is asynchronous)
    setFilter(f)
    setShownPersons(persons.filter(p => p.name.toLowerCase().includes(`${f}`)))
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={filter} handleFilter={handleFilter} />    
      <h2>Add new:</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={shownPersons} handleClick={handleRemove} />     
    </div>
  )
}

export default App