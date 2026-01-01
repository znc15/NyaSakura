'use client'

import { Footer } from '../components/Footer'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function DonatePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto fluid-px pt-28 pb-10">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold text-[#8785A2] dark:text-white mb-4">
            <span className="text-[#8785A2]">服务器捐赠名单</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            感谢所有为服务器发展做出贡献的玩家们，您的支持是我们继续前进的动力！
          </p>
        </motion.div>

        {/* 捐赠说明 */}
        <motion.div 
          className="max-w-4xl mx-auto backdrop-blur-sm shadow-md border border-[#FFC7C7] dark:border-[#8785A2]/30 rounded-xl p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-[#8785A2] dark:text-white mb-4 flex items-center">
            <span className="text-[#8785A2] mr-2">❤</span>
            关于捐赠
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>NyaSakura 服务器自运营以来，一直致力于为玩家提供优质的游戏体验。服务器的维护需要大量的资金支持，包括但不限于：</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li className="text-gray-700 dark:text-gray-300">服务器硬件租赁费用</li>
              <li className="text-gray-700 dark:text-gray-300">域名与证书年费</li>
              <li className="text-gray-700 dark:text-gray-300">定期的性能优化与升级</li>
              <li className="text-gray-700 dark:text-gray-300">活动奖励支出</li>
            </ul>
          </div>
        </motion.div>

        {/* 捐赠名单 */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center text-[#8785A2] dark:text-white mb-12">
            <span className="relative">
              捐赠玩家名单
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFC7C7] to-[#8785A2]"></span>
            </span>
          </h2>
          
          {/* 捐赠卡片网格 */}
          <div
            className="auto-grid"
            style={{ ['--grid-min' as any]: '18rem', ['--grid-gap' as any]: '1.5rem' }}
          >
            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">小绵羊</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥200.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"服务器加油！"</p>
            </motion.div>
            
            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">阿狸</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥150.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"喜欢这个服务器的氛围~"</p>
            </motion.div>
            
            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>

            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>

            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>

            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>

            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>

            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>

            <motion.div 
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[#FFC7C7] dark:border-[#8785A2]/30 backdrop-blur-sm group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8785A2] dark:text-white group-hover:text-[#8785A2] transition-colors">樱花酱</h3>
                <span className="text-lg font-semibold text-[#8785A2] dark:text-[#FFC7C7]">¥100.00</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"新年快乐！"</p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
} 