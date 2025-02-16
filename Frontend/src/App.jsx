import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import Contact from './pages/Home/Contact';
import Solution from './pages/Home/Solution';
import Sol_class from './pages/Home/Solution_class';
import Sol_phonghop from './pages/Home/Solution_phonghop';
import Sol_gianhang from './pages/Home/Solution_gianhang';
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
            <Route path="/giai-phap" element={<Solution />} />
            <Route path="/giai-phap/lop-hoc-thong-minh" element={<Sol_class />} />
            <Route path="/giai-phap/phong-hop-thong-minh" element={<Sol_phonghop />} />
            <Route path="/giai-phap/giai-phap-gian-hang" element={<Sol_gianhang />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App

