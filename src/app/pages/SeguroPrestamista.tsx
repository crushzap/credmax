import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SimulacaoData = {
  valorDesejado: number
  valorLiberado?: number
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function SeguroPrestamista() {
  const navigate = useNavigate()
  const [opcao, setOpcao] = useState('')
  const simulacao = useMemo<SimulacaoData | null>(() => {
    const bruto = window.sessionStorage.getItem('simulacaoData')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as SimulacaoData
    } catch {
      return null
    }
  }, [])

  const valor = simulacao?.valorLiberado ?? simulacao?.valorDesejado ?? 0

  return (
    <div className="prestamista-page">
      <div className="prestamista-topo">
        <div className="prestamista-topo__marca">
          <span className="prestamista-topo__icone">$</span>
          <span>CredMax</span>
        </div>
      </div>
      <div className="prestamista-container">
        <div className="prestamista-card">
          <h2>Você está a apenas um passo de receber o valor solicitado</h2>
          <div className="prestamista-destaque">
            <span>Valor Aprovado</span>
            <strong>{valor ? formatarMoeda(valor) : ''}</strong>
            <small>Liberação imediata após definir garantia</small>
          </div>
          <div className="prestamista-info">
            Para finalizar, precisamos definir a modalidade de garantia. Assista ao vídeo abaixo e escolha a opção que melhor se adequa ao seu perfil.
          </div>
          <div className="prestamista-video">
            <video src="/prestamista.mp4" autoPlay playsInline muted controls />
          </div>
          <div className="prestamista-alerta">
            Importante: Este valor está reservado e será liberado mediante a contratação do seguro prestamista ou apresentação de um bem como garantia.
          </div>
          <div className="prestamista-titulo">Escolha como deseja prosseguir:</div>
          <button
            type="button"
            className={opcao === 'prestamista' ? 'prestamista-opcao prestamista-opcao--ativa' : 'prestamista-opcao'}
            onClick={() => setOpcao('prestamista')}
          >
            <div className="prestamista-opcao__topo">
              <span className="prestamista-opcao__titulo">
                <span className="prestamista-opcao__icone">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.5c-3.5 0-6.5 2.7-6.5 6v3.7c0 3.8 2.5 7.2 6.1 8.4l.4.1.4-.1c3.6-1.2 6.1-4.6 6.1-8.4V8.5c0-3.3-3-6-6.5-6zm4 9.5c0 2.8-1.8 5.3-4 6.3-2.2-1-4-3.5-4-6.3V8.6c0-2 1.8-3.6 4-3.6s4 1.6 4 3.6V12zm-4.8 2.2 3.4-3.4 1.2 1.2-4.6 4.6-2.6-2.6 1.2-1.2 1.4 1.4z"></path>
                  </svg>
                </span>
                <span>Seguro Prestamista</span>
              </span>
              <span className="prestamista-opcao__badge">Recomendado</span>
            </div>
            <ul>
              <li>
                <span className="prestamista-opcao__check">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Liberação imediata do valor total
              </li>
              <li>
                <span className="prestamista-opcao__check">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Devolução 100% do valor do seguro
              </li>
              <li>
                <span className="prestamista-opcao__check">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Sem necessidade de avaliação presencial
              </li>
            </ul>
            <span className="prestamista-opcao__divisor" />
            <span className="prestamista-opcao__rodape">Processo 100% digital • Receba hoje mesmo</span>
          </button>
          <button
            type="button"
            className={opcao === 'garantia' ? 'prestamista-opcao prestamista-opcao--ativa' : 'prestamista-opcao'}
            onClick={() => setOpcao('garantia')}
          >
            <div className="prestamista-opcao__topo">
              <span className="prestamista-opcao__titulo">
                <span className="prestamista-opcao__icone prestamista-opcao__icone--neutro">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 6.5h10.2c.8 0 1.6.3 2.2.9l2.1 2.1c.6.6.9 1.4.9 2.2v4.8h-2.1c-.5 1.3-1.8 2.2-3.3 2.2s-2.8-.9-3.3-2.2H8.3c-.5 1.3-1.8 2.2-3.3 2.2s-2.8-.9-3.3-2.2H0V8.5c0-1.1.9-2 2-2h3zm0 2H2v6h.7c.5-1.3 1.8-2.2 3.3-2.2s2.8.9 3.3 2.2h2.1V8.5H5zm11.2 0H13.5v6h1.9c.5-1.3 1.8-2.2 3.3-2.2.7 0 1.4.2 2 .6v-1.2c0-.3-.1-.5-.3-.7l-2.1-2.1c-.2-.2-.4-.3-.7-.3zm-11 6.8c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3zm10 0c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3z"></path>
                  </svg>
                </span>
                <span>Veículo ou imóvel como garantia</span>
              </span>
            </div>
            <ul>
              <li>
                <span className="prestamista-opcao__info prestamista-opcao__info--alerta">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4a8 8 0 1 0 .01 16A8 8 0 0 0 12 4zm0-2a10 10 0 1 1-.01 20A10 10 0 0 1 12 2zm-.8 4.5h1.6v6.2h-1.6V6.5zm0 7.6h1.6v1.8h-1.6v-1.8z"></path>
                  </svg>
                </span>
                Processo pode levar até 7 dias úteis
              </li>
              <li>
                <span className="prestamista-opcao__info prestamista-opcao__info--alerta">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4a8 8 0 1 0 .01 16A8 8 0 0 0 12 4zm0-2a10 10 0 1 1-.01 20A10 10 0 0 1 12 2zm-.8 4.5h1.6v6.2h-1.6V6.5zm0 7.6h1.6v1.8h-1.6v-1.8z"></path>
                  </svg>
                </span>
                Necessária avaliação presencial do bem
              </li>
              <li>
                <span className="prestamista-opcao__info">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3.5a8.5 8.5 0 1 0 .01 17A8.5 8.5 0 0 0 12 3.5zm0 2a6.5 6.5 0 1 1-.01 13A6.5 6.5 0 0 1 12 5.5zm-.8 3h1.6v5.1h-1.6V8.5zm0 6.4h1.6v1.6h-1.6v-1.6z"></path>
                  </svg>
                </span>
                Documentação adicional exigida
              </li>
            </ul>
            <span className="prestamista-opcao__divisor" />
            <span className="prestamista-opcao__rodape">Processo presencial • Sujeito a aprovação</span>
          </button>
          <button
            className="prestamista-botao"
            type="button"
            disabled={!opcao}
            onClick={() => {
              if (opcao === 'prestamista') {
                navigate('/conta/saque/finalizar')
              }
            }}
          >
            {opcao === 'prestamista' ? 'Contratar Seguro e Receber' : opcao === 'garantia' ? 'Agendar Avaliação Presencial' : 'Selecione uma opção para continuar'}
          </button>
        </div>
      </div>
    </div>
  )
}
