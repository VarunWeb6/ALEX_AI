import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

function Home() {
    const { user } = useContext(UserContext);

    return (
        <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1>Welcome to Alex AI</h1>
            {JSON.stringify(user)}
        </div>
    );
}

export default Home;
