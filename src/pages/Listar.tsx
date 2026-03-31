import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Listar() {

  const navigate = useNavigate()
  const [climas, setClimas] = useState<any[]>([])
  const inputCidade = useRef<HTMLInputElement>(null)

  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [cidadeBuscada, setCidadeBuscada] = useState('')

  async function getDados() {
    const cidade = inputCidade.current!.value

    try {
      const response = await api.get(
        `dados-meteorologicos?page=${pagina}`
      )
      setClimas(response.data.content)
      setTotalPaginas(response.data.totalPages)
    } catch (error: any) {
      const status = error.response?.status

      if (status === 404) {
        alert('Parece que ainda não há registros')
      } else {
        alert('Erro ao buscar previsão, tente novamente')
      }
    }
  }

  async function getDadosCidade() {
    const cidade = inputCidade.current!.value

    if (!cidade.trim()) {
      alert('Digite uma cidade.')
      return
    }

    setCidadeBuscada(cidade)

    try {
      const response = await api.get(
        `dados-meteorologicos/cidade/${cidade.trim()}?page=${pagina}`
      )

      setClimas(response.data.content)
      setTotalPaginas(response.data.totalPages)
    } catch (error: any) {
      const status = error.response?.status

      if (status === 404) {
        alert('Cidade não encontrada')
      } else {
        alert('Erro ao buscar previsão, tente novamente')
      }
    }
  }

  async function deletarClima(id: number) {
    try {
      await api.delete(`dados-meteorologicos/${id}`)
      setClimas(climas.filter(reg => reg.id !== id))
    } catch (error: any) {
      alert('Erro ao deletar, tente novamente')
    }
  }

  useEffect(() => {
    if (cidadeBuscada.trim()) {
      getDadosCidade()
    }
  }, [pagina])

  useEffect(() => {
    getDados()
  }, [])

  function formatarData(data: string) {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <>
      <Navbar />

      <main>
        <h2 className="listar-titulo">Lista de cidades</h2>

        <div className="busca-cidade-wrap">
          <label htmlFor="busca-input">Cidade</label>
          <div className="busca-cidade-input">
            <input type="text" id="busca-input" name="search" placeholder="Porto Alegre" ref={inputCidade} />
            <button className="btn-buscar" onClick={getDadosCidade}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <table className="tabela-cidades" style={{ marginTop: '18px' }}>
          <thead>
            <tr>
              <th>Cidade</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {climas.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.nomeCidade}</td>
                <td>{formatarData(reg.data)}</td>
                <td>
                  <div className="acoes-tabela">
                    <button className="btn-acao" onClick={() => navigate(`/cadastro`, { state: reg })}><img src="images/lapis.png" alt="Editar" /></button>
                    <button className="btn-acao" onClick={() => deletarClima(reg.id)}><img src="images/deletar.png" alt="Deletar" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {climas.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>

      {totalPaginas > 0 && (
        <nav>
          <ul className="paginacao">
            <li>
              <button onClick={() => setPagina(p => p-1)} disabled={pagina === 0}>&lt;</button>
              Página {pagina+1} de {totalPaginas}
              <button onClick={() => setPagina(p => p+1)} disabled={pagina === totalPaginas-1}>&gt;</button>
            </li>
          </ul>
        </nav>
      )}
      </main>

      <footer>
        <div>
          <span>make with love</span>
          <img src="images/db.png" alt="Logo DB" />
        </div>
      </footer>
    </>
  )
}