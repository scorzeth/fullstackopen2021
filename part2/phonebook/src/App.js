import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
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

  const addPerson = (event) => {
    event.preventDefault()
    if (newName !== '') {
      if (persons.findIndex(person => person.name === newName) !== -1) {
        window.alert(`${newName} has already been added to the phonebook`)
      } else {
        const newPerson = { name: newName, number: newNumber }
        axios
          .post('http://localhost:3001/persons', newPerson)
          .then(response => {
            setPersons(persons.concat(response.data))
          })
      }
      setNewName('')
      setNewNumber('')
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
      />
    </div>
  )
}

export default App