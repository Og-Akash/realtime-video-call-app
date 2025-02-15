import { LoaderCircle } from 'lucide-react'
import React from 'react'

const Loader = ({children}) => {
  return (
    <div className="loader-container">
    <LoaderCircle className="loader" color="#7C3AED" />
    <p>{children}</p>
  </div>
  )
}

export default Loader
