import { useState } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Project = () => {

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

    const location = useLocation();
    const project = location.state?.project; // Safely access the project data

    if (!project) {
        return <p className="flex items-center justify-center h-screen text-lg">No project data available</p>;
    }

    return (
        <main className="h-screen w-full flex overflow-hidden">
            <section className="left relative flex flex-col h-full min-w-[24vw] bg-slate-400">
                <header className="flex justify-end p-2 px-4 bg-slate-200">
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 rounded-full hover:bg-gray-300 transition">
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
                <div className={`side-panel min-w-[24vw] h-full bg-slate-400 absolute left-0 top-0 transition-transform duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Side panel content */}
                    <div className="cross-icon absolute top-2 right-2">
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 rounded-full hover:bg-gray-300 transition">
                            <i className="ri-close-large-line text-white"></i>
                        </button>

                    </div>
                </div>

            </section>
        </main>
    );
};

export default Project;
