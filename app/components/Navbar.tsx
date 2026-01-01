'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 关闭移动菜单的函数
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="relative">
      {/* 背景层 */}
      <div className={`navbar-background ${scrolled ? 'scrolled' : ''} ${isDark ? 'dark' : ''}`}></div>
      
      {/* 内容层 */}
      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="mx-0 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 樱花Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🌸</span>
                <span className="font-bold text-xl text-gray-800 dark:text-white">
                  {process.env.NEXT_PUBLIC_NAV_LOGO || "NyaSakura 喵樱乡"}
                </span>
              </Link>
            </div>
            
            {/* 右侧菜单容器 */}
            <div className="flex items-center justify-end flex-1">
              {/* 桌面菜单 */}
              <div className="hidden md:flex md:items-center md:justify-end md:space-x-3 md:ml-auto">
                {process.env.NEXT_PUBLIC_NAV_SHOW_HOME !== 'false' && (
                  <Link href={process.env.NEXT_PUBLIC_NAV_HOME_URL || "/"} className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {process.env.NEXT_PUBLIC_NAV_HOME || "首页"}
                  </Link>
                )}
                {process.env.NEXT_PUBLIC_NAV_SHOW_MAP !== 'false' && (
                  <Link href={process.env.NEXT_PUBLIC_NAV_MAP_URL || "https://map.nyasakura.fun"} className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {process.env.NEXT_PUBLIC_NAV_MAP || "服务器地图"}
                  </Link>
                )}
                {process.env.NEXT_PUBLIC_NAV_SHOW_METRO !== 'false' && (
                  <Link href={process.env.NEXT_PUBLIC_NAV_METRO_URL || "https://metro.nyasakura.fun"} className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {process.env.NEXT_PUBLIC_NAV_METRO || "服务器地铁"}
                  </Link>
                )}
                {process.env.NEXT_PUBLIC_NAV_SHOW_WIKI !== 'false' && (
                  <Link href={process.env.NEXT_PUBLIC_WIKI_URL || "https://wiki.nyasakura.fun"} className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {process.env.NEXT_PUBLIC_NAV_WIKI || "服务器Wiki"}
                  </Link>
                )}
                {process.env.NEXT_PUBLIC_NAV_SHOW_DONATE !== 'false' && (
                  <Link href={process.env.NEXT_PUBLIC_NAV_DONATE_URL || "/donate"} className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {process.env.NEXT_PUBLIC_NAV_DONATE || "服务器捐赠名单"}
                  </Link>
                )}
              </div>
              
              {/* 移动端菜单按钮 */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                >
                  {mobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        <div className={`md:hidden absolute w-full overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg rounded-b-xl mx-4 mt-2 border border-gray-200 dark:border-gray-800">
            {process.env.NEXT_PUBLIC_NAV_SHOW_HOME !== 'false' && (
              <Link
                href={process.env.NEXT_PUBLIC_NAV_HOME_URL || "/"}
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {process.env.NEXT_PUBLIC_NAV_HOME || "首页"}
              </Link>
            )}
            {process.env.NEXT_PUBLIC_NAV_SHOW_MAP !== 'false' && (
              <Link
                href={process.env.NEXT_PUBLIC_NAV_MAP_URL || "https://map.nyasakura.fun"}
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {process.env.NEXT_PUBLIC_NAV_MAP || "服务器地图"}
              </Link>
            )}
            {process.env.NEXT_PUBLIC_NAV_SHOW_METRO !== 'false' && (
              <Link
                href={process.env.NEXT_PUBLIC_NAV_METRO_URL || "https://metro.nyasakura.fun"}
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {process.env.NEXT_PUBLIC_NAV_METRO || "服务器地铁"}
              </Link>
            )}
            {process.env.NEXT_PUBLIC_NAV_SHOW_WIKI !== 'false' && (
              <Link
                href={process.env.NEXT_PUBLIC_WIKI_URL || "https://wiki.nyasakura.fun"}
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {process.env.NEXT_PUBLIC_NAV_WIKI || "服务器Wiki"}
              </Link>
            )}
            {process.env.NEXT_PUBLIC_NAV_SHOW_DONATE !== 'false' && (
              <Link
                href={process.env.NEXT_PUBLIC_NAV_DONATE_URL || "/donate"}
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {process.env.NEXT_PUBLIC_NAV_DONATE || "服务器捐赠名单"}
              </Link>
            )}
          </div>
          </div>
      </nav>

      <style jsx>{`
        .navbar-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.4);
        }
        
        .navbar-background.dark {
          background-color: rgba(17, 24, 39, 0.4);
        }
        
        .navbar-background.scrolled {
          background-color: rgba(255, 255, 255, 0.7);
        }
        
        .navbar-background.scrolled.dark {
          background-color: rgba(17, 24, 39, 0.7);
        }
        
        .navbar-background {
          height: 4rem;
        }
      `}</style>
    </div>
  )
}