import { useEffect, useState } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios';

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectInSheet, setProjectInSheet] = useState(null);

    const project = location.state?.project;

    if (!project) {
        return <p className="flex items-center justify-center h-screen text-lg">No project data available</p>;
    }

    useEffect(() => {
        if (project) {
            // Fetch project data
            axios.get(`/projects/get-project/${project._id}`)
                .then(res => {
                    // Set projectInSheet only if the data is valid
                    if (res.data.projectInSheet) {
                        console.log('Project in Sheet:', res.data.projectInSheet);
                        setProjectInSheet(res.data.projectInSheet);
                    } else {
                        console.log('No project in sheet data');
                    }
                })
                .catch(err => {
                    console.error('Error fetching project data:', err);
                });

            // Fetch users
            axios.get('/users/all')
                .then(res => {
                    setUsers(res.data.users);
                })
                .catch(err => {
                    console.error('Error fetching users:', err);
                });
        }
    }, [project?._id]);  // Ensure the dependency on project._id

    const handleAddCollaboratorClick = () => {
        setIsModalOpen(true);
    };

    const handleUserClick = (user) => {
        setSelectedUsers((prev) => {
            const isAlreadySelected = prev.some((u) => u._id === user._id);
            return isAlreadySelected
                ? prev.filter((u) => u._id !== user._id) // Remove if already selected
                : [...prev, user]; // Add if not selected
        });
    };

    const addCollaborators = () => {
        axios.put('/projects/add-user', {
            projectId: project._id,
            users: selectedUsers.map(user => user._id),
        })
            .then(res => {
                console.log(res.data);
                setIsModalOpen(false);
            })
            .catch(err => {
                console.error('Error adding collaborators:', err);
            });
    };

    let userKeyCounter = 0;
    const generateUserKey = (user) => {
        if (user._id) {
            // Combine user._id with a unique property (email) to ensure uniqueness
            return `user-id-${user._id}-${user.email || 'unknown'}`;
        }
        userKeyCounter += 1;
        return `user-${userKeyCounter}`;
    };

    return (
        <main className="h-screen w-full flex overflow-hidden bg-slate-400">
            <section className="left relative flex flex-col h-full min-w-[24vw] bg-zinc-600">
                <header className="flex justify-between items-center p-2 px-4 bg-slate-100 flex gap-10">
                    <button className="flex gap-2" onClick={handleAddCollaboratorClick}>
                        <i className="ri-add-fill"></i>
                        <p>Add Collaborators</p>
                    </button>
                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className="p-2 rounded-full hover:bg-gray-300 transition"
                    >
                        <i className="ri-group-fill text-lg"></i>
                    </button>

                    {isSidePanelOpen && (
                        <div
                            className={`side-panel fixed top-0 left-0 h-full w-[24vw] bg-zinc-700 text-white shadow-lg z-50 transition-transform duration-300 ${isSidePanelOpen ? "translate-x-0" : "-translate-x-full"}`}
                        >
                            <header className="flex justify-between items-center p-4 border-b border-gray-600">
                                <h2 className="text-lg font-semibold">Collaborators</h2>
                                <button
                                    onClick={() => setIsSidePanelOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white"
                                >
                                    <i className="ri-close-fill text-lg"></i>
                                </button>
                            </header>
                            <div className="collaborators-list">
                                {Array.isArray(project.users) && project.users.length > 0 ? (
                                    project.users.map((user, index) => (
                                        <div
                                            key={generateUserKey(user) || `fallback-${index}`}
                                            className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                                                <i className="ri-user-fill absolute"></i>
                                            </div>
                                            <h1 className="font-semibold text-lg">{user.email || 'Unknown User'}</h1>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400">No collaborators added yet</p>
                                )}
                            </div>

                        </div>
                    )}
                </header>

                <div className="conversation-area flex-grow flex flex-col overflow-hidden">
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
            </section>

            {isModalOpen && (
                <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="modal-content bg-white p-4 rounded-md shadow-lg w-1/3 max-h-[90vh] flex flex-col">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2">
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className="users-list flex flex-col gap-2 overflow-auto flex-grow">
                            {Array.isArray(users) && users.map((user, index) => (
                                <div
                                    key={generateUserKey(user) || `modal-user-${index}`}
                                    className={`user cursor-pointer hover:bg-slate-200 ${selectedUsers.some((u) => u._id === user._id) ? 'bg-slate-200' : ''} p-2 flex gap-2 items-center`}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg">{user.email || 'Unknown User'}</h1>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addCollaborators}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md self-center"
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
