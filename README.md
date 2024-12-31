
# Real-Time Group Chat App with Collaborator Feature and Gemini AI Integration (MERN Stack)

This project is a real-time group chat application built using the **MERN stack (MongoDB, Express, React, Node.js)**. It incorporates advanced features such as a collaborator management system, message sending with support for Markdown formatting, and integration with **Gemini AI** for enhanced user experience.

## Features

- **Real-Time Messaging**: Messages are sent and received in real-time using WebSockets (Socket.IO).
- **Collaborator Management**: Add and manage collaborators to a project with ease. You can select users from a list and assign them to a project.
- **Markdown Support**: The application supports Markdown rendering for messages, making it easy to format text.
- **AI Integration**: Gemini AI has been integrated to enhance the chat experience by providing intelligent suggestions and analysis of the conversations.
- **User Authentication**: Users can sign up, log in, and maintain their session through token-based authentication (JWT).
- **Responsive Design**: The app has a fully responsive design, optimized for both desktop and mobile.

## Tech Stack

- **Frontend**: 
  - React.js
  - Tailwind CSS
  - Markdown-to-JSX (for rendering Markdown content)
  - Axios (for making API requests)
  - Socket.IO (for real-time communication)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (for data storage)
  - Socket.IO (for handling real-time messages)

- **AI Integration**:
  - Gemini AI (for intelligent message suggestions)

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (>=v14.x)
- **MongoDB** (locally or use a cloud service like MongoDB Atlas)
- **npm** (>=v6.x) or **yarn**

### Steps

1. Clone the repository:
   ```bash
   git clone 
   cd name_of_folder
   ```

2. Install the server-side dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install the client-side dependencies:
   ```bash
   cd client
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the **server** directory and add the following:

     ```
     MONGO_URI=your_mongo_db_connection_url
     JWT_SECRET=your_jwt_secret_key
     GEMINI_AI_API_KEY=your_gemini_ai_api_key
     ```

5. Start the server:
   ```bash
   cd server
   npm start
   ```

6. Start the client:
   ```bash
   cd client
   npm start
   ```

7. Open the application in your browser at `http://localhost:3000`.

## Usage

- **Sign up / Log in**: Users can sign up and log in to the app. JWT tokens will be used for authentication.
- **Start a Project**: Create a new project and invite collaborators.
- **Messaging**: Users can send and receive messages in real time. Markdown formatting is supported.
- **Add Collaborators**: Open the collaborator modal, select users from the list, and add them to your project.
- **Gemini AI**: The app integrates with Gemini AI for smart message suggestions and analysis.

## Directory Structure

```
realtime-group-chat-app/
├── client/                  # Frontend application (React)
│   ├── public/              # Public assets (HTML, images, etc.)
│   ├── src/                 # React components and logic
│   ├── package.json         # Frontend dependencies
│
├── server/                  # Backend application (Node.js/Express)
│   ├── controllers/         # API controllers
│   ├── models/              # MongoDB models (Users, Projects, Messages)
│   ├── routes/              # API routes
│   ├── socket/              # WebSocket configuration (Socket.IO)
│   ├── app.js               # Main Express application
│   ├── server.js            # Server entry point
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│
├── README.md                # Project README
└── .gitignore               # Git ignore file
```

## Contributing

Contributions are welcome! To contribute to the project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## Acknowledgements

- [Socket.IO](https://socket.io/) for real-time communication.
- [Gemini AI](https://www.gemini.com/) for AI integration.
- [React](https://reactjs.org/) for building the frontend.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Markdown-to-JSX](https://github.com/probablyup/markdown-to-jsx) for Markdown rendering.

---

