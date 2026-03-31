import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'
import api from '../services/api'

jest.mock('../services/api')

beforeEach(() => {
  jest.clearAllMocks()
})

test('renderiza a página home', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  expect(screen.getByText('Hoje')).toBeInTheDocument()
  expect(screen.getByText('Pesquise a cidade')).toBeInTheDocument()
})

test('exibe dados do dia atual', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  expect(screen.getByText('Precipitação')).toBeInTheDocument()
  expect(screen.getByText('Humidade')).toBeInTheDocument()
  expect(screen.getByText('Velocidade do vento')).toBeInTheDocument()
})

test('busca por cidade válida', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({
    data: [
      {
        id: 1,
        tempoDia: 'SOL',
        tempoNoite: 'NUBLADO',
        temperaturaMax: 28,
        temperaturaMin: 18,
        precipitacao: 10,
        humidade: 60,
        velocidadeVento: 15,
        data: '2026-03-31'
      }
    ]
  })

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const input = screen.getByPlaceholderText('Porto Alegre') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'São Paulo' } })
  fireEvent.click(screen.getByRole('button', { name: '' }))

  await waitFor(() => {
    expect(api.get).toHaveBeenCalledWith(
      'dados-meteorologicos/cidade/São Paulo/previsao-proximos-dias'
    )
  })
})

test('exibe erro ao buscar cidade inexistente', async () => {
  ;(api.get as jest.Mock).mockRejectedValue({ response: { status: 404 } })

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const input = screen.getByPlaceholderText('Porto Alegre') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'CidadeInexistente' } })
  fireEvent.click(screen.getByRole('button', { name: '' }))

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Cidade não encontrada')
  })

  alertSpy.mockRestore()
})

test('exibe erro quando API retorna erro', async () => {
  ;(api.get as jest.Mock).mockRejectedValue({ response: { status: 500 } })

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const input = screen.getByPlaceholderText('Porto Alegre') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'São Paulo' } })
  fireEvent.click(screen.getByRole('button', { name: '' }))

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Erro ao buscar previsão, tente novamente')
  })

  alertSpy.mockRestore()
})

test('exibe previsão dos próximos 7 dias', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({
    data: [
      {
        id: 1,
        tempoDia: 'SOL',
        tempoNoite: 'NUBLADO',
        temperaturaMax: 28,
        temperaturaMin: 18,
        precipitacao: 10,
        humidade: 60,
        velocidadeVento: 15,
        data: '2026-03-31'
      },
      {
        id: 2,
        tempoDia: 'NUBLADO',
        tempoNoite: 'CHUVA',
        temperaturaMax: 25,
        temperaturaMin: 15,
        precipitacao: 40,
        humidade: 75,
        velocidadeVento: 20,
        data: '2026-04-01'
      },
      {
        id: 3,
        tempoDia: 'CHUVA',
        tempoNoite: 'TEMPESTADE',
        temperaturaMax: 22,
        temperaturaMin: 12,
        precipitacao: 60,
        humidade: 85,
        velocidadeVento: 25,
        data: '2026-04-02'
      },
      {
        id: 4,
        tempoDia: 'SOL',
        tempoNoite: 'NUBLADO',
        temperaturaMax: 26,
        temperaturaMin: 16,
        precipitacao: 15,
        humidade: 65,
        velocidadeVento: 12,
        data: '2026-04-03'
      },
      {
        id: 5,
        tempoDia: 'NEVE',
        tempoNoite: 'NEVE',
        temperaturaMax: 4,
        temperaturaMin: -3,
        precipitacao: 30,
        humidade: 85,
        velocidadeVento: 18,
        data: '2026-04-04'
      },
      {
        id: 6,
        tempoDia: 'NUBLADO',
        tempoNoite: 'SOL',
        temperaturaMax: 24,
        temperaturaMin: 14,
        precipitacao: 5,
        humidade: 50,
        velocidadeVento: 10,
        data: '2026-04-05'
      },
      {
        id: 7,
        tempoDia: 'TEMPESTADE',
        tempoNoite: 'CHUVA',
        temperaturaMax: 20,
        temperaturaMin: 10,
        precipitacao: 80,
        humidade: 90,
        velocidadeVento: 30,
        data: '2026-04-06'
      },
      {
        id: 8,
        tempoDia: 'SOL',
        tempoNoite: 'NUBLADO',
        temperaturaMax: 27,
        temperaturaMin: 17,
        precipitacao: 10,
        humidade: 60,
        velocidadeVento: 14,
        data: '2026-04-07'
      }
    ]
  })

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const input = screen.getByPlaceholderText('Porto Alegre') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'São Paulo' } })
  fireEvent.click(screen.getByRole('button', { name: '' }))

  await waitFor(() => {
    expect(api.get).toHaveBeenCalled()
  })
})

test('exibe erro ao digitar cidade vazia', async () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('button', { name: '' }))

  expect(alertSpy).toHaveBeenCalledWith('Digite uma cidade.')

  alertSpy.mockRestore()
})
