
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Landing from './screens/Landing'
import Game from './screens/Game'

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes
    >
      <Route path='/' element ={<Landing/>}/>
      <Route path= '/game' element = {<Game/>}/>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
