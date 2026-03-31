import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ estilo }: { estilo?: string }) {
  const location = useLocation()

  return (
    <header className={`menu ${estilo}`}>
      <nav>
        <ul className="navegacao">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname === '/cadastro' ? 'active' : ''}>
            <Link to="/cadastro">Cadastrar</Link>
          </li>
          <li className={location.pathname === '/listar' ? 'active' : ''}>
            <Link to="/listar">Listar</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}