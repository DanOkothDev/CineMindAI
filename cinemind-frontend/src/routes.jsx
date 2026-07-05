import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const CreateProject = lazy(() => import('./pages/CreateProject.jsx'))
const Workspace = lazy(() => import('./pages/Workspace.jsx'))
const StoryPage = lazy(() => import('./pages/StoryPage.jsx'))
const CharactersPage = lazy(() => import('./pages/CharactersPage.jsx'))
const ScenesPage = lazy(() => import('./pages/ScenesPage.jsx'))
const DialoguePage = lazy(() => import('./pages/DialoguePage.jsx'))
const VisualPromptPage = lazy(() => import('./pages/VisualPromptPage.jsx'))
const ExportPage = lazy(() => import('./pages/ExportPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))

function withSuspense(element) {
  return <Suspense fallback={<LoadingScreen fullScreen={false} message="Loading workspace…" />}>{element}</Suspense>
}

const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            {withSuspense(<Dashboard />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'create',
        element: (
          <ProtectedRoute>
            {withSuspense(<CreateProject />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'workspace/:projectId',
        element: (
          <ProtectedRoute>
            {withSuspense(<Workspace />)}
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="story" replace /> },
          { path: 'story', element: withSuspense(<StoryPage />) },
          { path: 'characters', element: withSuspense(<CharactersPage />) },
          { path: 'scenes', element: withSuspense(<ScenesPage />) },
          { path: 'dialogues', element: withSuspense(<DialoguePage />) },
          { path: 'visual-prompts', element: withSuspense(<VisualPromptPage />) },
          { path: 'export', element: withSuspense(<ExportPage />) },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

export default routes
