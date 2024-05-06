import { useState, useEffect } from 'react'
import personService from './services/persons'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)

  const style = {
    notification: 'notification',
    error: 'error'
  }

  useEffect(() => {
    console.log('effect')
    personService.getAll().then(persons => {
        setPersons(persons)
      })
  }, [])

  const filteredPersons = persons?.filter(person =>
    person.name?.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()));

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const updatePerson = (updatedPerson) => {
    personService
      .update(updatedPerson.id, updatedPerson).then(returnedPerson => {
        //console.log('updatePerson', updatedPerson, returnedPerson)
        setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
        showNotification(`Updated ${returnedPerson.name}`, style.notification)
      })
      .catch(error => {
        setPersons(persons.filter(p => p.id !== updatedPerson.id))
        showNotification(
          `Information of ${updatedPerson.name} has already been removed from server - ${error}`,
          style.error)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObj = { 
      name: newName,
      number: newNumber
    }
    const person = persons.find(person => person.name?.toLocaleLowerCase() ===
      personObj.name?.toLocaleLowerCase())
    if (person) {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new number?`)) {
        personObj.id = person.id
        updatePerson(personObj)
      }
    }
    else {
      personService
      .create(personObj)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`, style.notification)
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const showNotification = (msg, style) => {
    setNotificationStyle(style)
    setNotificationMessage(msg)

    setTimeout(() => {
      setNotificationStyle(null)
      setNotificationMessage(null)
    }, 5000)
  }

  const handleDelete = (id) => {
    const person = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${person.name}`, style.notification)
        })
    }
  }

  if (filteredPersons === null) {
    return null
  }

  return (
    <div>
      <Notification message={notificationMessage} style={notificationStyle} />
      <h2>Phonebook</h2>
      <Filter filter={filter} handleChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App