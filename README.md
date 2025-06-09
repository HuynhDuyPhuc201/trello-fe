# Trello Clone

A full-stack Trello clone built with modern web technologies, featuring real-time collaboration, drag-and-drop functionality, and a responsive design.

## 🚀 Features

- 📋 Kanban board management
- 🎯 Drag-and-drop card organization
- 👥 Real-time collaboration
- 🔐 User authentication (Google OAuth)
- 📱 Responsive design
- 🎨 Material UI components
- 📝 Rich text editing
- 🔔 Real-time notifications
- 📤 File uploads
- 🌈 Customizable board themes

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Material UI
- Redux Toolkit
- React Query
- Socket.io Client
- DnD Kit (Drag and Drop)
- React Router DOM
- React Hook Form
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Google OAuth
- Cloudinary (File Storage)
- Brevo (Email Service)

## 📋 Prerequisites

- Node.js >= 18.x
- MongoDB
- Yarn package manager

## 🚀 Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd trello-be
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
BREVO_API_KEY=your_brevo_api_key
```

4. Start the development server:
```bash
yarn dev
```

The backend will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
│
└── trello-be/             # Node.js backend application
    ├── src/               # Source files
    ├── uploads/           # File uploads directory
    └── package.json       # Backend dependencies
```

## 🔧 Available Scripts

### Frontend
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn eslint` - Fix ESLint issues

### Backend
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn production` - Run production build
- `yarn lint` - Run ESLint
- `yarn eslint` - Fix ESLint issues

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- DuyPhucDev - Initial work

## 🙏 Acknowledgments

- Inspired by Trello
- Built with modern web technologies
- Thanks to all contributors 
