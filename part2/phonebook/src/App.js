import React, { useState } from 'react'

const Person = ({ name }) => {
  return (
    <div>{ name }</div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (newName !== '') {
      if (persons.findIndex(person => person.name === newName) !== -1) {
        window.alert(`${newName} has already been added to the phonebook`)
      } else {
        setPersons(persons.concat({ name: newName }))
      }
      setNewName('')
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
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <Person key={person.name} name={person.name} />)}
    </div>
  )
}

export default App