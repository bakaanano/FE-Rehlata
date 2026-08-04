import { forwardRef } from 'react'

const Button = forwardRef(function Button(
  { as: Component = 'button', className = '', variant = 'primary', children, ...props },
  ref,
) {
  return (
    <Component ref={ref} className={`btn btn--${variant} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
})

export default Button