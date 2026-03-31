import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Cadastro() {

  const navigate = useNavigate()
  const location = useLocation()
  const registroParaEditar = location.state
  const [form, setForm] = useState(montarForm(registroParaEditar))
  const [toast, setToast] = useState(false)
  const [erros, setErros] = useState<any>({})

  function montarForm(reg?: any) {
    return {
      cidade: reg?.nomeCidade || '',
      data: reg?.data || '',
      tempoDia: reg?.tempoDia || 'SOL',
      tempoNoite: reg?.tempoNoite || 'NUBLADO',
      tempMax: reg?.temperaturaMax || '',
      tempMin: reg?.temperaturaMin || '',
      precipitacao: reg?.precipitacao || '',
      humidade: reg?.humidade || '',
      vento: reg?.velocidadeVento || ''
    }
  }

  function validar() {
    const campos = ['cidade', 'data', 'tempoDia', 'tempoNoite', 'tempMax', 'tempMin', 'precipitacao', 'humidade', 'vento']
    const novosErros: any = {}
    campos.forEach(campo => {
      if (!String((form as any)[campo]).trim()) novosErros[campo] = 'Campo obrigatório'
    })
    return novosErros
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function mostrarToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  async function createClima(e: any) {
    e.preventDefault()

    try {
      const novosErros = validar()
      if (Object.keys(novosErros).length>0) {
        setErros(novosErros)
        return
      }

      if (registroParaEditar) {
        await api.patch(`dados-meteorologicos/${registroParaEditar.id}`, {
          nomeCidade: form.cidade,
          data: form.data,
          tempoDia: form.tempoDia,
          tempoNoite: form.tempoNoite,
          temperaturaMax: Number(form.tempMax),
          temperaturaMin: Number(form.tempMin),
          precipitacao: Number(form.precipitacao),
          humidade: Number(form.humidade),
          velocidadeVento: Number(form.vento)
        })
      } else {
        await api.post(`dados-meteorologicos`, {
          nomeCidade: form.cidade,
          data: form.data,
          tempoDia: form.tempoDia,
          tempoNoite: form.tempoNoite,
          temperaturaMax: Number(form.tempMax),
          temperaturaMin: Number(form.tempMin),
          precipitacao: Number(form.precipitacao),
          humidade: Number(form.humidade),
          velocidadeVento: Number(form.vento)
        })
      }

      mostrarToast()
      setTimeout(() => navigate('/listar'), 1000)
    } catch (error: any) {
      console.error(error.response?.data)
      alert(`Erro ao salvar`)
    }
  }

  return (
    <>
      <Navbar estilo="nav-cadastrar" />

      <main>
        <h2 className="cadastro-titulo">Cadastro Metereológico</h2>

        <div className="campo-cidade-data">
          <div className="campo">
            <label htmlFor="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" placeholder="Porto Alegre" value={form.cidade} onChange={handleChange} />
            {erros.cidade && <span className="erro">{erros.cidade}</span>}
          </div>
          <div className="campo campo-data">
            <label htmlFor="data">Data</label>
            <input type="date" id="data" name="data" placeholder="dd/mm/aaaa" value={form.data} onChange={handleChange} />
            {erros.data && <span className="erro">{erros.data}</span>}
          </div>
        </div>

        <div className="painel-condicoes">
          <div className="condicoes-grid">
            <div>
              <div className="campo">
                <label htmlFor="tempo-manha">Tempo</label>
                <select name="tempoDia" id="tempo-manha" value={form.tempoDia} onChange={handleChange}>
                  <option value="SOL">Sol</option>
                  <option value="NUBLADO">Nublado</option>
                  <option value="CHUVA">Chuva</option>
                  <option value="NEVE">Neve</option>
                  <option value="TEMPESTADE">Tempestade</option>
                </select>
                {erros.tempoDia && <span className="erro">{erros.tempoDia}</span>}
              </div>
              <div className="campo tempo-noite">
                <label htmlFor="tempo-noite"></label>
                <select name="tempoNoite" id="tempo-noite" value={form.tempoNoite} onChange={handleChange}>
                  <option value="NUBLADO">Nublado</option>
                  <option value="CHUVA">Chuva</option>
                  <option value="NEVE">Neve</option>
                  <option value="TEMPESTADE">Tempestade</option>
                </select>
                {erros.tempoNoite && <span className="erro">{erros.tempoNoite}</span>}
              </div>
            </div>

            <div className="turno-tempo">
              <label>Turno</label>
              <div className="turno-opcoes">
                <p>Manhã</p>
                <p>Noite</p>
              </div>
            </div>

            <div className="campo campo-tempo-max">
              <label htmlFor="temp-max">Temperatura Máxima</label>
              <input type="number" id="temp-max" name="tempMax" value={form.tempMax} onChange={handleChange} />
              {erros.tempMax && <span className="erro">{erros.tempMax}</span>}
            </div>
            <div className="campo campo-temp-min">
              <label htmlFor="temp-min">Temperatura Mínima</label>
              <input type="number" id="temp-min" name="tempMin" value={form.tempMin} onChange={handleChange} />
              {erros.tempMin && <span className="erro">{erros.tempMin}</span>}
            </div>
            <div className="campo campo-precipitacao">
              <label htmlFor="precipitacao">Precipitação</label>
              <input type="text" id="precipitacao" name="precipitacao" value={form.precipitacao} onChange={handleChange} />
              {erros.precipitacao && <span className="erro">{erros.precipitacao}</span>}
            </div>
            <div className="campo campo-humidade">
              <label htmlFor="humidade">Humidade</label>
              <input type="text" id="humidade" name="humidade" value={form.humidade} onChange={handleChange} />
              {erros.humidade && <span className="erro">{erros.humidade}</span>}
            </div>
            <div className="campo campo-vento">
              <label htmlFor="vento">Velocidade do vento</label>
              <input type="text" id="vento" name="vento" value={form.vento} onChange={handleChange} />
              {erros.vento && <span className="erro">{erros.vento}</span>}
            </div>
          </div>
        </div>

        <div className="acoes-form">
          <button className="btn-cancelar" type="button" onClick={() => navigate('/')}>
            Cancelar
          </button>
          <button className="btn-salvar" type="button" onClick={createClima}>
            Salvar
          </button>
        </div>
      </main>

      <footer>
        <div>
          <span>make with love</span>
          <img src="images/db.png" alt="Logo DB" />
        </div>
      </footer>

      {toast && (
        <div className="toast">
          Salvo com sucesso!
        </div>
      )}
    </>
  )
}