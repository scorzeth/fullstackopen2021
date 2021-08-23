import React, { useState } from 'react'

const Person = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.name} person={person} />)}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (newName !== '') {
      if (persons.findIndex(person => person.name === newName) !== -1) {
        window.alert(`${newName} has already been added to the phonebook`)
      } else {
        setPersons(persons.concat({ name: newName, number: newNumber }))
      }
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: 
          <input 
            value={newName} 
            onChange={(event) => setNewName(event.target.value)} 
            />
        </div>
        <div>
          number:
          <input 
            value={newNumber} 
            onChange={(event) => setNewNumber(event.target.value)} 
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  )
}

export default App