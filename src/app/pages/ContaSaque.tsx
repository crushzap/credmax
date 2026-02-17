import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBancredSession } from '../hooks/useBancredSession'

const opcoes = [
  { value: 'cpf', label: 'CPF', placeholder: 'Digite seu CPF' },
  { value: 'telefone', label: 'Telefone', placeholder: 'Digite seu telefone' },
  { value: 'email', label: 'E-mail', placeholder: 'Digite seu e-mail' },
  { value: 'aleatoria', label: 'Chave aleatória', placeholder: 'Digite sua chave' },
]

const bancosDisponiveis = [
  '654 - A.J. RENNER S.A.',
  '246 - ABC-BRASIL S.A.',
  '213 - ARBI S.A.',
  '019 - AZTECA DO BRASIL S.A.',
  '025 - BANCO ALFA',
  '241 - Banco Classico S.A',
  '083 - BANCO DA CHINA BRASIL S.A.',
  '300 - BANCO DE LA NACION ARGENTINA',
  '495 - BANCO DE LA PROVINCIA DE BUENOS AIRES',
  '494 - BANCO DE LA REPUBLICA ORIENTAL DEL URUGUAY',
  '001 - BANCO DO BRASIL',
  '037 - BANCO DO ESTADO DO PARÁ S.A',
  '456 - BANCO TOKYO MITSUBISH UFJ BRASIL S.A',
  '370 - BANCO WESTLB DO BRASIL',
  '756 - BANCOOB',
  '047 - BANESE',
  '033 - BANESPA',
  '021 - BANESTES',
  '719 - BANIF-BANCO INTERNACIONAL DO FUNCHAL (BRASIL) S.A',
  '755 - BANK OF AMERICA MERRILL LYNCH BANCO MULTIPLO S.A.',
  '041 - BANRISUL',
  '740 - BARCLAYS S.A.',
  '003 - BASA',
  '107 - BBM S.A',
  '081 - BBN BANCO BRASILEIRO DE NEGOCIOS S.A',
  '250 - BCV - BANCO DE CREDITO E VAREJO S.A',
  '036 - BEM',
  '122 - BERJ S.A',
  '078 - BES INVESTIMENTO DO BRASIL SA - BANCO DE INVESTIM.',
  '739 - BGN S.A.',
  '320 - BIC BANCO',
  '096 - BM&F DE SERV. DE LIQUIDACAO E CUSTODIA S.A',
  '394 - BMC S.A.',
  '318 - BMG S.A.',
  '004 - BNB',
  '752 - BNP PARIBAS BRASIL S.A',
  '017 - BNY MELLON S.A.',
  '248 - BOA VISTA INTERATLANTICO S.A',
  '218 - BONSUCESSO S.A.',
  '069 - BPN BRASIL BANCO MULTIPLO S.A',
  '065 - BRACCE S.A.',
  '237 - BRADESCO',
  '225 - BRASCAN S.A.',
  '125 - BRASIL PLURAL S.A. BANCO MULTIPLO',
  '070 - BRB',
  '092 - BRICKELL S A CREDITO, FINANCIAMENTO E INVESTIMENTO',
  '208 - BTG PACTUAL S.A.',
  '263 - CACIQUE S.A.',
  '104 - CAIXA ECON. FEDERAL',
  '473 - CAIXA GERAL - BRASIL S.A.',
  '412 - CAPITAL S.A.',
  '040 - CARGILL S.A',
  '112 - CC UNICRED BRASIL CENTRAL',
  '084 - CC UNIPRIME NORTE DO PARANA',
  '114 - CECOOPES-CENTRAL DAS COOP DE ECON E CRED MUTUO DO',
  '085 - CECREDI',
  '266 - CEDULA S.A.',
  '233 - CIFRA S.A.',
  '745 - CITIBANK',
  '477 - Citibank N.A.',
  '090 - COOPERATIVA CENTRAL DE CREDITO DO ESTADO DE SP',
  '097 - COOPERATIVA CENTRAL DE CREDITO NOROESTE BRASILEIRO',
  '089 - COOPERATIVA DE CREDITO RURAL DA REGIAO DA MOGIANA',
  '075 - CR2 S.A',
  '098 - CREDIALIANCA COOPERATIVA DE CREDITO RURAL',
  '222 - CREDIT AGRICOLE BRASIL S.A.',
  '505 - CREDIT SUISSE (BRASIL) S.A.',
  '707 - DAYCOVAL',
  '487 - DEUTSCHE BANK S. A. - BANCO ALEMAO',
  '214 - DIBENS S.A.',
  '265 - FATOR S.A.',
  '224 - FIBRA',
  '626 - FICSA S.A.',
  '121 - GERADOR S.A.',
  '612 - GUANABARA S.A.',
  '062 - HIPERCARD BANCO MULTIPLO S.A',
  '399 - HSBC',
  '063 - IBI',
  '604 - INDUSTRIAL DO BRASIL S. A.',
  '653 - INDUSVAL S.A.',
  '492 - ING BANK N.V.',
  '630 - INTERCAP S.A.',
  '077 - INTERMEDIUM S.A.',
  '249 - Investcred Unibanco',
  '341 - ITAÚ',
  '652 - ITAU HOLDING FINANCEIRA S.A',
  '184 - Itaú-BBA',
  '074 - J. SAFRA S.A.',
  '376 - J.P. MORGAN S.A.',
  '217 - JOHN DEERE S.A.',
  '488 - JPMORGAN CHASE BANK',
  '076 - KDB DO BRASIL S.A',
  '757 - KEB DO BRASIL S.A.',
  '600 - Luso Brasileiro',
  '243 - MAXIMA S.A.',
  '389 - MERCANTIL DO BRASIL',
  '746 - MODAL S.A.',
  '066 - MORGAN STANLEY DEAN WITTER S.A',
  '014 - NATIXIS BRASIL S.A. - BANCO MòLTIPLO',
  '753 - NBC BANK BRASIL S.A.- BANCO MULTIPLO',
  '045 - OPPORTUNITY S.A.',
  '079 - ORIGINAL DO AGRONEGOCIO S.A.',
  '212 - ORIGINAL S.A.',
  '623 - PANAMERICANO',
  '254 - PARANA BANCO S.A.',
  '611 - PAULISTA',
  '613 - PECUNIA S.A.',
  '094 - PETRA S.A.',
  '643 - PINE S.A.',
  '735 - POTTENCIAL S.A.',
  '747 - RABOBANK INTERNATIONAL BRASIL S.A.',
  '088 - RANDON S.A.',
  '633 - RENDIMENTO S.A.',
  '741 - RIBEIRÃO PRETO',
  '120 - RODOBENS S.A',
  '453 - RURAL',
  '072 - RURAL MAIS S.A',
  '422 - SAFRA',
  '751 - SCOTIABANK BRASIL S.A BANCO MULTIPLO',
  '743 - SEMEAR S.A.',
  '748 - SICREDI',
  '749 - SIMPLES S.A.',
  '366 - SOCIETE GENERALE BRASIL S.A',
  '637 - SOFISA S.A.',
  '464 - SUMITOMO MITSUI BRASILEIRO S.A.',
  '082 - TOPAZIO S.A.',
  '634 - Triangulo',
  '230 - UNICARD BANCO MULTIPLO S.A',
  '091 - UNICRED CENTRAL RS - CENTRAL DE COOP ECON CRED MUT',
  '087 - UNICRED CENTRAL SANTA CATARINA',
  '099 - UNIPRIME CENTRAL - CENTRAL INT DE COOP DE CRED LTD',
  '655 - VOTORANTIM',
  '610 - VR S.A.',
  '119 - WESTERN UNION DO BRASIL S.A.',
  '124 - WOORI BANK DO BRASIL S.A',
]

type SaqueData = {
  tipo: string
  chave: string
  banco: string
  criadoEm: string
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarCpf(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  const parte1 = numeros.slice(0, 3)
  const parte2 = numeros.slice(3, 6)
  const parte3 = numeros.slice(6, 9)
  const parte4 = numeros.slice(9, 11)
  if (numeros.length <= 3) return parte1
  if (numeros.length <= 6) return `${parte1}.${parte2}`
  if (numeros.length <= 9) return `${parte1}.${parte2}.${parte3}`
  return `${parte1}.${parte2}.${parte3}-${parte4}`
}

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  const ddd = numeros.slice(0, 2)
  const parte1 = numeros.slice(2, numeros.length > 10 ? 7 : 6)
  const parte2 = numeros.slice(numeros.length > 10 ? 7 : 6, 11)
  if (numeros.length <= 2) return `(${ddd}`
  if (numeros.length <= 6) return `(${ddd}) ${parte1}`
  return `(${ddd}) ${parte1}-${parte2}`
}

function normalizarTexto(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function ContaSaque() {
  const navigate = useNavigate()
  const { user, loan } = useBancredSession()
  const [tipo, setTipo] = useState('cpf')
  const [chave, setChave] = useState('')
  const [banco, setBanco] = useState('')
  const [mostrarBancos, setMostrarBancos] = useState(false)

  const opcaoSelecionada = opcoes.find((opcao) => opcao.value === tipo) || opcoes[0]
  const valorDisponivel = loan?.valorDesejado ?? 0
  const cpfUsuario = user?.cpf || user?.CPF || ''

  useEffect(() => {
    if (tipo === 'cpf') {
      setChave(formatarCpf(cpfUsuario))
      return
    }
    setChave('')
  }, [cpfUsuario, tipo])

  function handleChave(valor: string) {
    if (tipo === 'cpf') {
      setChave(formatarCpf(valor))
      return
    }
    if (tipo === 'telefone') {
      setChave(formatarTelefone(valor))
      return
    }
    setChave(valor)
  }

  const bancosFiltrados = useMemo(() => {
    if (!bancosDisponiveis.length) return []
    const termo = normalizarTexto(banco.trim())
    if (!termo) return bancosDisponiveis
    return bancosDisponiveis.filter((nome) => normalizarTexto(nome).includes(termo))
  }, [banco])

  function handleSelecionarBanco(nome: string) {
    setBanco(nome)
    setMostrarBancos(false)
  }

  function handleSacar() {
    const payload: SaqueData = {
      tipo,
      chave,
      banco,
      criadoEm: new Date().toISOString(),
    }
    window.sessionStorage.setItem('saqueData', JSON.stringify(payload))
    navigate('/conta/saque/confirmar')
  }

  const inputMode = tipo === 'email' ? 'email' : tipo === 'aleatoria' ? 'text' : 'numeric'
  const placeholder =
    tipo === 'cpf'
      ? '000.000.000-00'
      : tipo === 'telefone'
        ? '(00) 00000-0000'
        : tipo === 'email'
          ? 'seu@email.com'
          : 'Digite a chave aleatória'

  return (
    <div className="conta-saque-page">
      <div className="conta-saque-topo" />
      <div className="conta-saque-container">
        <div className="conta-saque-card">
          <span>Você está sacando</span>
          <strong>{valorDisponivel ? formatarMoeda(valorDisponivel) : ''}</strong>
          <div className="conta-saque-status">
            <span className="conta-saque-dot" />
            <span>Valor total do empréstimo aprovado</span>
          </div>
        </div>
        <div className="conta-saque-card">
          <h3>Tipo de chave PIX</h3>
          <div className="conta-saque-opcoes">
            {opcoes.map((opcao) => (
              <label key={opcao.value} className="conta-saque-radio">
                <input type="radio" name="pix" value={opcao.value} checked={tipo === opcao.value} onChange={() => setTipo(opcao.value)} />
                <span>{opcao.label}</span>
              </label>
            ))}
          </div>
          <div className="conta-saque-campo">
            <label>{opcaoSelecionada.placeholder}</label>
            <input className="conta-saque-input" value={chave} onChange={(event) => handleChave(event.target.value)} inputMode={inputMode} placeholder={placeholder} />
          </div>
        </div>
        <div className="conta-saque-card">
          <h3>Qual é o seu banco?</h3>
          <input
            className="conta-saque-input"
            placeholder="Digite o nome do seu banco"
            value={banco}
            onChange={(event) => {
              setBanco(event.target.value)
              setMostrarBancos(true)
            }}
            onFocus={() => setMostrarBancos(true)}
            onBlur={() => {
              setTimeout(() => setMostrarBancos(false), 150)
            }}
          />
          {mostrarBancos && (
            <div className="conta-saque-dropdown">
              {bancosFiltrados.length === 0 && <div className="conta-saque-dropdown__info">Nenhum banco encontrado.</div>}
              {bancosFiltrados.map((nome) => (
                <button key={nome} type="button" className="conta-saque-dropdown__item" onMouseDown={() => handleSelecionarBanco(nome)}>
                  {nome}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="conta-saque-botao" type="button" onClick={handleSacar}>
          {valorDisponivel ? `Sacar ${formatarMoeda(valorDisponivel)}` : 'Sacar'}
        </button>
      </div>
    </div>
  )
}
