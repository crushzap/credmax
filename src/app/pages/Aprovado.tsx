import { useNavigate } from 'react-router-dom'
import { useBancredSession } from '../hooks/useBancredSession'

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function Aprovado() {
  const navigate = useNavigate()
  const { user, loan } = useBancredSession()

  const valorLiberado = loan?.valorLiberado ?? loan?.valorDesejado ?? 0
  const parcelas = loan?.parcelas ?? 0
  const parcelaMensal = loan?.parcelaMensal ?? 0
  
  // Se não tiver data definida, assume hoje + 30 dias ou mantém lógica anterior
  const primeiraParcela = loan?.primeiraParcela ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')

  // Extrai o primeiro nome para exibir
  const primeiroNome = user?.nome ? user.nome.split(' ')[0] : 'Cliente'

  return (
    <div className="aprovado-page">
      <div className="aprovado-card">
        <div className="aprovado-icone">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h2>Parabéns, {primeiroNome}!</h2>
        <p className="aprovado-subtitulo">Empréstimo APROVADO!</p>
        <p className="aprovado-nota">O valor já está reservado para você.</p>
        <div className="aprovado-valor">
          <span>Valor liberado</span>
          <strong>{formatarMoeda(valorLiberado)}</strong>
          <small>Recebimento via PIX</small>
        </div>
        <div className="aprovado-dados">
          <div className="aprovado-dado">
            <span>Parcela mensal</span>
            <strong>{formatarMoeda(parcelaMensal)}</strong>
          </div>
          <div className="aprovado-dado">
            <span>Parcelas</span>
            <strong>{parcelas}x</strong>
          </div>
        </div>
        <div className="aprovado-primeira">
          <div className="aprovado-primeira__titulo">Primeira parcela</div>
          <strong>{primeiraParcela}</strong>
          <span>90 dias para começar a pagar!</span>
        </div>
        <div className="aprovado-passos">
          <div className="aprovado-passos__titulo">Próximos Passos</div>
          <ul>
            <li>Finalize seu cadastro na plataforma</li>
            <li>Informe endereço para receber carnê pelos Correios</li>
            <li>O valor será transferido para você via Pix</li>
          </ul>
        </div>
        <button className="aprovado-botao" type="button" onClick={() => navigate('/endereco')}>
          Finalizar Cadastro
        </button>
        <p className="aprovado-rodape">Complete seu cadastro para acessar sua conta</p>
      </div>
    </div>
  )
}
