import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import OptionButton from '../components/OptionButton'
import PageContainer from '../components/PageContainer'
import PrimaryButton from '../components/PrimaryButton'
import ProgressBar from '../components/ProgressBar'

const motivos = [
  {
    label: 'Quitar dívidas',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
        <line x1="6" x2="6.01" y1="15" y2="15" />
      </svg>
    ),
  },
  {
    label: 'Emergência médica',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 12.5 8 16l4.5-4.5" />
        <path d="M12.5 7.5 16 4l4.5 4.5" />
        <path d="M12 3v6" />
        <path d="M12 15v6" />
      </svg>
    ),
  },
  {
    label: 'Meu negócio',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18" />
        <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
        <path d="M5 7v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    label: 'Reformar casa',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10.5 12 3l10 7.5" />
        <path d="M6 10v10h12V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Comprar veículo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 16h14" />
        <path d="M5 16a2 2 0 0 1-2-2v-3l3-5h12l3 5v3a2 2 0 0 1-2 2" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="16.5" cy="16.5" r="1.5" />
      </svg>
    ),
  },
  {
    label: 'Outros motivos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
]

const ocupacoes = [
  {
    label: 'Assalariado CLT',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="7" rx="2" />
        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    label: 'Servidor público',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18" />
        <path d="M6 9v10" />
        <path d="M10 9v10" />
        <path d="M14 9v10" />
        <path d="M18 9v10" />
        <path d="M4 6l8-3 8 3" />
      </svg>
    ),
  },
  {
    label: 'Autônomo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h8" />
        <path d="M6 10h12" />
        <path d="M4 14h16" />
        <path d="M2 18h20" />
      </svg>
    ),
  },
  {
    label: 'Empresário / MEI',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
      </svg>
    ),
  },
  {
    label: 'Aposentado',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M7 21V9a5 5 0 0 1 10 0v12" />
        <path d="M7 13h10" />
      </svg>
    ),
  },
  {
    label: 'Desempregado',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l16 16" />
        <path d="M7 7h10" />
        <path d="M9 3h6" />
        <path d="M7 21a5 5 0 0 1 10 0" />
      </svg>
    ),
  },
  {
    label: 'Dona de casa',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10.5 12 3l10 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Estudante',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 8 7-3 7 3" />
        <path d="M5 12V8" />
        <path d="M19 12V8" />
        <path d="M5 12c0 3.5 3 6 7 6s7-2.5 7-6" />
      </svg>
    ),
  },
  {
    label: 'Outro',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
]

const statusCpf = [
  {
    label: 'Tenho algumas pendências',
    descricao: 'Nome negativado ou restrições no CPF',
    estilo: 'danger',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6" />
        <path d="M9 9l6 6" />
      </svg>
    ),
  },
  {
    label: 'Meu nome está limpo',
    descricao: 'Sem restrições ou negativação',
    estilo: 'success',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
  },
]

const parcelasDisponiveis = [12, 24, 36, 48]
const diasDisponiveis = [5, 10, 15, 20, 25, 30]

type ModalidadeSelecionada = {
  id?: string
  titulo?: string
  teto?: number
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function calcularPrimeiraParcela(dia: number) {
  if (!dia) return null
  const base = new Date()
  base.setDate(base.getDate() + 90)
  let data = new Date(base.getFullYear(), base.getMonth(), dia)
  if (data < base) {
    data = new Date(base.getFullYear(), base.getMonth() + 1, dia)
  }
  return data
}

function calcularValorLiberado(params: { renda: number; valorDesejado: number; teto: number; piso: number; step: number }) {
  const tetoRenda = params.renda * 0.5
  const tetoFinal = Math.min(params.valorDesejado, params.teto, tetoRenda)
  const tetoArredondado = Math.floor(tetoFinal / params.step) * params.step
  if (tetoArredondado < params.piso) return 0
  const quantidadeSteps = Math.floor((tetoArredondado - params.piso) / params.step)
  const stepAleatorio = Math.floor(Math.random() * (quantidadeSteps + 1))
  return params.piso + stepAleatorio * params.step
}

export default function Simulacao() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState(0)
  const [motivo, setMotivo] = useState('')
  const [ocupacao, setOcupacao] = useState('')
  const [renda, setRenda] = useState(0)
  const [diaRecebimento, setDiaRecebimento] = useState('')
  const [situacaoCpf, setSituacaoCpf] = useState('')
  const [valorDesejado, setValorDesejado] = useState(5000)
  const [parcelas, setParcelas] = useState(12)
  const [melhorDia, setMelhorDia] = useState(0)
  const etapaAnterior = useRef(etapa)
  const modalidade = useMemo<ModalidadeSelecionada | null>(() => {
    const bruto = window.sessionStorage.getItem('modalidadeSelecionada')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as ModalidadeSelecionada
    } catch {
      return null
    }
  }, [])

  const percentual = useMemo(() => ((etapa + 1) / 6) * 100, [etapa])
  const valorInicialModalidade = useMemo(() => {
    if (modalidade?.id === 'pessoa-juridica') return 2500
    if (modalidade?.id === 'negativados') return 750
    if (modalidade?.id === 'pessoa-fisica') return 750
    if (situacaoCpf === 'Tenho algumas pendências') return 750
    if (situacaoCpf === 'Meu nome está limpo') return 750
    return 500
  }, [modalidade, situacaoCpf])
  const pisoModalidade = 500
  const tetoModalidade = useMemo(() => {
    if (modalidade?.id === 'negativados') return 4500
    if (modalidade?.id === 'pessoa-fisica') return 10000
    if (modalidade?.id === 'pessoa-juridica') return 25000
    if (typeof modalidade?.teto === 'number') return modalidade.teto
    if (situacaoCpf === 'Tenho algumas pendências') return 4500
    if (situacaoCpf === 'Meu nome está limpo') return 10000
    return 20000
  }, [modalidade, situacaoCpf])
  const rendaTexto = useMemo(() => formatarMoeda(renda), [renda])
  const valorTexto = useMemo(() => formatarMoeda(valorDesejado), [valorDesejado])
  const taxa = useMemo(() => 0.2048 * (parcelas / 12), [parcelas])
  const totalPagar = useMemo(() => valorDesejado * (1 + taxa), [taxa, valorDesejado])
  const parcelaMensal = useMemo(() => totalPagar / parcelas, [parcelas, totalPagar])
  const totalTexto = useMemo(() => formatarMoeda(totalPagar), [totalPagar])
  const parcelaTexto = useMemo(() => formatarMoeda(parcelaMensal), [parcelaMensal])
  const primeiraParcela = useMemo(() => calcularPrimeiraParcela(melhorDia), [melhorDia])
  const primeiraParcelaTexto = useMemo(() => (primeiraParcela ? primeiraParcela.toLocaleDateString('pt-BR') : ''), [primeiraParcela])
  const rendaAprovada = useMemo(() => renda >= 1000, [renda])

  useEffect(() => {
    if (etapa === 4 && etapaAnterior.current !== 4) {
      setValorDesejado(valorInicialModalidade)
    }
    etapaAnterior.current = etapa
  }, [etapa, valorInicialModalidade])

  useEffect(() => {
    setValorDesejado((atual) => {
      if (atual < pisoModalidade) return pisoModalidade
      if (atual > tetoModalidade) return tetoModalidade
      return atual
    })
  }, [tetoModalidade])

  const podeContinuar = useMemo(() => {
    if (etapa === 0) return Boolean(motivo)
    if (etapa === 1) return Boolean(ocupacao)
    if (etapa === 2) return renda > 0 && Number(diaRecebimento) >= 1 && Number(diaRecebimento) <= 31
    if (etapa === 3) return Boolean(situacaoCpf)
    if (etapa === 4) return Boolean(valorDesejado) && Boolean(parcelas)
    if (etapa === 5) return melhorDia > 0
    return true
  }, [diaRecebimento, etapa, melhorDia, motivo, ocupacao, parcelas, renda, situacaoCpf, valorDesejado])

  function avancar() {
    if (!podeContinuar) return
    if (etapa === 5) {
      if (!rendaAprovada) {
        navigate('/reprovado')
        return
      }
      const valorLiberado = calcularValorLiberado({
        renda,
        valorDesejado,
        teto: tetoModalidade,
        piso: pisoModalidade,
        step: 250,
      })
      if (!valorLiberado) {
        navigate('/reprovado')
        return
      }
      const totalPagarLiberado = valorLiberado * (1 + taxa)
      const parcelaMensalLiberada = totalPagarLiberado / parcelas
      const simulacao = {
        valorDesejado,
        valorLiberado,
        parcelas,
        parcelaMensal: parcelaMensalLiberada,
        totalPagar: totalPagarLiberado,
        primeiraParcela: primeiraParcelaTexto,
        diaVencimento: melhorDia,
      }
      window.sessionStorage.setItem('simulacaoData', JSON.stringify(simulacao))
      navigate('/analise')
      return
    }
    setEtapa((prev) => prev + 1)
  }

  function voltar() {
    setEtapa((prev) => Math.max(prev - 1, 0))
  }

  function handleRenda(valor: string) {
    const numeros = valor.replace(/\D/g, '')
    const convertido = Number(numeros || 0) / 100
    setRenda(convertido)
  }

  return (
    <PageContainer>
      <Card>
        <ProgressBar value={percentual} />
        <div className="step-label">{etapa + 1} de 6</div>
        {etapa === 0 ? (
          <>
            <h2 className="card-title">Motivo do Empréstimo</h2>
            <p className="card-subtitle">Para que você precisa do empréstimo?</p>
            <div className="options-grid">
              {motivos.map((opcao) => (
                <OptionButton key={opcao.label} label={opcao.label} icon={opcao.icon} selected={motivo === opcao.label} onClick={() => setMotivo(opcao.label)} />
              ))}
            </div>
          </>
        ) : null}
        {etapa === 1 ? (
          <>
            <h2 className="card-title">Ocupação</h2>
            <p className="card-subtitle">Informe sua ocupação</p>
            <div className="option-list">
              {ocupacoes.map((opcao) => (
                <button
                  key={opcao.label}
                  type="button"
                  className={ocupacao === opcao.label ? 'option-list__item option-list__item--selected' : 'option-list__item'}
                  onClick={() => setOcupacao(opcao.label)}
                >
                  <span className="option-list__icon">{opcao.icon}</span>
                  <span>{opcao.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}
        {etapa === 2 ? (
          <>
            <h2 className="card-title">Renda e Dia de Recebimento</h2>
            <p className="card-subtitle">Informe sua renda mensal e dia de recebimento</p>
            <div className="form-grid">
              <div className="form-field">
                <label>Renda mensal</label>
                <span className="form-helper">Informe sua renda líquida (valor que recebe)</span>
                <input className="input-field" value={rendaTexto} onChange={(event) => handleRenda(event.target.value)} inputMode="numeric" />
              </div>
              <div className="form-field">
                <label>Dia de recebimento</label>
                <span className="form-helper">Qual dia do mês você costuma receber sua renda?</span>
                <input className="input-field" value={diaRecebimento} onChange={(event) => setDiaRecebimento(event.target.value)} placeholder="Ex.: 25" inputMode="numeric" />
              </div>
            </div>
          </>
        ) : null}
        {etapa === 3 ? (
          <>
            <h2 className="card-title">Situação do CPF</h2>
            <p className="card-subtitle">Seu nome está negativado?</p>
            <div className="option-list">
              {statusCpf.map((opcao) => (
                <button
                  key={opcao.label}
                  type="button"
                  className={
                    situacaoCpf === opcao.label
                      ? `option-list__item option-list__item--selected option-list__item--${opcao.estilo}`
                      : 'option-list__item'
                  }
                  onClick={() => setSituacaoCpf(opcao.label)}
                >
                  <span className="option-list__icon">{opcao.icon}</span>
                  <div className="option-list__text">
                    <strong>{opcao.label}</strong>
                    <span>{opcao.descricao}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="info-box">Não se preocupe! Trabalhamos com pessoas em qualquer situação de crédito.</div>
          </>
        ) : null}
        {etapa === 4 ? (
          <>
            <h2 className="card-title">Qual valor você precisa?</h2>
            <p className="card-subtitle">Ajuste o valor e o número de parcelas</p>
            <div className="valor-box">
              <div>
                <span>Valor desejado</span>
                <br />
                <br />
                <strong>{valorTexto}</strong>
              </div>
            </div>
            <input
              type="range"
              className="range"
              min={pisoModalidade}
              max={tetoModalidade}
              step={250}
              value={valorDesejado}
              onChange={(event) => setValorDesejado(Number(event.target.value))}
            />
            <div className="range-labels">
              <span>{formatarMoeda(pisoModalidade)}</span>
              <span>{formatarMoeda(tetoModalidade)}</span>
            </div>
            <div className="parcelas-grid">
              {parcelasDisponiveis.map((parcela) => (
                <button
                  key={parcela}
                  type="button"
                  className={parcelas === parcela ? 'parcelas-button parcelas-button--selected' : 'parcelas-button'}
                  onClick={() => setParcelas(parcela)}
                >
                  <strong>{parcela}x</strong>
                  <span>meses</span>
                </button>
              ))}
            </div>
            <div className="simulacao-box">
              <div className="simulacao-box__titulo">
                <span className="simulacao-box__icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M17 5.5c0 2-2.2 3.5-5 3.5s-5-1.5-5-3.5 2.2-3.5 5-3.5 5 1.5 5 3.5Z" />
                    <path d="M17 18.5c0 2-2.2 3.5-5 3.5s-5-1.5-5-3.5" />
                    <path d="M17 12c0 2-2.2 3.5-5 3.5s-5-1.5-5-3.5" />
                  </svg>
                </span>
                <strong>Sua simulação</strong>
              </div>
              <div className="simulacao-box__linha">
                <span>Parcela mensal</span>
                <strong>{parcelaTexto}</strong>
              </div>
              <div className="simulacao-box__linha">
                <span>Total a pagar</span>
                <strong>{totalTexto}</strong>
              </div>
              <span className="simulacao-box__nota">{parcelas} parcelas de {parcelaTexto}</span>
            </div>
            <div className="simulacao-alerta">Valores sujeitos à análise de crédito.</div>
          </>
        ) : null}
        {etapa === 5 ? (
          <>
            <h2 className="card-title">Melhor Dia</h2>
            <p className="card-subtitle">Primeira parcela só daqui a 90 dias. Mais tempo, menos preocupação.</p>
            <div className="dias-grid">
              {diasDisponiveis.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  className={melhorDia === dia ? 'dia-card dia-card--selected' : 'dia-card'}
                  onClick={() => setMelhorDia(dia)}
                >
                  <strong>{dia}</strong>
                  <span>todo mês</span>
                </button>
              ))}
            </div>
            {primeiraParcelaTexto ? (
              <div className="primeira-parcela-box">
                <span>Primeira parcela</span>
                <strong>{primeiraParcelaTexto}</strong>
              </div>
            ) : null}
          </>
        ) : null}
        <div className="simulacao-actions">
          {etapa > 0 ? (
            <button className="button-secondary" type="button" onClick={voltar}>
              <span className="button-secondary__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </span>
              Voltar
            </button>
          ) : (
            <span />
          )}
          <PrimaryButton type="button" onClick={avancar} disabled={!podeContinuar}>
            {etapa === 5 ? 'Finalizar análise' : 'Continuar'}
          </PrimaryButton>
        </div>
      </Card>
    </PageContainer>
  )
}
