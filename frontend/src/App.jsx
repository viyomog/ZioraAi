import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import ChatLayout from './components/ChatLayout'
import Home from './pages/Home'
import Models from './pages/Models'
import About from './pages/About'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Chat from './pages/Chat'

function App() {
  return (
    <Routes>
      <Route path="/chat" element={<ChatLayout><Chat /></ChatLayout>} />
      <Route path="/" element={
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      } />
      <Route path="*" element={
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App