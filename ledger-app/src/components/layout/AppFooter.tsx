import { Container } from './Container'

export function AppFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] py-6">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[12px] text-[#3D4860]">
          © 2026 Ledger. Powered by IBM Granite.
        </span>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {['Privacy', 'Terms', 'Security', 'Docs'].map((label) => (
            <button
              key={label}
              className="text-[12px] text-[#3D4860] hover:text-[#616E85] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </Container>
    </footer>
  )
}
