import React from 'react';

type FriendLink = {
  name: string;
  url: string;
};

const DEFAULT_FRIEND_LINKS: FriendLink[] = [
  { name: '小绵羊的小窝', url: '/wiki' },
  { name: '阿狸的博客', url: '/join' },
  { name: 'Calibur Server', url: '/status' },
];

function parseFriendLinks(raw: string | undefined): FriendLink[] {
  if (!raw || raw.trim() === '') return DEFAULT_FRIEND_LINKS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_FRIEND_LINKS;

    const normalized: FriendLink[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue;
      if (!('name' in item) || !('url' in item)) continue;
      const { name, url } = item as { name: unknown; url: unknown };
      if (typeof name !== 'string' || typeof url !== 'string') continue;
      const trimmedName = name.trim();
      const trimmedUrl = url.trim();
      if (!trimmedName || !trimmedUrl) continue;
      normalized.push({ name: trimmedName, url: trimmedUrl });
    }

    return normalized.length > 0 ? normalized : DEFAULT_FRIEND_LINKS;
  } catch {
    return DEFAULT_FRIEND_LINKS;
  }
}

export function Footer() {
  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME || 'NyaSakura Server';
  const friendLinks = parseFriendLinks(process.env.NEXT_PUBLIC_FRIEND_LINKS);

  const footerIntro =
    process.env.NEXT_PUBLIC_FOOTER_INTRO || '一个充满创意与欢乐的Minecraft服务器';

  const icpNumber = process.env.NEXT_PUBLIC_ICP_NUMBER || '粤ICP备XXXXXXXX号';
  const icpLink = process.env.NEXT_PUBLIC_ICP_LINK || 'https://beian.miit.gov.cn/';
  const gaNumber = process.env.NEXT_PUBLIC_GA_NUMBER || '粤公网安备 44030502000001号';
  const gaLink = process.env.NEXT_PUBLIC_GA_LINK || 'https://beian.miit.gov.cn/';

  return (
    <footer className="mt-[clamp(3rem,8vh,4rem)] py-[clamp(2rem,6vh,3rem)] border-t border-pink-500/30 bg-gradient-to-b from-transparent">
      <div className="max-w-6xl mx-auto fluid-px">
        <div className="flex flex-col gap-8 text-center sm:flex-row sm:justify-between sm:items-start sm:text-left">
          <div>
            <h3 className="font-bold text-pink-300 mb-2 text-[clamp(1.25rem,3vw,1.5rem)]">{serverName}</h3>
            <p className="opacity-70 text-[clamp(0.875rem,1.8vw,0.95rem)]">{footerIntro}</p>
          </div>

          <div className="text-[clamp(0.875rem,1.8vw,0.95rem)] sm:text-right">
            <h4 className="font-bold text-black mb-2 text-[clamp(1rem,2.2vw,1.05rem)]">友情链接</h4>
            <ul className="space-y-2 text-black">
              {friendLinks.map((link, index) => (
                <li key={`${link.name}-${link.url}-${index}`}>
                  <a href={link.url} className="block py-1 transition-colors hover:text-pink-500">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(1.5rem,4vh,2rem)] pt-[clamp(1rem,3vh,1.5rem)] border-t border-pink-500/20 opacity-70 text-center text-[clamp(0.75rem,1.6vw,0.875rem)] leading-relaxed break-words">
          <p>
            <span>© {new Date().getFullYear()} {serverName}. 保留所有权利。</span>
            <span className="mx-2 opacity-60" aria-hidden="true">|</span>
            <a
              href={icpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition-colors"
            >
              {icpNumber}
            </a>
            <span className="mx-2 opacity-60" aria-hidden="true">|</span>
            <a
              href={gaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition-colors"
            >
              {gaNumber}
            </a>
          </p>
          <p className="mt-1">本站与Mojang Studios无关联。Minecraft为Mojang Studios的商标。</p>
        </div>
      </div>
    </footer>
  );
}