import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Admin/AdminHome'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />

          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
