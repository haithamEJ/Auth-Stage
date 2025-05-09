
import './App.css'
import React, {use, useEffect, useState} from 'react'
import axios from 'axios';
import {HashRouter as Router, Routes , Route} from 'react-router-dom' 
import {Home} from './Pages/home'
import {Page1} from './Pages/page1';
import {Login} from './Pages/login'
import {Signup} from './Pages/signup'
import {Header} from './Components/header'
function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/page1" element={<Page1/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
           <Route path="/header" element={<Header/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
