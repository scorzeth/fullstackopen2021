import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city, weather }) => {
  if (weather.length === 0) return (<div></div>)
  return (
    <div>
      <h2>Weather in {city}</h2>
      <b>Temperature: </b>{weather.main.temp}° <br />
      <b>Humidity: </b>{weather.main.humidity}% <br />
      {weather.weather[0].description} <br />
      <br />
    </div>
  )
}

const Details = ({ country }) => {
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

const CountryDetail = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY
  const api_city = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`
  const [ weather, setWeather ] = useState([])

  useEffect(() => {
    axios
      .get(api_city)
      .then(response => {
        setWeather(response.data)
      })
  }, [api_city])

  return (
    <div>
      <Details country={country} />
      <Weather city={country.capital} weather={weather} />
    </div>
  )
}

export default CountryDetail