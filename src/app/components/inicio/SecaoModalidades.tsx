import { useNavigate } from 'react-router-dom'
import CartaoModalidade from './CartaoModalidade'

const modalidades = [
  {
    id: 'negativados',
    destaque: 'MAIS PROCURADO',
    titulo: 'Para Negativados',
    descricao: 'CPF com restrições no Serasa/SPC',
    extra: '1ª parcela em 90 dias',
    faixa: 'R$ 4.500',
    teto: 4500,
    testId: 'button-simulate-negativados',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="17" x2="22" y1="8" y2="13" />
        <line x1="22" x2="17" y1="8" y2="13" />
      </svg>
    ),
  },
  {
    id: 'pessoa-fisica',
    titulo: 'Pessoa Física',
    descricao: 'CPF sem restrições, tire planos do papel',
    extra: '1ª parcela em 90 dias',
    faixa: 'R$ 10.000',
    teto: 10000,
    testId: 'button-simulate-pf',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'pessoa-juridica',
    titulo: 'Pessoa Jurídica',
    descricao: 'Capital de giro para sua empresa crescer',
    extra: '1ª parcela em 120 dias',
    faixa: 'R$ 25.000',
    teto: 25000,
    testId: 'button-simulate-pj',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
      </svg>
    ),
  },
]

export default function SecaoModalidades() {
  const navigate = useNavigate()

  return (
    <section className="inicio-secao">
      <div className="inicio-container">
        <div className="inicio-secao__cabecalho">
          <div className="inicio-secao__tag">
            <span className="inicio-secao__tag-dot" />
            <span>Modalidades</span>
          </div>
          <h2>Escolha sua opção de empréstimo</h2>
          <p>Soluções personalizadas para cada situação financeira</p>
        </div>
        <div className="modalidades-grid">
          {modalidades.map((modalidade) => (
            <CartaoModalidade
              key={modalidade.titulo}
              destaque={modalidade.destaque}
              titulo={modalidade.titulo}
              descricao={modalidade.descricao}
              extra={modalidade.extra}
              faixa={modalidade.faixa}
              icone={modalidade.icone}
              onSimular={() => {
                window.sessionStorage.setItem(
                  'modalidadeSelecionada',
                  JSON.stringify({ id: modalidade.id, titulo: modalidade.titulo, teto: modalidade.teto }),
                )
                navigate('/cpf')
              }}
              testId={modalidade.testId}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
