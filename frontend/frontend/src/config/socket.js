import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
        console.error('No token found. Please log in.');
        return null;
    }

    // Initialize the socket with token and projectId
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token,
        },
        query: {
            projectId,
        },
    });

    socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
    });

    return socketInstance;
};

export const recieveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.error('Socket instance is not initialized.');
    }
};

export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    } else {
        console.error('Socket instance is not initialized.');
    }
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        console.log('Socket disconnected.');
        socketInstance = null;
    }
};
