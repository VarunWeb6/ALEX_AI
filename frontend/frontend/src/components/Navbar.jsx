import React from 'react'

function Navbar() {
  return (
    <div>
    <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">ALEX AI</div>
            <div className="space-x-4">
                <button className="text-white">Home</button>
                <button className="text-white">Login</button>
                <button className="text-white">Logout</button>
            </div>
        </div>
    </nav>
    </div>
  )
}

export default Navbar
