import { Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateProject from './pages/CreateProject.jsx'
import Workspace from './pages/Workspace.jsx'
import StoryPage from './pages/StoryPage.jsx'
import CharactersPage from './pages/CharactersPage.jsx'
import ScenesPage from './pages/ScenesPage.jsx'
import DialoguePage from './pages/DialoguePage.jsx'
import VisualPromptPage from './pages/VisualPromptPage.jsx'
import ExportPage from './pages/ExportPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'create',
        element: (
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
      {
        path: 'workspace/:projectId',
        element: (
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="story" replace /> },
          { path: 'story', element: <StoryPage /> },
          { path: 'characters', element: <CharactersPage /> },
          { path: 'scenes', element: <ScenesPage /> },
          { path: 'dialogues', element: <DialoguePage /> },
          { path: 'visual-prompts', element: <VisualPromptPage /> },
          { path: 'export', element: <ExportPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

export default routes
