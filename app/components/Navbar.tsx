'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import '../styles/navbar.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [useDrawer, setUseDrawer] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const navInnerRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let rafId = 0
    let latestY = 0

    const apply = () => {
      rafId = 0
      const el = backgroundRef.current
      if (!el) return

      const y = latestY
      // 0 -> 120px 区间内无级变化到目标值
      const t = Math.max(0, Math.min(1, y / 120))
      const blur = (t * 10).toFixed(2)
      const alpha = (t * 0.7).toFixed(3)

      el.style.setProperty('--nav-blur', `${blur}px`)
      el.style.setProperty('--nav-bg-alpha', `${alpha}`)

      // 用于可选的样式/逻辑（例如阴影）
      setScrolled(y > 20)
    }

    const onScroll = () => {
      latestY = window.scrollY || 0
      if (rafId) return
      rafId = window.requestAnimationFrame(apply)
    }

    // 初始同步一次
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  const navLinks = useMemo(
    () => (
      <>
        {process.env.NEXT_PUBLIC_NAV_SHOW_HOME !== 'false' && (
          <Link
            href={process.env.NEXT_PUBLIC_NAV_HOME_URL || '/'}
            className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {process.env.NEXT_PUBLIC_NAV_HOME || '首页'}
          </Link>
        )}
        {process.env.NEXT_PUBLIC_NAV_SHOW_MAP !== 'false' && (
          <Link
            href={process.env.NEXT_PUBLIC_NAV_MAP_URL || 'https://map.nyasakura.fun'}
            className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {process.env.NEXT_PUBLIC_NAV_MAP || '服务器地图'}
          </Link>
        )}
        {process.env.NEXT_PUBLIC_NAV_SHOW_METRO !== 'false' && (
          <Link
            href={process.env.NEXT_PUBLIC_NAV_METRO_URL || 'https://metro.nyasakura.fun'}
            className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {process.env.NEXT_PUBLIC_NAV_METRO || '服务器地铁'}
          </Link>
        )}
        {process.env.NEXT_PUBLIC_NAV_SHOW_WIKI !== 'false' && (
          <Link
            href={process.env.NEXT_PUBLIC_WIKI_URL || 'https://wiki.nyasakura.fun'}
            className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {process.env.NEXT_PUBLIC_NAV_WIKI || '服务器Wiki'}
          </Link>
        )}
        {process.env.NEXT_PUBLIC_NAV_SHOW_DONATE !== 'false' && (
          <Link
            href={process.env.NEXT_PUBLIC_NAV_DONATE_URL || '/donate'}
            className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {process.env.NEXT_PUBLIC_NAV_DONATE || '服务器捐赠名单'}
          </Link>
        )}
      </>
    ),
    []
  )

  const recomputeDrawer = useCallback(() => {
    const navInner = navInnerRef.current
    const logo = logoRef.current
    const measure = measureRef.current
    if (!navInner || !logo || !measure) return

    const navInnerWidth = navInner.getBoundingClientRect().width
    const logoWidth = logo.getBoundingClientRect().width
    const requiredLinksWidth = measure.scrollWidth

    // 为右侧汉堡按钮与间距预留空间（基于实际 UI 尺寸，避免断点）
    const reserved = 56 /* button */ + 12 /* gap */
    const available = Math.max(0, navInnerWidth - logoWidth - reserved)

    const shouldUseDrawer = requiredLinksWidth > available + 1
    setUseDrawer(shouldUseDrawer)
    if (!shouldUseDrawer) setDrawerOpen(false)
  }, [])

  useEffect(() => {
    recomputeDrawer()
    const handleResize = () => recomputeDrawer()
    window.addEventListener('resize', handleResize)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => recomputeDrawer())
      if (navInnerRef.current) ro.observe(navInnerRef.current)
      if (logoRef.current) ro.observe(logoRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (ro) ro.disconnect()
    }
  }, [recomputeDrawer])

  useEffect(() => {
    if (!drawerOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  return (
    <div className="relative">
      <div ref={backgroundRef} className={`navbar-background ${scrolled ? 'scrolled' : ''} ${isDark ? 'dark' : ''}`}></div>

      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="mx-0 fluid-px">
          <div ref={navInnerRef} className="flex justify-between items-center h-16">
            <div ref={logoRef} className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🌸</span>
                <span className="font-bold text-xl text-gray-800 dark:text-white">
                  {process.env.NEXT_PUBLIC_NAV_LOGO || "NyaSakura 喵樱乡"}
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-end flex-1">
              {/* 用于测量链接自然宽度（不参与布局，不依赖断点） */}
              <div
                ref={measureRef}
                className="absolute -left-[9999px] top-0 whitespace-nowrap"
                aria-hidden="true"
              >
                <div className="inline-flex gap-3">{navLinks}</div>
              </div>

              {!useDrawer ? (
                <div className="flex items-center justify-end gap-3 ml-auto whitespace-nowrap">{navLinks}</div>
              ) : (
                <div className="ml-auto">
                  <button
                    onClick={() => setDrawerOpen(true)}
                    aria-label="打开菜单"
                    className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {useDrawer && drawerOpen && (
        <div className="fixed inset-0 z-30">
          <button
            className="absolute inset-0 w-full h-full bg-black/30"
            aria-label="关闭菜单"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[min(20rem,80vw)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-l border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-end">
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="关闭菜单"
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-2 flex flex-col space-y-1">
              {process.env.NEXT_PUBLIC_NAV_SHOW_HOME !== 'false' && (
                <Link
                  href={process.env.NEXT_PUBLIC_NAV_HOME_URL || '/'}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_NAV_HOME || '首页'}
                </Link>
              )}
              {process.env.NEXT_PUBLIC_NAV_SHOW_MAP !== 'false' && (
                <Link
                  href={process.env.NEXT_PUBLIC_NAV_MAP_URL || 'https://map.nyasakura.fun'}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_NAV_MAP || '服务器地图'}
                </Link>
              )}
              {process.env.NEXT_PUBLIC_NAV_SHOW_METRO !== 'false' && (
                <Link
                  href={process.env.NEXT_PUBLIC_NAV_METRO_URL || 'https://metro.nyasakura.fun'}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_NAV_METRO || '服务器地铁'}
                </Link>
              )}
              {process.env.NEXT_PUBLIC_NAV_SHOW_WIKI !== 'false' && (
                <Link
                  href={process.env.NEXT_PUBLIC_WIKI_URL || 'https://wiki.nyasakura.fun'}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_NAV_WIKI || '服务器Wiki'}
                </Link>
              )}
              {process.env.NEXT_PUBLIC_NAV_SHOW_DONATE !== 'false' && (
                <Link
                  href={process.env.NEXT_PUBLIC_NAV_DONATE_URL || '/donate'}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_NAV_DONATE || '服务器捐赠名单'}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}