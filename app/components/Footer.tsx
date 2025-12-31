import React from 'react';

export function Footer() {
  return (
    <footer className="mt-16 py-12 border-t border-pink-500/30 text-center bg-gradient-to-b from-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-pink-300 mb-2">NyaSakura Server</h3>
            <p className="text-sm opacity-70">一个充满创意与欢乐的Minecraft服务器</p>
          </div>
          
          <div className="grid grid-cols-1 gap-y-6 mb-4 md:mb-0 text-sm">
            <div className="text-right">
              <h4 className="font-bold text-black mb-2 text-base">友情链接</h4>
              <ul className="space-y-2 text-black">
                <li><a href="/wiki" className="block py-1 transition-colors hover:text-pink-500">小绵羊的小窝</a></li>
                <li><a href="/join" className="block py-1 transition-colors hover:text-pink-500">阿狸的博客</a></li>
                <li><a href="/status" className="block py-1 transition-colors hover:text-pink-500">Calibur Server</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-pink-500/20 text-sm opacity-70">
          <p>© {new Date().getFullYear()} NyaSakura Server. 保留所有权利。<a> | </a>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors">
               粤ICP备XXXXXXXX号</a><a> | </a>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors">
            粤公网安备 44030502000001号</a>
          </p>
          <p className="mt-1">本站与Mojang Studios无关联。Minecraft为Mojang Studios的商标。</p>
        </div>
      </div>
    </footer>
  );
} 