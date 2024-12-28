import React from 'react'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className='bg-zinc-900'>
      <Navbar/>
      <AppRoutes />
    </div>
  )
}

export default App
