import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Listar from './pages/Listar'
import './index.css'

export default function App() {

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/cadastro"  element={<Cadastro />} />
      <Route path="/listar"    element={<Listar />} />
    </Routes>
  </BrowserRouter>
  )
}