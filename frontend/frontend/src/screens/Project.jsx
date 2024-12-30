import { useEffect, useState } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios';

const Project = () => {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); // Array to store selected users
    const [users, setUsers] = useState([]); // Array to store all users

    const location = useLocation();
    const project = location.state?.project; // Safely access the project data

    if (!project) {
        return <p className="flex items-center justify-center h-screen text-lg">No project data available</p>;
    }

    // const users = [
    //     { id: 1, name: 'one' },
    //     { id: 2, name: 'two' },
    //     { id: 3, name: 'three' },
    //     { id: 4, name: 'four' },
    //     { id: 5, name: 'five' },
    // ];

    useEffect(() => {

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.log(err)
        })

    }, [])

    const handleAddCollaboratorClick = () => {
        setIsModalOpen(true); // Open the modal when "Add Collaborator" is clicked
    };

    const handleUserClick = (user) => {
        setSelectedUsers((prev) => {
            const isAlreadySelected = prev.some((u) => u.id === user.id);
            const updatedUsers = isAlreadySelected
                ? prev.filter((u) => u.id !== user.id) // Remove user if already selected
                : [...prev, user]; // Add user if not selected

            // Log the project and updated users
            console.log({
                project,
                // selectedUsers: updatedUsers,
            });

            return updatedUsers; // Update state
        });
    };


    // Log selected users to console whenever it changes
    // console.log("Selected Users:", selectedUsers);

    return (
        <main className="h-screen w-full flex overflow-hidden">
            <section className="left relative flex flex-col h-full min-w-[24vw] bg-slate-400">
                <header className="flex justify-end p-2 px-4 bg-slate-200">
                    <button onClick={handleAddCollaboratorClick}>
                        <i className="ri-add-fill"></i>
                    </button>
                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className="p-2 rounded-full hover:bg-gray-300 transition"
                    >
                        <i className="ri-group-fill text-lg"></i>
                    </button>
                </header>

                <div className="conversation-area flex-grow flex flex-col overflow-hidden">
                    {/* Chat Messages */}
                    <div className="message-box flex-grow flex flex-col gap-2 p-2 overflow-y-auto">
                        <div className="incoming-message max-w-[70%] flex flex-col p-2 bg-slate-50 rounded-lg shadow-sm">
                            <small className="text-xs text-gray-500">example@gmail.com</small>
                            <p className="text-sm">Lorem ipsum dolor sit amet.</p>
                        </div>
                        <div className="outgoing-message max-w-[70%] ml-auto flex flex-col p-2 bg-blue-100 rounded-lg shadow-sm">
                            <small className="text-xs text-gray-500">example@gmail.com</small>
                            <p className="text-sm">Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>

                    {/* Input Field */}
                    <div className="inputfield w-full flex items-center p-2 bg-slate-300">
                        <input
                            className="flex-grow rounded-md p-2 px-4 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter message"
                        />
                        <button className="ml-2 p-2 text-blue-600 hover:text-blue-800 transition">
                            <i className="ri-send-plane-fill text-lg"></i>
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div
                    className={`side-panel min-w-[24vw] h-full bg-slate-400 absolute left-0 top-0 transition-transform duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    {/* Side panel content */}
                    <div className="cross-icon absolute top-2 right-2">
                        <button
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className="p-2 rounded-full hover:bg-gray-300 transition"
                        >
                            <i className="ri-close-large-line text-white"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal for selecting user */}
            {isModalOpen && (
                <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="modal-content bg-white p-4 rounded-md shadow-lg w-1/3">
                        <header className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2">
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map((user) => (
                                <div
                                    key={user._id} // Ensure each child has a unique key
                                    className={`user cursor-pointer hover:bg-slate-200 ${selectedUsers.some((u) => u.id === user._id) ? 'bg-slate-200' : ''
                                        } p-2 flex gap-2 items-center`}
                                    onClick={() => handleUserClick(user)} // Pass the full user object
                                >
                                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg">{user.email}</h1>
                                </div>
                            ))}
                        </div>

                        <button
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
