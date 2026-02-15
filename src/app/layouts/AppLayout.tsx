import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const fullScreenPages = [
    '/configurando-conta',
    '/conta',
    '/conta/saque',
    '/conta/saque/confirmar',
    '/conta/saque/seguro-prestamista',
    '/conta/saque/finalizar',
    '/conta/checkout',
  ]
  const isFullScreen = fullScreenPages.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))
  return (
    <div className={isFullScreen ? 'app app--full' : 'app'}>
      <header className={isFullScreen ? 'app-header app-header--hidden' : 'app-header'}>
        <div className="brand">
          <div className="brand-icon">$</div>
          <span>CredMax</span>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
