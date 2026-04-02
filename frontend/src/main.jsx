import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ApplicationProvider } from './context/ApplicationContext.jsx'
import { JobProvider } from './context/JobContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <JobProvider>
          <ApplicationProvider>
      <App/>
          </ApplicationProvider>
        </JobProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
