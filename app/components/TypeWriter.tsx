'use client'

import { useState, useEffect } from 'react'

interface TypeWriterProps {
  texts: string[]
  delay?: number
  className?: string
  typingDelay?: number
  deletingDelay?: number
  pauseDelay?: number
}

export function TypeWriter({ 
  texts, 
  className = '',
  typingDelay = 150, // 打字时间
  deletingDelay = 50, // 删除时间
  pauseDelay = 100 // 暂停时间
}: TypeWriterProps) {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const text = texts[textIndex]

    if (isDeleting) {
      if (currentIndex <= 0) {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
        setIsDeleting(false)
        setCurrentIndex(0)
        return
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(text.substring(0, currentIndex - 1))
        setCurrentIndex(prevIndex => prevIndex - 1)
      }, deletingDelay)
      
      return () => clearTimeout(timeout)
    } else {
      if (currentIndex === text.length) {
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseDelay)
        return () => clearTimeout(timeout)
      }

      const timeout = setTimeout(() => {
        setCurrentText(text.substring(0, currentIndex + 1))
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, typingDelay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, isDeleting, textIndex, texts, typingDelay, deletingDelay, pauseDelay])

  return <span className={className}>{currentText}</span>
} 