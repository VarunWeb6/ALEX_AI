import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { initializeSocket, sendMessage, recieveMessage, disconnectSocket } from '../config/socket';
import { UserContext } from '../context/userContext';

const Project = () => {
    const location = useLocation();

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); // Array to store selected users
    const [allUsers, setAllUsers] = useState([]); // Array to store all users
    const [project, setProject] = useState(location.state.project); // Store collaborators' data
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const messageBoxRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check for token
        if (!token) {
            console.error('Token is missing. Redirecting to login.');
            // Redirect to login or handle unauthorized state
            return;
        }

        const socket = initializeSocket(location.state.project._id); // Initialize socket with project ID
        if (!socket) return;

        // Listen for project messages
        recieveMessage('project-message', (data) => {
            console.log('Message received:', data);
            appendIncomingMessage(data);
        });

        // Fetch all users
        axios.get('/users/all')
            .then((res) => setAllUsers(res.data.users))
            .catch((err) => console.log(err));

        // Fetch project data
        axios.get(`/projects/get-project/${location.state.project._id}`)
            .then((res) => setProject(res.data.project))
            .catch((err) => console.log(err));

        // Cleanup function
        return () => {
            disconnectSocket();
        };
    }, [location.state.project._id]);

    const handleAddCollaboratorClick = () => {
        setIsModalOpen(true); // Open the modal when "Add Collaborator" is clicked
    };

    const handleUserClick = (user) => {
        setSelectedUsers((prev) => {
            const isAlreadySelected = prev.includes(user._id);
            return isAlreadySelected
                ? prev.filter((id) => id !== user._id) // Remove if already selected
                : [...prev, user._id]; // Add if not selected
        });
    };

    const addCollaborators = () => {
        axios.put('/projects/add-user', {
            projectId: location.state.project._id,
            users: selectedUsers
        }).then(res => {
            console.log(res.data);
            setIsModalOpen(false);
            setProject((prev) => ({ ...prev, users: [...prev.users, ...selectedUsers.map((id) => allUsers.find((u) => u._id === id))] }));
        }).catch(err => {
            console.error("Error adding collaborators:", err);
        });
    };

    const send = () => {
        if (message.trim()) {
            sendMessage('project-message', {
                message,
                sender: user,
            });
            appendOutgoingMessage({ message, sender: user });
            setMessage("");
        }
    };

    const appendIncomingMessage = (messageObject) => {
        if (messageBoxRef.current) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('incoming-message', 'max-w-[70%]', 'flex', 'flex-col', 'p-2', 'bg-zinc-900', 'rounded-lg');
            messageElement.innerHTML = `<small class='opacity-59 text-xs'>${messageObject.sender.email}</small>
                                        <p class='text-md'>${messageObject.message}</p>`;
            messageBoxRef.current.appendChild(messageElement);
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
        scrollToBottom()
    };

    const appendOutgoingMessage = ({ message, sender }) => {
        if (messageBoxRef.current) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('outgoing-message', 'max-w-[70%]', 'ml-auto', 'flex', 'flex-col', 'p-2', 'bg-zinc-700', 'rounded-lg');
            messageElement.innerHTML = `<small class='opacity-59 text-xs'>${sender.email}</small>
                                        <p class='text-md'>${message}</p>`;
            messageBoxRef.current.appendChild(messageElement);
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
        scrollToBottom()
    };

    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    return (
        <main className="h-screen w-full flex overflow-hidden bg-slate-400">
            <section className="left relative flex flex-col h-full min-w-[24vw] bg-gray-800 text-gray-200">
                <header className="flex justify-between items-center p-3 px-5 bg-gray-700 shadow-md">
                    <button className="flex gap-2 items-center text-gray-200 hover:text-gray-100 transition" onClick={handleAddCollaboratorClick}>
                        <i className="ri-add-fill text-lg"></i>
                        <p className="font-medium">Add Collaborators</p>
                    </button>
                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className="p-2 rounded-full hover:bg-gray-600 transition"
                    >
                        <i className="ri-group-fill text-xl"></i>
                    </button>
                </header>

                <div className="conversation-area flex-grow flex flex-col overflow-hidden bg-gray-900">
                    <div ref={messageBoxRef} className="message-box flex-grow flex flex-col gap-3 p-4 overflow-y-auto">
                        {/* Messages will be dynamically added here */}
                    </div>
                    <div className="inputfield w-full flex items-center p-3 bg-gray-700 shadow-inner">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow rounded-lg p-3 px-4 bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            type="text"
                            placeholder="Enter message..."
                        />
                        <button
                            onClick={send}
                            className="ml-3 p-3 text-gray-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <i className="ri-send-plane-fill text-lg"></i>
                        </button>
                    </div>
                </div>
            </section>


            {isModalOpen && (
                <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-xl w-1/3 max-h-[90vh] flex flex-col relative">
                        <header className="flex justify-between items-center pb-4 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Select Users</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-600 hover:text-gray-800 transition-all rounded-full hover:bg-gray-200"
                            >
                                <i className="ri-close-fill text-2xl"></i>
                            </button>
                        </header>
                        <div className="users-list mt-4 flex flex-col gap-3 overflow-auto flex-grow">
                            {allUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className={`user cursor-pointer transition-all p-3 flex gap-3 items-center rounded-lg shadow-md ${selectedUsers.includes(user._id)
                                        ? 'bg-blue-100 border border-blue-500'
                                        : 'hover:bg-gray-100'
                                        }`}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-600 text-white">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="font-semibold text-gray-700">
                                        {user.email}
                                    </h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md self-center shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                        >
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}

            {isSidePanelOpen && (
                <div
                    className={`sidePanel w-[24vw] h-full flex flex-col gap-4 bg-white shadow-lg absolute top-0 left-0 transform transition-transform duration-500 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <header className="flex justify-between items-center px-6 py-4 bg-gray-200 border-b">
                        <h1 className="font-bold text-lg text-gray-800">Collaborators</h1>
                        <button
                            onClick={() => setIsSidePanelOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-300 transition-all"
                        >
                            <i className="ri-close-fill text-xl text-gray-600"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-4 px-4">
                        {project.users &&
                            project.users.map((user) => (
                                <div
                                    key={user.email}
                                    className="user flex items-center gap-4 p-3 rounded-lg bg-gray-50 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-600 text-white">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="text-gray-800 font-semibold">
                                        {user.email}
                                    </h1>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
