import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Cadastro from '../pages/Cadastro'
import api from '../services/api'

jest.mock('../services/api')

beforeEach(() => {
  jest.clearAllMocks()
})

test('renderiza o formulário de cadastro', () => {
  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>
  )

  expect(screen.getByText('Cadastro Metereológico')).toBeInTheDocument()
})

test('exibe erros quando tenta salvar com campos vazios', () => {
  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Salvar'))
  expect(screen.getAllByText('Campo obrigatório').length).toBeGreaterThan(0)
})

test('sucesso ao salvar com dados válidos', async () => {
  ;(api.post as jest.Mock).mockResolvedValue({ data: { id: 1 } })

  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText('Porto Alegre'), {
    target: { value: 'São Paulo' }
  })
  fireEvent.change(document.querySelector('input[type="date"]') as HTMLInputElement, {
    target: { value: '2026-04-01' }
  })
  fireEvent.change(document.querySelector('input[name="tempMax"]') as HTMLInputElement, {
    target: { value: '28' }
  })
  fireEvent.change(document.querySelector('input[name="tempMin"]') as HTMLInputElement, {
    target: { value: '18' }
  })
  fireEvent.change(document.querySelector('input[name="precipitacao"]') as HTMLInputElement, {
    target: { value: '20' }
  })
  fireEvent.change(document.querySelector('input[name="humidade"]') as HTMLInputElement, {
    target: { value: '65' }
  })
  fireEvent.change(document.querySelector('input[name="vento"]') as HTMLInputElement, {
    target: { value: '12' }
  })

  fireEvent.click(screen.getByText('Salvar'))

  await waitFor(() => {
    expect(screen.getByText('Salvo com sucesso!')).toBeInTheDocument()
  })
})

test('exibe erro ao salvar com erro da API', async () => {
  ;(api.post as jest.Mock).mockRejectedValue({ response: { status: 400 } })

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText('Porto Alegre'), {
    target: { value: 'São Paulo' }
  })
  fireEvent.change(document.querySelector('input[type="date"]') as HTMLInputElement, {
    target: { value: '2026-04-01' }
  })
  fireEvent.change(document.querySelector('input[name="tempMax"]') as HTMLInputElement, {
    target: { value: '28' }
  })
  fireEvent.change(document.querySelector('input[name="tempMin"]') as HTMLInputElement, {
    target: { value: '18' }
  })
  fireEvent.change(document.querySelector('input[name="precipitacao"]') as HTMLInputElement, {
    target: { value: '20' }
  })
  fireEvent.change(document.querySelector('input[name="humidade"]') as HTMLInputElement, {
    target: { value: '65' }
  })
  fireEvent.change(document.querySelector('input[name="vento"]') as HTMLInputElement, {
    target: { value: '12' }
  })

  fireEvent.click(screen.getByText('Salvar'))

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Erro ao salvar')
  })

  alertSpy.mockRestore()
})