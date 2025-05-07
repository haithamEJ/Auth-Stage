
import './App.css'
import React, {use, useEffect, useState} from 'react'
import axios from 'axios';
function App() {
  const [array, setArray] = useState([]);

  const fetchAPI = async () =>{
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits)
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI()
  }, [])
  return (
    <>
    {
      array.map((fruits, index) =>(
        <div key={index}>
          <p>{fruits}</p>
          <br></br>
        </div>
      ))
    }
    </>
  )
}

export default App
