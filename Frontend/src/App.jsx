import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import Contact from './pages/Home/Contact';


const App = () => {
  return (
    <>
      <div className="container">
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gioi-thieu" element={<Intro />} />
            <Route path="/lien-he" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App

