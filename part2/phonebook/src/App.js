import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ isFailMessage, setIsFailMessage ] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (person) => {
    personService
      .create(person)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setIsFailMessage(false)
        setMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setIsFailMessage(true)
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const updatePerson = (person) => {
    const updatedPerson = { ...person, number: newNumber }
    personService
      .update(person.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        setIsFailMessage(false)
        setMessage(
          `Updated ${returnedPerson.name}'s number to ${returnedPerson.number}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        if (error.response.status === 404) {
          setIsFailMessage(true)
          setMessage(
            `${newName} was already deleted from the server`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== person.id))
        } else {
          setIsFailMessage(true)
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }
      })
  }

  const addEntry = (event) => {
    event.preventDefault()
    if (newName !== '') {
      if (persons.findIndex(person => person.name === newName) !== -1) {
        const person = persons.find(p => p.name === newName)
        if (window.confirm(`${newName} has already been added to the phonebook, replace the old number with a new one?`)) {
          updatePerson(person)
        }
      } else {
        const person = { name: newName, number: newNumber }
        addPerson(person)
      }
      setNewName('')
      setNewNumber('')
    }
  }

  const removePerson = (event, person) => {
    event.preventDefault()
    if (window.confirm(`Delete '${person.name}'?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter}
        handleFilter={handleFilter}
      />
      <h3>Add a new entry</h3>
      <PersonForm addPerson={addEntry}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <Notification message={message} 
        fail={isFailMessage}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} 
        filter={filter} 
        removePerson={removePerson}
      />
    </div>
  )
}

export default App