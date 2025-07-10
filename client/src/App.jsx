import React, {useContext} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext.jsx'

export default function App() {

   const {authUser} =useContext(AuthContext) // this authUsser is get from the AuthContext file, we make in a state vareable
  
  return (
    <>
      <div className="bg-[url('./assets/bgImage.svg')] bg-contain ">
      <Toaster/>
        <Routes>
          <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        </Routes>
      </div>
    </>

  )
}
