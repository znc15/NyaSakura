'use client'

import type { ComponentPropsWithoutRef } from 'react'

type Props = {
  isDark: boolean
  onToggle: () => void
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick' | 'aria-label' | 'aria-pressed'>

export function ThemeToggleButton({ isDark, onToggle, className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label="主题切换"
      aria-pressed={isDark}
      onClick={onToggle}
      data-mode={isDark ? 'dark' : 'light'}
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className="theme-toggle__backdrops" aria-hidden="true">
        <span className="theme-toggle__backdrop" />
        <span className="theme-toggle__backdrop" />
        <span className="theme-toggle__backdrop" />
      </span>

      <span className="theme-toggle__clouds" aria-hidden="true">
        <span className="theme-toggle__cloud theme-toggle__cloud--1" />
        <span className="theme-toggle__cloud theme-toggle__cloud--2" />
        <span className="theme-toggle__cloud theme-toggle__cloud--3" />
        <span className="theme-toggle__cloud theme-toggle__cloud--4" />
        <span className="theme-toggle__cloud theme-toggle__cloud--5" />
        <span className="theme-toggle__cloud theme-toggle__cloud--6" />
      </span>

      <span className="theme-toggle__stars" aria-hidden="true">
        <span className="theme-toggle__star theme-toggle__star--1" />
        <span className="theme-toggle__star theme-toggle__star--2" />
        <span className="theme-toggle__star theme-toggle__star--3" />
        <span className="theme-toggle__star theme-toggle__star--4" />
        <span className="theme-toggle__star theme-toggle__star--5" />
        <span className="theme-toggle__star theme-toggle__star--6" />
      </span>

      <span className="theme-toggle__thumb" aria-hidden="true">
        <span className="theme-toggle__crater theme-toggle__crater--1" />
        <span className="theme-toggle__crater theme-toggle__crater--2" />
        <span className="theme-toggle__crater theme-toggle__crater--3" />
      </span>
    </button>
  )
}
