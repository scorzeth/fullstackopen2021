import React from 'react'

const Person = ({ person, removePerson }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={(event) => removePerson(event, person)}>delete</button>
    </div>
  )
}

const Persons = ({ persons, filter, removePerson }) => {
  return (
    <div>
      {persons
      .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => <Person key={person.name} person={person} removePerson={removePerson} />)}
    </div>
  )
}

export default Persons