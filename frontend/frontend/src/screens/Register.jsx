import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom'; 
import axios from '../config/axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    axios.post('/register', { // Update endpoint to `/register`
      name,  // Include name in payload
      email,
      password,
    })
    .then(res => {
      console.log(res);
      navigate('/'); // Redirect to the home page on success
    })
    .catch(err => {
      console.error(err);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-700">
      <form onSubmit={submitHandler} className="bg-gray-800 w-full max-w-md p-8 space-y-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-white text-center">Register</h2>
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
          <input
            value={email} // Bind state to input
            onChange={(e) => setEmail(e.target.value)} // Update state on change
            type="email"
            id="email"
            className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
          <input
            value={password} // Bind state to input
            onChange={(e) => setPassword(e.target.value)} // Update state on change
            type="password"
            id="password"
            className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
