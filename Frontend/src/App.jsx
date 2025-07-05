import { useState } from 'react'
import { Navbar } from './components/Navbar'
import "./index.css"
import { Auth } from './pages/Auth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Navbar /> */}
      <Auth />
    </>
  )
}

export default App
