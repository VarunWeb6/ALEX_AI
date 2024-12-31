import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

export default function UserAuth({ children }) {
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        // If token is present, don't navigate to login
        if (token) {
            if (!user) {
                navigate('/login') // Redirect to login if no user is found
            } else {
                setLoading(false) // User is logged in, so stop loading
            }
        } else {
            navigate('/login') // If token doesn't exist, redirect to login
        }
    }, [token, user, navigate]) // Dependency array updated to track token and user changes

    if (loading) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}
