import React, { useState } from 'react'
import CountryDetail from './CountryDetail'

const DisplayCountry = ({ country, alone }) => {
  const [ show, setShow ] = useState(false)

  const handleDetail = (event) => {
    setShow(true)
  }

  if (show || alone) {
    return (
      <div>
        <CountryDetail country={country} />
      </div>
    )
  } else {
    return (
      <div>
        {country.name} 
        <button onClick={handleDetail}>show</button>
      </div>
    )
  }
}

const Display = ({ countries, filter }) => {
  const filterCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  
  if (filterCountries.length > 10 && filter !== '') {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (filterCountries.length > 0 && filter !== '') {
    return (
      <div>
        {countries
        .filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
        .map(country => 
          <DisplayCountry key={country.name} country={country} alone={filterCountries.length === 1} />
        )}
      </div>
    )
  } else {
    return (
      <div></div>
    )
  } 
}

export default Display