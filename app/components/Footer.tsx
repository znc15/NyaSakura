import React from 'react';

export function Footer() {
  return (
    <footer className="mt-[clamp(3rem,8vh,4rem)] py-[clamp(2rem,6vh,3rem)] border-t border-pink-500/30 bg-gradient-to-b from-transparent">
      <div className="max-w-6xl mx-auto fluid-px">
        <div className="flex flex-col gap-8 text-center sm:flex-row sm:justify-between sm:items-start sm:text-left">
          <div>
            <h3 className="font-bold text-pink-300 mb-2 text-[clamp(1.25rem,3vw,1.5rem)]">NyaSakura Server</h3>
            <p className="opacity-70 text-[clamp(0.875rem,1.8vw,0.95rem)]">一个充满创意与欢乐的Minecraft服务器</p>
          </div>
          
          <div className="text-[clamp(0.875rem,1.8vw,0.95rem)] sm:text-right">
            <h4 className="font-bold text-black mb-2 text-[clamp(1rem,2.2vw,1.05rem)]">友情链接</h4>
            <ul className="space-y-2 text-black">
              <li><a href="/wiki" className="block py-1 transition-colors hover:text-pink-500">小绵羊的小窝</a></li>
              <li><a href="/join" className="block py-1 transition-colors hover:text-pink-500">阿狸的博客</a></li>
              <li><a href="/status" className="block py-1 transition-colors hover:text-pink-500">Calibur Server</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-[clamp(1.5rem,4vh,2rem)] pt-[clamp(1rem,3vh,1.5rem)] border-t border-pink-500/20 opacity-70 text-center text-[clamp(0.75rem,1.6vw,0.875rem)] leading-relaxed break-words">
          <p>
            <span>© {new Date().getFullYear()} NyaSakura Server. 保留所有权利。</span>
            <span className="mx-2 opacity-60" aria-hidden="true">|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition-colors"
            >
              粤ICP备XXXXXXXX号
            </a>
            <span className="mx-2 opacity-60" aria-hidden="true">|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition-colors"
            >
              粤公网安备 44030502000001号
            </a>
          </p>
          <p className="mt-1">本站与Mojang Studios无关联。Minecraft为Mojang Studios的商标。</p>
        </div>
      </div>
    </footer>
  );
} 