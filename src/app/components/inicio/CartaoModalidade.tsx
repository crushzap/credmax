import type { ReactNode } from 'react'

type CartaoModalidadeProps = {
  destaque?: string
  titulo: string
  descricao: string
  extra: string
  faixa: string
  icone: ReactNode
  onSimular: () => void
  testId: string
}

export default function CartaoModalidade({
  destaque,
  titulo,
  descricao,
  extra,
  faixa,
  icone,
  onSimular,
  testId,
}: CartaoModalidadeProps) {
  return (
    <div className={`modalidade-card ${destaque ? 'modalidade-card--destaque' : ''}`}>
      {destaque ? <div className="modalidade-card__badge">{destaque}</div> : null}
      <div className="modalidade-card__conteudo">
        <div className="modalidade-card__icone">{icone}</div>
        <h3 className="modalidade-card__titulo">{titulo}</h3>
        <p className="modalidade-card__descricao">{descricao}</p>
        <div className="modalidade-card__extra">{extra}</div>
        <p className="modalidade-card__faixa-label">De R$250,00 até</p>
        <p className="modalidade-card__faixa-valor">{faixa}</p>
        <button className="botao-gradiente botao-gradiente--full" type="button" onClick={onSimular} data-testid={testId}>
          Simular Grátis
        </button>
      </div>
    </div>
  )
}
