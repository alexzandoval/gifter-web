import { forwardRef } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

export const renderLink = (to: string) =>
  forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
    <RouterLink to={to} ref={ref} {...itemProps} />
  ))
