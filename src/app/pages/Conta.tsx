import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

type SimulacaoData = {
  valorDesejado: number
  valorLiberado?: number
  parcelas: number
  parcelaMensal: number
  totalPagar: number
  primeiraParcela: string
  diaVencimento: number
}

type UserData = {
  nome?: string
  NOME?: string
  cpf?: string
  CPF?: string
}

export default function Conta() {
  const navigate = useNavigate()
  const simulacao = useMemo<SimulacaoData | null>(() => {
    const bruto = window.sessionStorage.getItem('simulacaoData')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as SimulacaoData
    } catch {
      return null
    }
  }, [])
  const userData = useMemo<UserData | null>(() => {
    const bruto = window.sessionStorage.getItem('userData')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as UserData
    } catch {
      return null
    }
  }, [])

  const nome = userData?.nome || userData?.NOME || ''
  const valorDisponivel = simulacao?.valorLiberado ?? simulacao?.valorDesejado ?? 0
  const parcelaMensal = simulacao?.parcelaMensal ?? 0
  const primeiraParcela = simulacao?.primeiraParcela || ''

  return (
    <div className="conta-page">
      <section className="conta-topo">
        <div className="conta-topo__acoes">
          <button className="conta-icone" type="button" aria-label="Perfil">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <div className="conta-topo__icones">
            <button className="conta-icone" type="button" aria-label="Visualizar">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button className="conta-icone" type="button" aria-label="Segurança">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="conta-topo__saudacao">
          <span>{nome ? `Olá, ${nome}` : 'Olá'}</span>
          <div className="conta-saldo">
            <span>Saldo em conta</span>
            <strong>{valorDisponivel ? formatarMoeda(valorDisponivel) : ''}</strong>
            <small>rende 102% do CDI</small>
          </div>
        </div>
      </section>
      <section className="conta-acoes">
        <button className="conta-acao" type="button" onClick={() => navigate('/conta/saque')}>
          <span className="conta-acao__icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
          <span>Sacar agora</span>
        </button>
        <button className="conta-acao" type="button">
          <span className="conta-acao__icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="5" y="5" rx="2" />
              <path d="M3 9h4" />
              <path d="M3 15h4" />
              <path d="M17 9h4" />
              <path d="M17 15h4" />
            </svg>
          </span>
          <span>PIX</span>
        </button>
        <button className="conta-acao" type="button">
          <span className="conta-acao__icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16" />
              <path d="M4 12h10" />
              <path d="M4 17h7" />
            </svg>
          </span>
          <span>Pagar boleto</span>
        </button>
        <button className="conta-acao" type="button">
          <span className="conta-acao__icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 11V6a3 3 0 0 0-6 0v5" />
              <path d="M5 11h14l-1.5 8h-11z" />
            </svg>
          </span>
          <span>Cofrinhos</span>
        </button>
      </section>
      <section className="conta-conteudo">
        <div className="conta-card">
          <div className="conta-card__topo">
            <div>
              <h3>Seu Empréstimo</h3>
              <span>Valor disponível:</span>
            </div>
            <button className="conta-card__botao" type="button" onClick={() => navigate('/conta/saque')}>
              Sacar →
            </button>
          </div>
          <strong className="conta-card__valor">{valorDisponivel ? formatarMoeda(valorDisponivel) : ''}</strong>
          <div className="conta-card__linha">
            <span>Próximo vencimento:</span>
            <span>{primeiraParcela && parcelaMensal ? `${primeiraParcela} - ${formatarMoeda(parcelaMensal)}` : ''}</span>
          </div>
        </div>
        <div className="conta-lista">
          <div className="conta-item">
            <span className="conta-item__icone">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="12" x="3" y="6" rx="2" />
                <path d="M7 10h4" />
              </svg>
            </span>
            <div>
              <strong>Cartões</strong>
              <span>Cartão de crédito sem anuidade com limite pré-aprovado.</span>
            </div>
            <span className="conta-item__seta">↗</span>
          </div>
          <div className="conta-item">
            <span className="conta-item__icone">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 5H5v14h14z" />
                <path d="m9 9 6 6" />
                <path d="m15 9-6 6" />
              </svg>
            </span>
            <div>
              <strong>Empréstimos</strong>
              <span>Gerencie ou solicite novos valores</span>
            </div>
            <span className="conta-item__seta">↗</span>
          </div>
          <div className="conta-item">
            <span className="conta-item__icone">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 17 6-6 4 4 7-7" />
                <path d="M14 7h7v7" />
              </svg>
            </span>
            <div>
              <strong>Investimentos</strong>
              <span>Faça seu dinheiro render com 100% do CDI.</span>
            </div>
            <span className="conta-item__seta">↗</span>
          </div>
        </div>
      </section>
      <nav className="conta-nav">
        <button className="conta-nav__item conta-nav__item--ativo" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
          <span>Home</span>
        </button>
        <button className="conta-nav__item" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M5 9h14" />
          </svg>
          <span>Saque</span>
        </button>
        <button className="conta-nav__item" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V7" />
            <path d="m10 10 4-4" />
            <path d="M15 5h-4v4" />
          </svg>
          <span>Meus Dados</span>
        </button>
      </nav>
    </div>
  )
}
