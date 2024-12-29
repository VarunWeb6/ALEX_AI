import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import axios from '../config/axios';

function Home() {
    const { user } = useContext(UserContext);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [project, setProject] = useState([]);  // Make sure this is always initialized as an array

    async function createProject(e) {
        e.preventDefault();

        if (!projectName.trim()) {
            alert('Please enter a valid project name.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/projects/create', { name: projectName });
            console.log('Project created successfully:', response.data);

            // Reset the form and close the modal
            setProjectName('');
            setIsModelOpen(false);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setPopupMessage('The project name already exists. Please choose a different name.');
            } else {
                setPopupMessage('Failed to create the project. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        axios.get('/projects/all')
            .then((res) => {
                // Assuming the response has a `project` field containing the array of projects
                setProject(res.data.project || []);  // Ensure we extract the correct array
            })
            .catch((err) => {
                console.log(err);
                setProject([]);  // Fallback to empty array if error occurs
            });
    }, []);

    function closePopup() {
        setPopupMessage('');
    }

    return (
        <main className="p-2">
            <div className="projects flex gap-4">
                <button
                    onClick={() => setIsModelOpen(true)}
                    className="project p-3 border border-slate-300 rounded-lg shadow-md flex items-center justify-between text-blue-600 hover:text-blue-800 hover:shadow-lg transition-all duration-300"
                >
                    New Project
                    <i className="ri-link p-2 ml-1"></i>
                </button>

                {Array.isArray(project) && project.length > 0 ? (
                    project.map((project) => (
                        <div key={project._id} className="project p-3 border border-slate-300 rounded-lg shadow-md flex items-center justify-between">
                            <div>
                                <p>{project.name}</p>
                                <p className="text-sm text-gray-500">Users: {project.users.length}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No projects available</p>
                )}

            </div>

            <div className="p-1">
                {isModelOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                            <form onSubmit={createProject}>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="projectName"
                                    >
                                        Project Name
                                    </label>
                                    <input
                                        autoComplete="off"
                                        onChange={(e) => setProjectName(e.target.value)}
                                        value={projectName}
                                        type="text"
                                        id="projectName"
                                        name="projectName"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModelOpen(false)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {popupMessage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-lg font-bold mb-4">Notification</h2>
                            <p className="text-gray-700">{popupMessage}</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={closePopup}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Home;
