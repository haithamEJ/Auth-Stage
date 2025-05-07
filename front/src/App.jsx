
import './App.css'
import React, {use, useEffect, useState} from 'react'
import axios from 'axios';
import {HashRouter as Router, Routes , Route} from 'react-router-dom' 
import {Home} from './Pages/home'
import {Page1} from './Pages/page1';
import {Login} from './Pages/login'

function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/page1" element={<Page1/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
