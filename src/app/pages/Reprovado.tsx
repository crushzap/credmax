import { useNavigate } from 'react-router-dom'

export default function Reprovado() {
  const navigate = useNavigate()

  return (
    <div className="aprovado-page">
      <div className="aprovado-card">
        <div className="aprovado-icone">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6" />
            <path d="M9 9l6 6" />
          </svg>
        </div>
        <h2>Não foi aprovado</h2>
        <p className="aprovado-subtitulo">Empréstimo REPROVADO</p>
        <p className="aprovado-nota">No momento não foi possível liberar o crédito.</p>
        <div className="aprovado-primeira">
          <div className="aprovado-primeira__titulo">Tente novamente</div>
          <strong>Em 30 dias</strong>
          <span>Atualize seus dados e refaça a simulação.</span>
        </div>
        <button className="aprovado-botao" type="button" onClick={() => navigate('/inicio')}>
          Voltar ao início
        </button>
        <p className="aprovado-rodape">Obrigado por escolher a CredMax</p>
      </div>
    </div>
  )
}
