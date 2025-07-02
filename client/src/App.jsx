import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {Toaster} from 'react-hot-toast'

export default function App() {
  return (
    <>
      <div className="bg-[url('./assets/bgImage.svg')] bg-contain ">
      <Toaster/>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </div>
    </>

  )
}
