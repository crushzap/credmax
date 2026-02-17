import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBancredSession } from '../hooks/useBancredSession'

type CheckoutData = {
  seguro?: number
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function ContaCheckout() {
  const navigate = useNavigate()
  const { user } = useBancredSession()
  const checkout = useMemo<CheckoutData | null>(() => {
    const bruto = window.sessionStorage.getItem('checkoutData')
    if (!bruto) return null
    try {
      return JSON.parse(bruto) as CheckoutData
    } catch {
      return null
    }
  }, [])

  const seguro = checkout?.seguro ?? 19
  const [ofertaEspecial, setOfertaEspecial] = useState(true)
  const [gerandoPix, setGerandoPix] = useState(false)
  const [erroPix, setErroPix] = useState('')
  const ofertaEspecialValor = 9
  const total = seguro + (ofertaEspecial ? ofertaEspecialValor : 0)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const apiUrlBase = isLocal ? '/api' : apiBaseUrl
  const callbackBase = apiUrlBase && !apiUrlBase.startsWith('/') ? apiUrlBase.replace(/\/api\/?$/, '') : ''

  async function handleGerarPix() {
    console.log('Gerar PIX: iniciando', {
      apiUrlBase,
      total,
      ofertaEspecial,
    })
    if (!apiUrlBase) {
      console.error('Gerar PIX: VITE_API_BASE_URL não configurada')
      setErroPix('Não foi possível gerar o PIX agora.')
      return
    }
    const nome = (user?.nome || user?.NOME || '').toString().trim() || 'Cliente'
    const documento = (user?.cpf || user?.CPF || '').toString().replace(/\D/g, '')
    const emailBase = (user?.email || '').toString().trim()
    const email = emailBase || (documento ? `cliente+${documento}@credmax.com` : '')
    if (!nome || !email || !documento) {
      setErroPix('Complete seus dados para gerar o PIX.')
      return
    }
    const amountEnvio = Math.trunc(total)
    setGerandoPix(true)
    setErroPix('')
    let url = ''
    try {
      url = `${apiUrlBase}/pix/drakepay`
      console.log('Gerar PIX: enviando payload')
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountEnvio,
          external_id: `pedido_${Date.now()}`,
          clientCallbackUrl: callbackBase ? `${callbackBase}/api/pix/drakepay/webhook` : undefined,
          payer: {
            name: nome,
            email,
            document: documento,
          },
        }),
      })
      console.log('Gerar PIX: resposta recebida', {
        ok: response.ok,
        status: response.status,
        url,
      })
      const texto = await response.text()
      console.log('Gerar PIX: resposta bruta', texto)
      const resposta = texto ? JSON.parse(texto) : null
      const payload = resposta?.data ?? resposta
      const id = payload?.transactionId ?? payload?.transaction_id ?? payload?.id
      const qrCodeBase64 = payload?.qrCodeBase64 ?? payload?.qr_code_base64
      const copiaECola = payload?.qrcode ?? payload?.qrCode ?? payload?.qr_code
      const expiracao = payload?.expiresAt ?? payload?.date_of_expiration
      const totalPago = payload?.amount ?? payload?.valor ?? amountEnvio
      if (!id || !copiaECola) {
        console.error('Gerar PIX: resposta inválida', payload)
        setErroPix('Não foi possível gerar o PIX agora.')
        setGerandoPix(false)
        return
      }
      window.sessionStorage.setItem(
        `pixData:${id}`,
        JSON.stringify({
          id,
          total: totalPago,
          copiaECola,
          qrCodeBase64,
          expiracao,
        })
      )
      console.log('Gerar PIX: sucesso', { id })
      navigate(`/conta/checkout/pix/${id}`)
    } catch (erro) {
      console.error('Gerar PIX: erro na requisição', {
        erro,
        url,
        online: navigator.onLine,
      })
      setErroPix('Não foi possível gerar o PIX agora.')
    } finally {
      setGerandoPix(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-topo">
        <div className="checkout-topo__marca">
          <span className="checkout-topo__icone">$</span>
          <span>CredMax</span>
        </div>
        <div className="checkout-topo__seguro">
          <span className="checkout-topo__ponto" />
          Ambiente Seguro
        </div>
      </div>
      <div className="checkout-alerta">Finalize seu pedido quanto antes!</div>
      <div className="checkout-container">
        <div className="checkout-card checkout-card--produto">
          <div className="checkout-produto">
            <div className="checkout-produto__icone">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5c-3.5 0-6.5 2.7-6.5 6v3.7c0 3.8 2.5 7.2 6.1 8.4l.4.1.4-.1c3.6-1.2 6.1-4.6 6.1-8.4V8.5c0-3.3-3-6-6.5-6zm4 9.5c0 2.8-1.8 5.3-4 6.3-2.2-1-4-3.5-4-6.3V8.6c0-2 1.8-3.6 4-3.6s4 1.6 4 3.6V12zm-4.8 2.2 3.4-3.4 1.2 1.2-4.6 4.6-2.6-2.6 1.2-1.2 1.4 1.4z"></path>
              </svg>
            </div>
            <div>
              <strong>Seguro Prestamista 1</strong>
              <div className="checkout-produto__sub">Proteção financeira</div>
            </div>
          </div>
          <div className="checkout-produto__preco">{formatarMoeda(seguro)}</div>
          <div className="checkout-resumo">
            <div>
              <span>Seguro Prestamista 1</span>
              <strong>{formatarMoeda(seguro)}</strong>
            </div>
            {ofertaEspecial && (
              <div>
                <span>Suporte VIP Exclusivo</span>
                <strong>{formatarMoeda(ofertaEspecialValor)}</strong>
              </div>
            )}
            <div className="checkout-resumo__total">
              <span>Total:</span>
              <strong>{formatarMoeda(total)}</strong>
            </div>
          </div>
        </div>
        <div
          className={ofertaEspecial ? 'checkout-card checkout-card--oferta checkout-card--oferta-ativa' : 'checkout-card checkout-card--oferta'}
          onClick={() => setOfertaEspecial((atual) => !atual)}
        >
          <div className="checkout-oferta__cabecalho">
            <span className="checkout-oferta__check">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.55 17.2 4.9 12.5l1.4-1.4 3.25 3.3 8.2-8.2 1.4 1.4-9.6 9.6z"></path>
              </svg>
            </span>
            <div className="checkout-oferta__tag">Oferta especial</div>
          </div>
          <div className="checkout-oferta__valor">
            <span>R$ 99,00</span>
            <strong>R$ 9,00</strong>
          </div>
          <ul className="checkout-oferta__lista">
            <li>Suporte VIP Exclusivo</li>
            <li>Atendimento prioritário</li>
            <li>WhatsApp com gerente</li>
            <li>Suporte 24/7</li>
            <li>Oferta limitada!</li>
          </ul>
        </div>
        <div className="checkout-card checkout-card--pix">
          <div className="checkout-pix">
            <span className="checkout-pix__icone">
              <svg viewBox="0 0 512 512" fill="currentColor">
                <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.8C231.1-7.6 280.3-7.6 310.6 22.8L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.78L22.76 310.6C-7.586 280.3-7.586 231.1 22.76 200.8L80.78 142.7H112.6z"></path>
              </svg>
            </span>
            <div>
              <strong>Pague com PIX em segundos</strong>
              <div className="checkout-pix__sub">Rápido, seguro e sem taxas adicionais</div>
            </div>
          </div>
          <button className="checkout-pix__botao" type="button" onClick={handleGerarPix} disabled={gerandoPix}>
            {gerandoPix ? 'Gerando PIX...' : 'Gerar PIX'}
          </button>
          {erroPix ? <div className="checkout-pix__erro">{erroPix}</div> : null}
        </div>
        <div className="checkout-card checkout-card--avaliacoes">
          <div className="checkout-card__titulo">Clientes Satisfeitos</div>
          <div className="checkout-avaliacao">
            <div className="checkout-avaliacao__estrela">★★★★★</div>
            <div className="checkout-avaliacao__nome">Maria Silva</div>
            <div>“Paguei e caiu em 7 minutos. É real!”</div>
          </div>
          <div className="checkout-avaliacao">
            <div className="checkout-avaliacao__estrela">★★★★★</div>
            <div className="checkout-avaliacao__nome">Roberto Lima</div>
            <div>“Excelente atendimento. Só acreditei quando vi o Pix. Vale a pena!”</div>
          </div>
          <div className="checkout-avaliacao">
            <div className="checkout-avaliacao__estrela">★★★★★</div>
            <div className="checkout-avaliacao__nome">Amanda Ferreira</div>
            <div>“Estava atolada em dívida e sem saída. Consegui resolver tudo aqui.”</div>
          </div>
        </div>
        <div className="checkout-rodape">© 2026 CredMax LTDA. Todos os direitos reservados.</div>
      </div>
    </div>
  )
}
