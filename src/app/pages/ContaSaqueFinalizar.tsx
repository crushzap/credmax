import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SimulacaoData = {
  valorDesejado: number
  valorLiberado?: number
  parcelas: number
  parcelaMensal: number
}

type ModalidadeSelecionada = {
  id: string
  titulo: string
  teto: number
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function ContaSaqueFinalizar() {
  const navigate = useNavigate()
  const [plano, setPlano] = useState('aprovado')
  const [mostrarOfertas, setMostrarOfertas] = useState(false)
  const simulacao = useMemo<SimulacaoData | null>(() => {
    const bruto = window.sessionStorage.getItem('simulacaoData')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as SimulacaoData
    } catch {
      return null
    }
  }, [])
  const modalidade = useMemo<ModalidadeSelecionada | null>(() => {
    const bruto = window.sessionStorage.getItem('modalidadeSelecionada')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as ModalidadeSelecionada
    } catch {
      return null
    }
  }, [])
  const valor = simulacao?.valorLiberado ?? simulacao?.valorDesejado ?? 5000
  const parcelasAprovadas = simulacao?.parcelas ?? 12
  const parcelaMensal = simulacao?.parcelaMensal ?? 502.01
  const tetoModalidade = modalidade?.teto ?? 20000
  const aprovado = {
    id: 'aprovado',
    valor,
    seguro: 19,
    parcelas: `${parcelasAprovadas}x de ${formatarMoeda(parcelaMensal)}`,
  }
  const ofertas = useMemo(() => {
    const valorBase = Math.max(valor, 1)
    const teto = Math.max(valor, tetoModalidade)
    const incremento1 = Math.max(valor * 0.15, 500)
    const incremento2 = Math.max(valor * 0.3, 1000)
    let valor1 = Math.min(valor + incremento1, teto)
    if (valor1 <= valor) valor1 = Math.min(valor + 500, teto)
    let valor2 = Math.min(valor + incremento2, teto)
    if (valor2 <= valor1) valor2 = Math.min(valor1 + 500, teto)
    const calcularParcela = (valorOferta: number) => (parcelaMensal / valorBase) * valorOferta
    const calcularSeguro = (valorOferta: number) => Math.max(aprovado.seguro + 4, Math.round(aprovado.seguro * (valorOferta / valorBase)))
    return [
      {
        id: 'oferta-1',
        valor: valor1,
        seguro: calcularSeguro(valor1),
        parcelas: `${parcelasAprovadas}x de ${formatarMoeda(calcularParcela(valor1))}`,
      },
      {
        id: 'oferta-2',
        valor: valor2,
        seguro: calcularSeguro(valor2),
        parcelas: `${parcelasAprovadas}x de ${formatarMoeda(calcularParcela(valor2))}`,
      },
    ]
  }, [aprovado.seguro, parcelaMensal, parcelasAprovadas, tetoModalidade, valor])
  const ofertaSelecionada =
    plano === 'aprovado'
      ? aprovado
      : ofertas.find((oferta) => oferta.id === plano) ?? aprovado

  useEffect(() => {
    setMostrarOfertas(false)
    const timer = window.setTimeout(() => setMostrarOfertas(true), 1400)
    return () => window.clearTimeout(timer)
  }, [valor])

  return (
    <div className="finalizar-page">
      <div className="finalizar-topo">
        <div className="finalizar-topo__marca">
          <span className="finalizar-topo__icone">$</span>
          <span>CredMax</span>
        </div>
        <div className="finalizar-topo__parceiro">
          <img className="finalizar-topo__logo" src="/stellanz.svg" alt="Stellanz" />
          <span>Parceira Oficial Stellanz</span>
          <span>Proteção garantida para o seu empréstimo</span>
        </div>
      </div>
      <div className="finalizar-container">
        <div className="finalizar-conteudo">
          <h2>Seu empréstimo está quase liberado</h2>
          <div className="finalizar-card">
            <div className="finalizar-card__titulo">Benefícios inclusos no seguro:</div>
            <ul className="finalizar-lista">
              <li>
                <span className="finalizar-lista__icone">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Proteção em caso de morte ou invalidez
              </li>
              <li>
                <span className="finalizar-lista__icone">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Proteção contra desemprego
              </li>
              <li>
                <span className="finalizar-lista__icone">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Liberação imediata do valor total
              </li>
              <li>
                <span className="finalizar-lista__icone">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                100% reembolsável após quitação
              </li>
              <li>
                <span className="finalizar-lista__icone">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                  </svg>
                </span>
                Sem carência • vale desde o 1º dia
              </li>
            </ul>
          </div>
          <div className="finalizar-card">
            <div className="finalizar-card__titulo">Avaliações dos clientes</div>
            <div className="finalizar-avaliacao">
              <div className="finalizar-estrelas">★★★★★</div>
              <div className="finalizar-avaliacao__titulo">Maria S.</div>
              <div>“Processo muito rápido e seguro. O valor foi liberado em minutos.”</div>
            </div>
            <div className="finalizar-avaliacao">
              <div className="finalizar-estrelas">★★★★★</div>
              <div className="finalizar-avaliacao__titulo">João P.</div>
              <div>“Excelente parceria com a Allianz. Me deu muita confiança.”</div>
            </div>
          </div>
          <div
            className={plano === 'aprovado' ? 'finalizar-card finalizar-card--selecionado' : 'finalizar-card'}
            onClick={() => setPlano('aprovado')}
          >
            <div className="finalizar-plano">
              <div className="finalizar-plano__cabecalho">
                <label className="finalizar-radio">
                  <input type="radio" name="oferta" checked={plano === 'aprovado'} onChange={() => setPlano('aprovado')} />
                  <span className="finalizar-radio__icone">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
                    </svg>
                  </span>
                  <span>Valor aprovado para liberação</span>
                </label>
                <div className="finalizar-seguro">
                  <span>Seguro</span>
                  <strong>R$ 19,00</strong>
                </div>
              </div>
              <div className="finalizar-plano__principal">
                <strong className="finalizar-plano__valor">{formatarMoeda(valor)}</strong>
                <div className="finalizar-plano__parcelas">{aprovado.parcelas}</div>
              </div>
            </div>
            <div className="finalizar-divisor" />
            <div className="finalizar-detalhes">
              <div>Detalhamento da Tarifa do Seguro</div>
              <ul>
                <li>
                  <span>Cobertura por morte ou invalidez</span>
                  <strong>R$ 7,74</strong>
                </li>
                <li>
                  <span>Proteção contra desemprego</span>
                  <strong>R$ 6,62</strong>
                </li>
                <li>
                  <span>Assistência 24h emergencial</span>
                  <strong>R$ 4,64</strong>
                </li>
              </ul>
              <div className="finalizar-detalhes__total">
                <span>Total do seguro</span>
                <strong>R$ 19,00</strong>
              </div>
            </div>
          </div>
          <div className="finalizar-card">
            <div className="finalizar-card__titulo">Temos mais 2 ofertas aprovadas para seu CPF:</div>
            {!mostrarOfertas ? (
              <div className="finalizar-ofertas__loader">
                <span className="finalizar-ofertas__spinner" />
                <div className="finalizar-ofertas__texto">
                  <strong>Mais 2 ofertas aprovadas</strong>
                  <span>Carregando...</span>
                </div>
              </div>
            ) : (
              <div className="finalizar-ofertas finalizar-ofertas--aparecer">
                {ofertas.map((oferta) => (
                  <div
                    key={oferta.id}
                    className={plano === oferta.id ? 'finalizar-opcao finalizar-opcao--ativa' : 'finalizar-opcao'}
                    onClick={() => setPlano(oferta.id)}
                  >
                    <label>
                      <input type="radio" name="oferta" checked={plano === oferta.id} onChange={() => setPlano(oferta.id)} />
                      <div className="finalizar-opcao__info">
                        <span>Você receberá</span>
                        <strong>{formatarMoeda(oferta.valor)}</strong>
                        <div>{oferta.parcelas}</div>
                      </div>
                    </label>
                    <div className="finalizar-opcao__seguro">
                      <span>Seguro</span>
                      <strong>{formatarMoeda(oferta.seguro)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="finalizar-rodape">
            <div className="finalizar-rodape__valor">{formatarMoeda(ofertaSelecionada.seguro)}</div>
            <div className="finalizar-rodape__pix">Pagamento único via PIX</div>
            <button
              className="finalizar-rodape__botao"
              type="button"
              onClick={() => {
                window.sessionStorage.setItem('checkoutData', JSON.stringify({ seguro: ofertaSelecionada.seguro }))
                navigate('/conta/checkout')
              }}
            >
              <span className="finalizar-rodape__botao-icone">
                <img src="/pix-106.svg" alt="PIX" />
              </span>
              Pagar seguro
            </button>
            <div className="finalizar-rodape__info">Pagamento reconhecido automaticamente</div>
            <div className="finalizar-rodape__info">Processo 100% seguro</div>
          </div>
        </div>
      </div>
    </div>
  )
}
