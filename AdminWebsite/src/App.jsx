import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Admin/AdminHome'  
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <>
      <div className="container">
        <div className="app">
          <Routes>
            <Route path="/" element={<Home/>} />

          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
