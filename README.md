# Trello Clone

A frontend application that replicates core features of Trello using modern web technologies. Includes drag-and-drop, real-time UI updates, and a beautiful responsive design.

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

## 📋 Prerequisites

- Node.js >= 18.x
- Yarn package manager

## 🚀 Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd trello-fe
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_GOOGLE_CLIENT_ID=''
VITE_COOKIE_MODE=''
```

4. Start the development server:
```bash
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
trello-fe/
├── src/             # Source code
│   ├── apis/  
│   ├── assets/  
│   ├── components/ 
│   ├── config/ 
│   ├── hooks/ 
│   ├── libs/ 
│   ├── pages/       
│   ├── store/       
│   ├── services/   
│   ├── sockets/    
│   ├── utils/       
│   └── main.jsx     # Entry point
├── public/          # Static assets
├── index.html       # HTML template
├── .env             # Environment variables
└── package.json     # Frontend dependencies
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn eslint` - Fix ESLint issues

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License – see the LICENSE file for details.

## 👥 Authors

- DuyPhucDev – Frontend development
