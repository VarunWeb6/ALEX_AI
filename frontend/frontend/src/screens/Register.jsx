import React, { useState, useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { UserContext } from '../context/userContext'; 
import axios from '../config/axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setUser } = useContext(UserContext); // Access setUser from context
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }

    setError(''); 

    try {
      const response = await axios.post('/users/register', { email, password });

      // Save user data and token
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user); // Update user context
      navigate('/'); // Redirect to home on successful registration
    } catch (err) {
      console.error(err);
      // Set specific error messages based on response or fallback to generic error
      setError(err.response?.data?.message || 'An error occurred, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-700">
      <form onSubmit={submitHandler} className="bg-gray-800 w-full max-w-md p-8 space-y-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-white text-center">Register</h2>

        {/* Display error message */}
        {error && (
          <div className="bg-red-500 text-white text-center p-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
          <input
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
