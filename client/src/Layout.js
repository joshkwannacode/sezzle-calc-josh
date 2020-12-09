import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const PORT = 'https://sezzle-calc-josh.herokuapp.com/' ||'http://localhost:4000';
const socket = io.connect(PORT)

function Layout() {
  const [calculation, setCalculation] = useState([])
  const [input, setInput] = useState("");
  
  const calcBtns = [];
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, ".", "%"].forEach((item) => {
    calcBtns.push(
      <button
        onClick={(e) => {
          setInput(input + e.target.value);
        }}
        value={item}
        key={item}
      >

        {item}
      </button>
    );
  });

  useEffect(() => {
    //recieve total calculation
    socket.on("result", result => {
      setCalculation(calculation.length === 10 ? [...calculation.slice(1), result] : [...calculation, result]);
    })
  })
  
  const handleSubmit=(e)=>{
    e.preventDefault()

    //make the calculation
    const newResult =
      String(eval(input)).length > 3 &&
        String(eval(input)).includes(".")
        ? String(eval(input).toFixed(4))
        : String(eval(input));
    
    const totalEquation = `${input}=${newResult}`;
    setInput(totalEquation)

    //emit totalEquation
    socket.emit('result', totalEquation);
    }
    const handleClear=()=>{
      setInput("")
  }
 
  return (
  <div className="wrapper">
  <div className="show-input">
    <div className="input">{input}</div>
    <div className="saved-calc" >
      <ol>{calculation.slice(0).reverse().map((result) => (
        <li>{result}</li>
      ))}</ol>   
      </div>
    </div>
  
  <div className="digits flex">{calcBtns}</div>
  <div className="modifiers subgrid">

    {/* delete button */}
    <button className="delete" onClick={() => setInput(input.substr(0, input.length - 1))}>
      Delete
    </button>

    {/* clear all */}
    <button onClick={handleClear} value="">
      AC
    </button>
  </div>
  <div className="operations subgrid">
    {/* add button */}
    <button onClick={(e) => setInput(input + e.target.value)} value="+">
      +
    </button>

    {/* minus button */}
    <button onClick={(e) => setInput(input + e.target.value)} value="-">
      -
    </button>

    <button onClick={(e) => setInput(input + e.target.value)} value="*">
      *
    </button>

    <button onClick={(e) => setInput(input + e.target.value)} value="/">
      /
    </button>
    {/* equal button */}
    <button
      onClick={handleSubmit}
      value="="
    >
      =
    </button>
  </div>
</div>
    
  )
}

export default Layout;