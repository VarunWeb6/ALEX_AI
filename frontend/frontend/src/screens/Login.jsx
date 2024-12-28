import React , {useState} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios from '../config/axios';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        axios.post('/login', {
            email,
            password
        }).then(res => {
            console.log(res)
            navigate('/')
        }).catch(err => {
            console.log(err)
        })
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-700">
      <form onSubmit={submitHandler} className="bg-gray-800 w-full max-w-md p-8 space-y-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <div>
          <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
          <input
          onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-400 mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Login
        </button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
