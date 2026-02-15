import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

type PixData = {
  id: string
  total: number
  copiaECola: string
  qrCodeBase64?: string
  expiracao?: string
}

function formatarMoeda(valor: number) {
  const valorReais = valor / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(valorReais)
}

function calcularTempoRestante(expiracao?: string) {
  if (!expiracao) return ''
  const dataExpiracao = new Date(expiracao).getTime()
  const agora = Date.now()
  const diferenca = Math.max(dataExpiracao - agora, 0)
  const minutos = Math.floor(diferenca / 60000)
  const segundos = Math.floor((diferenca % 60000) / 1000)
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

export default function ContaCheckoutPix() {
  const { id } = useParams()
  const [dados, setDados] = useState<PixData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tempo, setTempo] = useState('')
  const [copiado, setCopiado] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const apiUrlBase = isLocal ? '/api' : apiBaseUrl
  const expiracaoPadrao = useMemo(() => new Date(Date.now() + 15 * 60 * 1000).toISOString(), [id])

  const cache = useMemo(() => {
    if (!id) return null
    const bruto = window.sessionStorage.getItem(`pixData:${id}`)
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as PixData
    } catch {
      return null
    }
  }, [id])

  useEffect(() => {
    if (!id) {
      setErro('PIX não encontrado.')
      setCarregando(false)
      return
    }
    if (cache) {
      setDados({
        ...cache,
        expiracao: expiracaoPadrao,
      })
      setCarregando(false)
    }
    if (!apiUrlBase) {
      if (!cache) {
        setErro('PIX não encontrado.')
        setCarregando(false)
      }
      return
    }
    const buscar = async () => {
      try {
        const response = await fetch(`${apiUrlBase}/pix/drakepay/${id}`)
        const resposta = await response.json()
        const payload = resposta?.data ?? resposta
        const qrCodeBase64 = payload?.qrCodeBase64 ?? payload?.qr_code_base64
        const copiaECola = payload?.qrcode ?? payload?.qrCode ?? payload?.qr_code ?? payload?.copiaECola
        const total = payload?.amount ?? payload?.valor ?? payload?.total ?? cache?.total ?? 0
        const expiracao = expiracaoPadrao
        if (!copiaECola) {
          if (!cache) setErro('PIX não encontrado.')
          return
        }
        const atualizado: PixData = {
          id,
          total,
          copiaECola,
          qrCodeBase64,
          expiracao,
        }
        setDados(atualizado)
        window.sessionStorage.setItem(`pixData:${id}`, JSON.stringify(atualizado))
      } catch {
        if (!cache) setErro('PIX não encontrado.')
      } finally {
        setCarregando(false)
      }
    }
    buscar()
  }, [apiBaseUrl, cache, id])

  useEffect(() => {
    if (!dados?.expiracao) return
    const atualizar = () => {
      setTempo(calcularTempoRestante(dados.expiracao))
    }
    atualizar()
    const timer = window.setInterval(atualizar, 1000)
    return () => window.clearInterval(timer)
  }, [dados?.expiracao])

  async function handleCopiar() {
    if (!dados?.copiaECola) return
    await navigator.clipboard.writeText(dados.copiaECola)
    setCopiado(true)
    window.setTimeout(() => setCopiado(false), 2000)
  }

  const qrCodeUrl = dados?.copiaECola
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(dados.copiaECola)}`
    : ''

  return (
    <div className="pix-page">
      <div className="pix-topo">
        <div className="pix-topo__marca">
          <span className="pix-topo__icone">$</span>
          <span>CredMax</span>
        </div>
      </div>
      <div className="pix-container">
        <div className="pix-card">
          <div className="pix-card__cabecalho">
            <div>
              <div className="pix-card__label">Pague com PIX</div>
              <div className="pix-card__valor">{formatarMoeda(dados?.total ?? 0)}</div>
            </div>
            {tempo ? (
              <div className="pix-card__expira">
                <span>Expira em</span>
                <strong>{tempo}</strong>
              </div>
            ) : null}
          </div>
          {carregando ? <div className="pix-carregando">Carregando PIX...</div> : null}
          {!carregando && erro ? <div className="pix-erro">{erro}</div> : null}
          {!carregando && dados ? (
            <>
              {dados.qrCodeBase64 ? (
                <div className="pix-qr">
                  <img src={`data:image/png;base64,${dados.qrCodeBase64}`} alt="QR Code PIX" />
                </div>
              ) : qrCodeUrl ? (
                <div className="pix-qr">
                  <img src={qrCodeUrl} alt="QR Code PIX" />
                </div>
              ) : null}
              <div className="pix-copia">
                <label>Copie o código PIX abaixo:</label>
                <input value={dados.copiaECola} readOnly />
                <button type="button" onClick={handleCopiar} className={copiado ? 'pix-copia__botao pix-copia__botao--copiado' : 'pix-copia__botao'}>
                  {copiado ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>
              <div className="pix-status">
                <span>Aguardando pagamento...</span>
                <span>O PIX será reconhecido automaticamente</span>
              </div>
              <div className="pix-passos">
                <h4>Como pagar:</h4>
                <ul>
                  <li>Abra o app do seu banco</li>
                  <li>Selecione “PIX Copia e Cola”</li>
                  <li>Cole o código e confirme o pagamento</li>
                  <li>Empréstimo liberado automaticamente</li>
                </ul>
              </div>
            </>
          ) : null}
        </div>
        <div className="pix-selos">
          <span className="pix-selos__item">
            <img className="pix-selos__logo" src="/pix-106.svg" alt="PIX" />
          </span>
          <span className="pix-selos__item">
            <span className="pix-selos__icone">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 4 5v6c0 5.1 3.6 9.6 8 11 4.4-1.4 8-5.9 8-11V5l-8-3zm0 18.2c-3.2-1.3-6-4.9-6-9.2V6.3l6-2.2 6 2.2V11c0 4.3-2.8 7.9-6 9.2zm-1-5.7 5-5 1.4 1.4L11 17l-3.4-3.4 1.4-1.4 2 2z" />
              </svg>
            </span>
            <span>Ambiente Seguro</span>
          </span>
          <span className="pix-selos__item">
            <span className="pix-selos__icone pix-selos__icone--ssl">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7-2a2 2 0 1 1 4 0v2h-4V7zm7 11H7v-7h10v7z" />
              </svg>
            </span>
            <span>256-bit SSL</span>
          </span>
        </div>
      </div>
    </div>
  )
}
