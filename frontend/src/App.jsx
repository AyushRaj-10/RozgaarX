import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from './pages/auth/Register.jsx'
import Login from './pages/auth/Login.jsx'
import Home from './pages/Home.jsx'
import UserProfileSetup from './pages/UserProfileSetup.jsx'
import Dashboard from './pages/user/Dashboard.jsx'
import MyApplications from './pages/user/MyApplications.jsx'
import BrowseJobs from './pages/user/BrowseJobs.jsx'
import PostJob from './pages/recuiter/PostJob.jsx'
import Applicants from './pages/recuiter/Applicants.jsx'
const App = () => {
  return (
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/setup" element={<UserProfileSetup />}/>
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/applications" element={<MyApplications />}/>
      <Route path="/jobs" element={<BrowseJobs />}/>
      <Route path="/post-job" element={<PostJob />}/>
      <Route path="/applicants" element={<Applicants />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App