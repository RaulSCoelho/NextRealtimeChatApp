import { Spinner, tv } from '@nextui-org/react'

const spinner = tv({
  base: 'fixed inset-0 z-[9999]'
})

export default function Loading({ children, className, ...rest }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={spinner({ className })} {...rest}>
      <div className="flex h-full items-center justify-center bg-foreground/50">
        <Spinner classNames={{ wrapper: 'h-10 w-10' }} />
        {children}
      </div>
    </div>
  )
}
