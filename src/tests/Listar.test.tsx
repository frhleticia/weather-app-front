import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Listar from '../pages/Listar'
import api from '../services/api'

jest.mock('../services/api')

beforeEach(() => {
  jest.clearAllMocks()
})

test('renderiza a página de listagem', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({ data: { content: [], totalPages: 0, number: 0 } })
  render(<MemoryRouter><Listar /></MemoryRouter>)
  expect(screen.getByText('Lista de cidades')).toBeInTheDocument()
})

test('exibe mensagem quando não há dados', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({ data: { content: [], totalPages: 0, number: 0 } })
  render(<MemoryRouter><Listar /></MemoryRouter>)
  expect(await screen.findByText('Nenhum dado encontrado')).toBeInTheDocument()
})

test('exibe dados quando a API retorna registros', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({ data: { content: [{ id: 1, nomeCidade: 'Porto Alegre', data: '2026-03-31' }], totalPages: 1, number: 0 } })
  render(<MemoryRouter><Listar /></MemoryRouter>)
  expect(await screen.findByText('Porto Alegre')).toBeInTheDocument()
})

test('exibe dados da cidade pesquisada', async () => {
  ;(api.get as jest.Mock)
    .mockResolvedValueOnce({ data: { content: [], totalPages: 0, number: 0 } })
    .mockResolvedValueOnce({ data: { content: [{ id: 1, nomeCidade: 'Canoas', data: '2026-03-31' }], totalPages: 1, number: 0 } })
  
  render(<MemoryRouter><Listar /></MemoryRouter>)
  
  const input = screen.getByPlaceholderText('Porto Alegre')
  fireEvent.change(input, { target: { value: 'Canoas' } })
  fireEvent.click(screen.getAllByRole('button')[0])
  
  expect(await screen.findByText('Canoas')).toBeInTheDocument()
})

test('dados aparecem ordenados por data decrescente', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({
    data: {
      content: [
        { id: 1, nomeCidade: 'Porto Alegre', data: '2026-03-31' },
        { id: 2, nomeCidade: 'Canoas', data: '2026-03-30' },
        { id: 3, nomeCidade: 'Pelotas', data: '2026-03-29' }
      ],
      totalPages: 1,
      number: 0
    }
  })

  render(<MemoryRouter><Listar /></MemoryRouter>)

  await screen.findByText('Porto Alegre')
  
  const cidades = screen.getAllByRole('cell').filter((cell, idx) => idx % 3 === 0)
  expect(cidades[0].textContent).toBe('Porto Alegre')
  expect(cidades[1].textContent).toBe('Canoas')
  expect(cidades[2].textContent).toBe('Pelotas')
})

test('suporta paginação com múltiplas páginas', async () => {
  ;(api.get as jest.Mock).mockResolvedValue({
    data: {
      content: [{ id: 1, nomeCidade: 'Porto Alegre', data: '2026-03-31' }],
      totalPages: 3,
      number: 0
    }
  })

  render(<MemoryRouter><Listar /></MemoryRouter>)

  await screen.findByText('Porto Alegre')
  
  expect(screen.getByText(/Página 1 de 3/)).toBeInTheDocument()
  expect(screen.getByText('<')).toBeInTheDocument()
  expect(screen.getByText('>')).toBeInTheDocument()
})