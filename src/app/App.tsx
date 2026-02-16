import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Analise from './pages/Analise.tsx'
import Aprovado from './pages/Aprovado.tsx'
import Cpf from './pages/Cpf.tsx'
import ConfigurandoConta from './pages/ConfigurandoConta.tsx'
import Credenciais from './pages/Credenciais.tsx'
import Conta from './pages/Conta.tsx'
import ContaSaque from './pages/ContaSaque.tsx'
import ContaSaqueConfirmar from './pages/ContaSaqueConfirmar.tsx'
import ContaSaqueFinalizar from './pages/ContaSaqueFinalizar.tsx'
import ContaCheckout from './pages/ContaCheckout.tsx'
import ContaCheckoutPix from './pages/ContaCheckoutPix.tsx'
import SeguroPrestamista from './pages/SeguroPrestamista.tsx'
import Endereco from './pages/Endereco.tsx'
import EmConstrucao from './pages/EmConstrucao.tsx'
import Inicio from './pages/Inicio.tsx'
import Pessoa from './pages/Pessoa.tsx'
import Reprovado from './pages/Reprovado.tsx'
import Simulacao from './pages/Simulacao.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/simulacao" element={<Simulacao />} />
          <Route path="/cpf" element={<Cpf />} />
          <Route path="/pessoa" element={<Pessoa />} />
          <Route path="/analise" element={<Analise />} />
          <Route path="/aprovado" element={<Aprovado />} />
          <Route path="/reprovado" element={<Reprovado />} />
          <Route path="/configurando-conta" element={<ConfigurandoConta />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="/conta/saque" element={<ContaSaque />} />
          <Route path="/conta/saque/confirmar" element={<ContaSaqueConfirmar />} />
          <Route path="/conta/saque/seguro-prestamista" element={<SeguroPrestamista />} />
          <Route path="/conta/saque/finalizar" element={<ContaSaqueFinalizar />} />
          <Route path="/conta/checkout" element={<ContaCheckout />} />
          <Route path="/conta/checkout/pix/:id" element={<ContaCheckoutPix />} />
          <Route path="/credenciais" element={<Credenciais />} />
          <Route path="/endereco" element={<Endereco />} />
          <Route path="*" element={<EmConstrucao titulo="Página" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
