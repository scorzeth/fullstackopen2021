import React from 'react'

const Filter = ({ filter, handleFilter }) => {
  
  return (
    <div>
      Search countries
      <input 
        value={filter} 
        onChange={handleFilter}
      />
    </div>
  )
}

export default Filter