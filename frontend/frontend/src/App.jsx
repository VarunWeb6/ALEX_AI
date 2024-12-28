import React from 'react'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import {UserProvider} from './context/userContext'

function App() {
  return (
    <div className='bg-zinc-900'>
      <Navbar/>
      <UserProvider>
        <AppRoutes/>
      </UserProvider>
    </div>
  )
}

export default App
