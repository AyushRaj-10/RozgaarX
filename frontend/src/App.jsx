import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from './pages/auth/Register.jsx'
import Login from './pages/auth/Login.jsx'
import Home from './pages/Home.jsx'
import UserProfileSetup from './pages/UserProfileSetup.jsx'
import Dashboard from './pages/user/Dashboard.jsx'
const App = () => {
  return (
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/setup" element={<UserProfileSetup />}/>
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App