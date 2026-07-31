import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * hero   → large py for landing-page hero sections   (py-20 md:py-28)
   * loose  → standard marketing section spacing         (py-16 md:py-24)  ← default
   * normal → inner-page content section spacing         (py-10 md:py-16)
   * tight  → compact spacing for densely content pages  (py-6  md:py-10)
   */
  variant?: 'hero' | 'loose' | 'normal' | 'tight'
  /** @deprecated use variant="tight" */
  tight?: boolean
  className?: string
  children: React.ReactNode
}

const variants = {
  hero:   'py-20 md:py-28',
  loose:  'py-16 md:py-24',
  normal: 'py-10 md:py-16',
  tight:  'py-6  md:py-10',
}

export function Section({ variant, tight = false, className, children, ...props }: SectionProps) {
  // Back-compat: tight prop maps to tight variant
  const resolved = variant ?? (tight ? 'tight' : 'loose')

  return (
    <section
      className={cn(variants[resolved], className)}
      {...props}
    >
      {children}
    </section>
  )
}
