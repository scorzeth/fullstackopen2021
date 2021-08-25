import React from 'react'

const DisplayDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      Capital: {country.capital} <br />
      Population: {country.population}
      <h2>Languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.iso639_1}>{language.name}</li>)}
      </ul>
      <img alt={country.name} src={country.flag} width='200' />
    </div>
  )
}

const Display = ({ countries, filter }) => {
  const filterCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  
  if (filterCountries.length > 10 && filter !== '') {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (filterCountries.length > 1 && filter !== '') {
    return (
      <div>
        {countries
        .filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
        .map(country => <div key={country.name}>{country.name}</div>)}
      </div>
    )
  } else if (filterCountries.length === 1) {
    return (
      <div>
        <DisplayDetail country={filterCountries[0]} />
      </div>
    )
  }

  return (
    <div></div>
  )
}

export default Display