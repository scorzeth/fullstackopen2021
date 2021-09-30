import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

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

  const updatePerson = (person) => {
    const updatedPerson = { ...person, number: newNumber }
    personService
      .update(person.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
      })
      .catch(error => {
        alert(
          `${newName} was already deleted from the server`
        )
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (newName !== '') {
      if (persons.findIndex(person => person.name === newName) !== -1) {
        const person = persons.find(p => p.name === newName)
        if (window.confirm(`${newName} has already been added to the phonebook, replace the old number with a new one?`)) {
          updatePerson(person)
        }
      } else {
        const newPerson = { name: newName, number: newNumber }
        personService
          .create(newPerson)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
          })
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
      <PersonForm addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
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