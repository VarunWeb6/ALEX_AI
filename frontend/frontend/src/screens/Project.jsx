import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { initializeSocket, sendMessage, recieveMessage, disconnectSocket } from '../config/socket';
import { UserContext } from '../context/userContext';
import Markdown from 'markdown-to-jsx';

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const messageBoxRef = useRef(null);

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message);
    
        // This component specifically renders AI-generated messages with markdown
        return (
            <div
                className="overflow-auto bg-slate-950 text-white rounded-sm p-2"
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        );
    }
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing. Redirecting to login.');
            navigate('/login');
            return;
        }

        const socket = initializeSocket(location.state.project._id);
        if (!socket) return;

        recieveMessage('project-message', (data) => {
            console.log('Message received:', data);
            appendIncomingMessage(data);
        });

        axios.get('/users/all')
            .then((res) => setAllUsers(res.data.users))
            .catch((err) => console.log(err));

        axios.get(`/projects/get-project/${location.state.project._id}`)
            .then((res) => setProject(res.data.project))
            .catch((err) => console.log(err));

        return () => {
            disconnectSocket();
        };
    }, [location.state.project._id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddCollaboratorClick = () => {
        setIsModalOpen(true);
    };

    const handleUserClick = (user) => {
        setSelectedUsers((prev) => {
            const isAlreadySelected = prev.includes(user._id);
            return isAlreadySelected
                ? prev.filter((id) => id !== user._id)
                : [...prev, user._id];
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
        if (messageObject.sender && messageObject.sender.id === 'ai') {
            // This block handles AI-generated messages with specific formatting
            const aiMessageComponent = WriteAiMessage(messageObject.message);
            setMessages((prevMessages) => [
                ...prevMessages,
                { ...messageObject, side: 'left', component: aiMessageComponent }
            ]);
        } else {
            // Handle normal incoming messages
            setMessages((prevMessages) => [
                ...prevMessages,
                { ...messageObject, side: 'left' }
            ]);
        }
        scrollToBottom();
    };
    

    const appendOutgoingMessage = ({ message, sender }) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { message, sender, side: 'right' }
        ]);
        scrollToBottom()
    };

    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    const isMarkdown = (text) => {
        // Simple regex to check if the text contains Markdown syntax (e.g., # for headings, * for lists)
        const markdownRegex = /[\*\#\-\+\!\[\]]/;
        return markdownRegex.test(text);
    };


    return (
        <main className="h-screen w-full flex overflow-hidden bg-slate-400">
            <section className="left relative flex flex-col h-full min-w-[30vw] max-w-[45w] bg-gray-800 text-gray-200">
                <header className="flex justify-between items-center p-3 px-5 bg-gray-700 shadow-md">
                    <button className="flex gap-2 items-center text-gray-200 hover:text-gray-100 transition" onClick={handleAddCollaboratorClick}>
                        <i className="ri-add-fill text-lg"></i>
                        <p className="font-medium">Add Collaborators</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 rounded-full hover:bg-gray-600 transition">
                        <i className="ri-group-fill text-xl"></i>
                    </button>
                </header>

                <div className="conversation-area flex-grow flex flex-col overflow-hidden min-w-[30vw] max-w-[45w] bg-gray-900 ">
                    <div ref={messageBoxRef} className="message-box flex-grow flex flex-col gap-3 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.side === 'right' ? 'outgoing-message' : 'incoming-message'} max-w-[70%] flex ${msg.side === 'right' ? 'ml-auto' : ''} flex-col p-2 bg-zinc-700 rounded-lg max-w-[24vw]`}>
                                <small className='opacity-59 text-xs'>{msg.sender.email}</small>
                                <p className='text-md'>
                                    {/* Render Markdown if the message contains Markdown syntax */}
                                    {msg.message && isMarkdown(msg.message) ? (
                                        <div className='overflow-auto bg-zinc-800 text-white p-2 rounded-2xl mt-4'>
                                            <Markdown>{msg.message}</Markdown>
                                        </div>
                                    ) : (
                                        msg.message
                                    )}
                                </p>
                            </div>
                        ))}



                    </div>
                    <div className="inputfield w-full flex items-center p-3 bg-gray-700 shadow-inner">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow rounded-lg p-3 px-4 bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            type="text"
                            placeholder="Enter message..."
                        />
                        <button onClick={send} className="ml-3 p-2 text-gray-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition">
                            <i className="ri-send-plane-fill text-lg"></i>
                        </button>
                    </div>
                </div>
            </section>

            <button
                onClick={handleLogout}
                className="fixed top-4 right-4 p-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 focus:ring-2 focus:ring-zinc-300 transition-all"
            >
                Logout
            </button>

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
