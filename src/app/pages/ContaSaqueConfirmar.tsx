import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBancredSession } from '../hooks/useBancredSession'

type SaqueData = {
  tipo?: string
  chave?: string
  banco?: string
  criadoEm?: string
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarDataHora(valor?: string) {
  const data = valor ? new Date(valor) : new Date()
  const dataTexto = data.toLocaleDateString('pt-BR')
  const horaTexto = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dataTexto} às ${horaTexto}`
}

function obterTipoLabel(tipo?: string) {
  if (tipo === 'cpf') return 'CPF'
  if (tipo === 'telefone') return 'Telefone'
  if (tipo === 'email') return 'E-mail'
  if (tipo === 'aleatoria') return 'Chave aleatória'
  return 'PIX'
}

export default function ContaSaqueConfirmar() {
  const navigate = useNavigate()
  const { user, loan } = useBancredSession()
  const saqueData = useMemo<SaqueData | null>(() => {
    const bruto = window.sessionStorage.getItem('saqueData')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as SaqueData
    } catch {
      return null
    }
  }, [])

  const valor = loan?.valorLiberado ?? loan?.valorDesejado ?? 0
  const nome = user?.nome || user?.NOME || ''
  const cpf = user?.cpf || user?.CPF || ''
  const tipoLabel = obterTipoLabel(saqueData?.tipo)
  const chave = saqueData?.chave || ''
  const banco = saqueData?.banco || ''
  const quando = formatarDataHora(saqueData?.criadoEm)

  return (
    <div className="conta-confirmar-page">
      <div className="conta-confirmar-topo" />
      <div className="conta-confirmar-container">
        <div className="conta-confirmar-card">
          <h2>Confirmar Transferência</h2>
          <div className="conta-confirmar-bloco">
            <span>Valor</span>
            <strong>{valor ? formatarMoeda(valor) : ''}</strong>
          </div>
          <div className="conta-confirmar-bloco">
            <span>De</span>
            <strong>{nome}</strong>
            <small>{cpf}</small>
          </div>
          <div className="conta-confirmar-bloco">
            <span>Para</span>
            <strong>{chave ? `${tipoLabel}: ${chave}` : ''}</strong>
            <small>{banco ? `Banco: ${banco}` : ''}</small>
          </div>
          <div className="conta-confirmar-bloco">
            <span>Quando</span>
            <strong>{quando}</strong>
          </div>
          <div className="conta-confirmar-bloco">
            <span>Tipo</span>
            <div className="conta-confirmar-pix">
              <span className="conta-confirmar-pix__icone">
                <svg className="conta-confirmar-pix__svg" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.8C231.1-7.6 280.3-7.6 310.6 22.8L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.78L22.76 310.6C-7.586 280.3-7.586 231.1 22.76 200.8L80.78 142.7H112.6z"></path>
                </svg>
              </span>
              <span>PIX</span>
            </div>
          </div>
          <div className="conta-confirmar-alerta">
            Verifique todos os dados antes de confirmar. Transferências PIX são instantâneas e não podem ser canceladas.
          </div>
          <button className="conta-confirmar-botao" type="button" onClick={() => navigate('/conta/saque/seguro-prestamista')}>
            Confirmar Transferência
          </button>
          <button className="conta-confirmar-secundario" type="button" onClick={() => navigate('/conta/saque')}>
            Editar Dados
          </button>
        </div>
      </div>
    </div>
  )
}
