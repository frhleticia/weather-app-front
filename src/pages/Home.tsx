import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Home() {

  const descricoes = {
    SOL: 'Sol',
    NUBLADO: 'Nublado',
    CHUVA: 'Chuva',
    NEVE: 'Neve',
    TEMPESTADE: 'Tempestade'
  }

  const [climas, setClimas] = useState([
  {
    id: 1,
    tempoDia: 'NEVE',
    tempoNoite: 'NEVE',
    temperaturaMax: 4,
    temperaturaMin: -3,
    precipitacao: 30,
    humidade: 85,
    velocidadeVento: 18,
    data: '2026-01-30'
  }
])
  const inputCidade = useRef<HTMLInputElement>(null)

  const hora = new Date().getHours()
  const turno = hora >= 6 && hora < 18 ? 'tempoDia' : 'tempoNoite'

  async function getPrevisao() {
    const cidade = inputCidade.current!.value

    if (!cidade.trim()) {
      alert('Digite uma cidade.')
      return
    }

    try {
      const response = await api.get(
        `dados-meteorologicos/cidade/${cidade.trim()}/previsao-proximos-dias`
      )

      setClimas(response.data)
    } catch (error: any) {
      const status = error.response?.status

      if (status === 404) {
        alert('Cidade não encontrada')
      } else {
        alert('Erro ao buscar previsão, tente novamente')
      }
    }
  }
  
  function formatarData(data: string) {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <>
      <Navbar estilo="nav-home" />

      <main>
        <div className="topo-home">
          <div className="hoje"><span>Hoje</span></div>
          <div className="pesquisa-home">
            <p>Pesquise a cidade</p>
            <div className="form-cidade">
              <form action="" onSubmit={(e) => e.preventDefault()}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <label htmlFor="cidade-input"></label>
                <input type="search" name="cidade-input" id="cidade-input" placeholder="Porto Alegre" ref={inputCidade} required />
              </form>
              <button className="btn-localizacao" onClick={getPrevisao}>
                <i className="fa-solid fa-location-dot"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="clima-hoje">
          <div className="temperaturas">
            <img src={`images/${climas[0]?.[turno]}.png`} alt={climas[0]?.[turno]} />
            <div className="temp-valores">
              <span className="temp-max">{climas[0]?.temperaturaMax}<sup>°</sup></span>
              <span className="temp-separador">/</span>
              <span className="temp-min">{climas[0]?.temperaturaMin}<sup>°</sup></span>
            </div>
          </div>
          <div className="info-trio">
            <div className="info-card">
              <img src="images/precipitacao.png" alt="Precipitação" />
              <span className="info-valor">{climas[0]?.precipitacao}%</span>
              <span className="info-label">Precipitação</span>
            </div>
            <div className="info-card">
              <img src="images/humidade.png" alt="Humidade" />
              <span className="info-valor">{climas[0]?.humidade}%</span>
              <span className="info-label">Humidade</span>
            </div>
            <div className="info-card">
              <img src="images/velocidadeVento.png" alt="Velocidade do vento" />
              <span className="info-valor">{climas[0]?.velocidadeVento}km/h</span>
              <span className="info-label">Velocidade do vento</span>
            </div>
          </div>
        </div>

        <div className="lista-previsoes">
          {climas.slice(1).map((reg) => (
            <div key={reg.id} className="registro">
              <span className="data">{formatarData(reg.data)}</span>
              <div className="icone-tempo">
                <img src={`/images/${reg[turno]}.png`} alt={reg[turno]} />
              </div>
              <span className="descricao-tempo">{(descricoes as any)[reg[turno]]}</span>
              <span className="tempo-reg">{reg.temperaturaMax}</span>
              <span className="tempo-reg">{reg.temperaturaMin}</span>
            </div>
          ))}
        </div>
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