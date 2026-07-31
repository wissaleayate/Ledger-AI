import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * full   → max-w 1280px  (default, most pages)
   * wide   → max-w 1440px  (workspace 3-col layout)
   * prose  → max-w 780px   (document-style: exec report, how-it-works)
   */
  size?: 'full' | 'wide' | 'prose'
  className?: string
  children: React.ReactNode
}

export function Container({ size = 'full', className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'full'  && 'max-w-[var(--layout-max-w)]',
        size === 'wide'  && 'max-w-[var(--layout-max-w-wide)]',
        size === 'prose' && 'max-w-[var(--layout-max-w-prose)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
