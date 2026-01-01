"use client";

import { TypeWriter } from "./components/TypeWriter";
import { Sakura } from "./components/Sakura";
import { Footer } from "./components/Footer";
import "./styles/home.css";
import { useEffect, useState } from "react";
import Dialog from "./components/Dialog";

export default function Home() {
  // 使用静态数据代替API调用
  const [onlinePlayers] = useState<number>(0);
  const [uptime, setUptime] = useState<string>(process.env.NEXT_PUBLIC_STATUS_CALCULATING || "计算中...");
  const [showServerAddress, setShowServerAddress] = useState(false);

  // 计算并每秒更新运行时间
  useEffect(() => {
    const calculateUptime = () => {
      const startDate = new Date(process.env.NEXT_PUBLIC_SERVER_START_DATE || '2023-08-09');
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
    };
    
    // 初始计算
    setUptime(calculateUptime());
    
    // 每秒更新一次
    const uptimeInterval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);
    
    return () => clearInterval(uptimeInterval);
  }, []);
  
  // 平滑滚动到下一屏
  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const typewriterTexts: string[] = (() => {
    const configured = [
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_1,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_2,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_3,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_4,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_5,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_6,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_7,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_8,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_9,
      process.env.NEXT_PUBLIC_TYPEWRITER_TEXT_10,
    ].filter((text): text is string => typeof text === "string" && text.trim() !== "");

    return configured.length > 0
      ? configured
      : ["探索机械工艺的无限可能", "与女仆相伴，为你保驾护航", "一个充满创意与欢乐的服务器"];
  })();

  return (
    <div className="container" style={{color: "#8785A2"}}>
      <Sakura count={Number(process.env.NEXT_PUBLIC_SAKURA_COUNT) || 30} />
      {showServerAddress && (
        <Dialog
          title={process.env.NEXT_PUBLIC_DIALOG_SERVER_ADDRESS || "服务器地址"}
          onClose={() => setShowServerAddress(false)}
        >
          <div className="space-y-3">
            <p className="flex items-center">
              <span className="inline-block w-6 h-6 mr-2 text-center">🌐</span>
              <span className="font-medium text-[#8785A2]">{process.env.NEXT_PUBLIC_DIALOG_IPV4_LABEL || "IPV4地址"}: </span>
              <span className="ml-2">{process.env.NEXT_PUBLIC_SERVER_IPV4 || "play.tcbmc.cc"}</span>
            </p>
            <p className="flex items-center">
              <span className="inline-block w-6 h-6 mr-2 text-center">🚀</span>
              <span className="font-medium text-[#8785A2]">{process.env.NEXT_PUBLIC_DIALOG_IPV6_LABEL || "IPV6地址 (推荐)"}: </span>
              <span className="ml-2">{process.env.NEXT_PUBLIC_SERVER_IPV6 || "v6.play.tcbmc.cc"}</span>
            </p>
            <p className="flex items-center">
              <span className="inline-block w-6 h-6 mr-2 text-center">🔄</span>
              <span className="font-medium text-[#8785A2]">{process.env.NEXT_PUBLIC_DIALOG_BACKUP_LABEL || "备用地址"}: </span>
              <span className="ml-2">{process.env.NEXT_PUBLIC_SERVER_BACKUP || "backup.play.tcbmc.cc"}</span>
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowServerAddress(false)}
              className="px-6 py-2 bg-transparent border border-[#FFC7C7] text-[#8785A2] rounded-lg transition-colors font-medium hover:bg-[#FFE2E2]/30"
            >
              {process.env.NEXT_PUBLIC_BUTTON_UNDERSTAND || "了解"}
            </button>
          </div>
        </Dialog>
      )}

      {/* 第一屏：全屏欢迎区域 */}
      <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 relative">
        <main className="main flex-1 flex flex-col justify-center pb-24 md:pb-0">
          <div className="fade-in-up">
            <h2 className="greeting" style={{color: "#8785A2"}}>{process.env.NEXT_PUBLIC_GREETING || "欢迎来到"}</h2>
            <h1 className="name" style={{
              background: "linear-gradient(90deg, #FFC7C7 0%, #8785A2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{process.env.NEXT_PUBLIC_SERVER_NAME || "NyaSakura Server"}</h1>
            <h2 className="typewriter" style={{color: "#8785A2"}}>
              <TypeWriter
                texts={typewriterTexts}
                typingDelay={Number(process.env.NEXT_PUBLIC_TYPEWRITER_TYPING_DELAY) || 150}
                deletingDelay={Number(process.env.NEXT_PUBLIC_TYPEWRITER_DELETING_DELAY) || 50}
                pauseDelay={Number(process.env.NEXT_PUBLIC_TYPEWRITER_PAUSE_DELAY) || 2000}
              />
            </h2>
          </div>
          
          <div className="fade-in-up delay-200">
            <h2 className="interests" style={{color: "#8785A2"}}>
              {process.env.NEXT_PUBLIC_FEATURE_TITLE || "服务器核心特色"}
              <span style={{color: "#FFC7C7"}}>{process.env.NEXT_PUBLIC_FEATURE_1 || "创意机械"}</span>、
              <span style={{color: "#FFC7C7"}}>{process.env.NEXT_PUBLIC_FEATURE_2 || "萌娘女仆"}</span>
              <span className="emoji">❀</span>
            </h2>
            <p className="description" style={{color: "#8785A2"}}>
              {process.env.NEXT_PUBLIC_DESCRIPTION || "这是一个注重创造与趣味的 Minecraft 服务器，我们致力于打造温馨舒适的游戏体验。"}
            </p>
          </div>

          <div className="button-group fade-in-up delay-300">
            <a href={process.env.NEXT_PUBLIC_WIKI_URL || "https://wiki.nyasakura.fun"} className="button" style={{
              backgroundColor: "transparent",
              color: "#8785A2",
              borderColor: "#FFC7C7"
            }}>
              {process.env.NEXT_PUBLIC_BUTTON_WIKI || "服务器Wiki"}
            </a>
            <button
              onClick={() => setShowServerAddress(true)}
              className="button" style={{
                backgroundColor: "transparent",
                color: "#8785A2",
                borderColor: "#FFC7C7"
              }}
            >
              {process.env.NEXT_PUBLIC_BUTTON_JOIN || "加入我们"}
            </button>
          </div>

          <div className="social-links fade-in-up delay-400" style={{color: "#8785A2"}}>
            <a
              href={process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/nyasakura-mc"}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link hover:text-[#FFC7C7]"
            >
              <svg
                viewBox="0 0 24 24"
                className="social-icon"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_BILIBILI_URL || "https://space.bilibili.com/348894836"}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z"/>
              </svg>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_QQ_URL || "https://qm.qq.com/q/j5OJ7sUANO"}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29 0 2.239.43 6.287.687 6.287 0 0-.688-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"/>
              </svg>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_KOOK_URL || "https://kook.top/uMLpM4"}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.0721 2.4721c.4155-.6233.9179-.6233 1.3334 0L22.9363 20.5279c.4155.6233-.1039 1.4721-.8707 1.4721H1.9344c-.7668 0-1.2862-.8488-.8707-1.4721L11.0721 2.4721zM12 6.8673L5.2868 19.5H18.831L12 6.8673z"/>
              </svg>
            </a>
          </div>
        </main>

        {/* 向下滚动按钮 */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer bg-transparent border-none focus:outline-none"
          aria-label="向下滚动"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#FFC7C7] hover:text-[#8785A2] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {/* 第二屏：服务器详情内容 */}
      <div id="content-section" className="content px-4 sm:px-6 lg:px-8 py-12">
        <div className="server-info p-6 bg-[#FFE2E2]/80 backdrop-blur-md rounded-lg shadow-lg fade-in-up">
          <h2 className="text-2xl font-bold mb-4 text-[#8785A2]">{process.env.NEXT_PUBLIC_SERVER_DETAILS_TITLE || "服务器详情"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#8785A2]">{process.env.NEXT_PUBLIC_SERVER_CONFIG_TITLE || "服务器配置"}</h3>
                <ul className="space-y-2 text-[#8785A2]">
                  <li className="flex items-center">
                    <span className="mr-2">🖥️</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_CPU || "CPU: Intel(R) Core(TM) i7-9700K"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🧠</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_RAM || "内存: 32GB DDR4"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">💾</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_STORAGE || "存储: 1TB NVMe SSD"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_NETWORK || "网络: 1Gbps 家用宽带"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">⚡</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_POWER || "电源: 750W 金牌全模组电源"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">❄️</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_COOLING || "散热: 360mm一体式水冷"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🛡️</span>
                    <span>{process.env.NEXT_PUBLIC_CONFIG_OS || "系统: Ubuntu Server 22.04 LTS"}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#8785A2]">{process.env.NEXT_PUBLIC_SERVER_STATUS_TITLE || "服务器状态"}</h3>
                <ul className="space-y-2 text-[#8785A2]">
                  <li className="flex items-center">
                    <span className="mr-2">👥</span>
                    <span>{process.env.NEXT_PUBLIC_STATUS_ONLINE || "当前在线"}: <span className="text-[#8785A2] font-medium">
                      {onlinePlayers}
                    </span> / {process.env.NEXT_PUBLIC_MAX_PLAYERS || "75"} {process.env.NEXT_PUBLIC_STATUS_PLAYERS || "玩家"}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span>{process.env.NEXT_PUBLIC_STATUS_UPTIME || "运行时间"}: {uptime}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="server-detail mt-8 p-6 bg-[#FFE2E2]/80 backdrop-blur-md rounded-lg shadow-lg fade-in-up delay-500">
            <h2 className="text-2xl font-bold mb-6 text-[#8785A2] text-center">{process.env.NEXT_PUBLIC_DETAIL_INTRO_TITLE || "服务器详细介绍"}</h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-[#8785A2] border-l-4 border-[#FFC7C7] pl-3">{process.env.NEXT_PUBLIC_DETAIL_MODS_TITLE || "核心模组介绍"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">⚙️</span>
                    <span>{process.env.NEXT_PUBLIC_MOD_CREATE_NAME || "机械工艺 (Create)"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_MOD_CREATE_DESC || "机械工艺模组允许玩家建造复杂的机械系统，使用齿轮、传动轴和传送带等元素。你可以建造自动化工厂、复杂的运输系统，甚至是移动的建筑物！"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">👸</span>
                    <span>{process.env.NEXT_PUBLIC_MOD_MAID_NAME || "女仆萌娘 (TouhouLittleMaid)"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_MOD_MAID_DESC || "在旅途过程中，有女仆相伴，为你保驾护航。女仆可以帮助你战斗、收集资源，让你的冒险更加轻松愉快。"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🐾</span>
                    <span>{process.env.NEXT_PUBLIC_MOD_ARTIFACTS_NAME || "动物契约 (Artifacts)"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_MOD_ARTIFACTS_DESC || "喜欢小动物？可以和动物签订契约，给动物装备。让你的宠物成为强大的战斗伙伴，陪伴你一起冒险。"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🏗️</span>
                    <span>{process.env.NEXT_PUBLIC_MOD_CHISELS_NAME || "建筑增强 (Chisels & Bits)"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_MOD_CHISELS_DESC || "是建筑党？雕刻工艺，各种新的家具，方块小镇，让你的建筑多姿多彩。打造精美的建筑细节，展现你的创意。"}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-[#8785A2] border-l-4 border-[#FFC7C7] pl-3">{process.env.NEXT_PUBLIC_DETAIL_FEATURES_TITLE || "更多特色"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🚇</span>
                    <span>{process.env.NEXT_PUBLIC_FEATURE_MTR_NAME || "铁路系统 (MTR)"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_FEATURE_MTR_DESC || "喜欢地铁吗，服务器加入了MTR模组，可以尽情的建造你喜欢的铁路。打造复杂的地铁和铁路网络，连接世界各地。"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🎮</span>
                    <span>{process.env.NEXT_PUBLIC_FEATURE_SKIN_NAME || "玩家皮肤"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_FEATURE_SKIN_DESC || "服务器还有各种玩家皮肤，从小到大，什么都有，不够还能叫腐竹加。让你在游戏中展现独特的个性。"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🐉</span>
                    <span>{process.env.NEXT_PUBLIC_FEATURE_COMBAT_NAME || "战斗挑战"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_FEATURE_COMBAT_DESC || "是强度党？末影龙可以自动复活，主世界-地狱-末地，强度越来越高，你需要对付不同的生物来提高自己！"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🌾</span>
                    <span>{process.env.NEXT_PUBLIC_FEATURE_CASUAL_NAME || "休闲生活"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_FEATURE_CASUAL_DESC || "或者你是养老党，也可以！自动钓鱼，各种奇怪的料理，厨房，植物，动物，让你的生活多姿多彩。"}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-[#8785A2] border-l-4 border-[#FFC7C7] pl-3">{process.env.NEXT_PUBLIC_DETAIL_RULES_TITLE || "游戏规则"}</h3>
              <ul className="space-y-2 pl-6 list-disc text-[#8785A2]">
                <li>{process.env.NEXT_PUBLIC_RULE_1 || "禁止使用任何形式的作弊客户端或模组"}</li>
                <li>{process.env.NEXT_PUBLIC_RULE_2 || "禁止恶意破坏他人的建筑或设施"}</li>
                <li>{process.env.NEXT_PUBLIC_RULE_3 || "禁止过度占用服务器资源（如大量红石循环或实体刷怪）"}</li>
                <li>{process.env.NEXT_PUBLIC_RULE_4 || "尊重其他玩家，保持友好的游戏环境"}</li>
                <li>{process.env.NEXT_PUBLIC_RULE_5 || "商业区建筑需遵循相关风格指南"}</li>
                <li>{process.env.NEXT_PUBLIC_RULE_6 || "在公共区域修建前需向管理员申请"}</li>
              </ul>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-[#8785A2] border-l-4 border-[#FFC7C7] pl-3">{process.env.NEXT_PUBLIC_DETAIL_WORLDS_TITLE || "世界介绍"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🏙️</span>
                    <span>{process.env.NEXT_PUBLIC_WORLD_OVERWORLD_NAME || "主世界"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_WORLD_OVERWORLD_DESC || "主世界是玩家主要活动的区域，拥有丰富的自然资源和广阔的建筑空间。尽管是Mod服务器，我们依旧尽量保留了原版特性，大部分生电机器都可以在服务器中运行。"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">👾</span>
                    <span>{process.env.NEXT_PUBLIC_WORLD_END_NAME || "末地"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_WORLD_END_DESC || "末地拥有更多的末影龙和特殊资源，是获取高级材料的重要场所。末影龙可以自动复活，为强度党提供持续的挑战。"}</p>
                </div>
                <div className="bg-[#F6F6F6] p-4 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center text-[#8785A2]">
                    <span className="mr-2">🔥</span>
                    <span>{process.env.NEXT_PUBLIC_WORLD_NETHER_NAME || "下界"}</span>
                  </h4>
                  <p className="text-sm text-[#8785A2]">{process.env.NEXT_PUBLIC_WORLD_NETHER_DESC || "下界是获取特殊资源的危险维度，拥有丰富的下界合金和其他稀有材料。主世界-地狱-末地，强度越来越高，挑战不断。"}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#8785A2] border-l-4 border-[#FFC7C7] pl-3">{process.env.NEXT_PUBLIC_DETAIL_COMMUNITY_TITLE || "社区支持"}</h3>
              <div className="bg-[#F6F6F6] p-4 rounded-lg">
                <ul className="space-y-2 pl-6 list-disc text-[#8785A2]">
                  <li>{process.env.NEXT_PUBLIC_COMMUNITY_1 || "完善的社区支持，QQ群，Github等一系列方式反馈自己的问题"}</li>
                  <li>{process.env.NEXT_PUBLIC_COMMUNITY_2 || "服务器部分插件为自制插件，只要你想要的功能，我们都尽量满足"}</li>
                  <li>{process.env.NEXT_PUBLIC_COMMUNITY_3 || "群内不定时红包，好运连连"}</li>
                  <li>{process.env.NEXT_PUBLIC_COMMUNITY_4 || "服务器准备有邀请新人活动，大大有赏！"}</li>
                  <li>{process.env.NEXT_PUBLIC_COMMUNITY_5 || "腐竹不定时女装（雾）"}</li>
                </ul>
              </div>
            </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowServerAddress(true)}
                  className="inline-block px-4 py-2 bg-transparent border border-[#FFC7C7] text-[#8785A2] rounded-lg transition-colors hover:bg-[#FFE2E2]/30"
                >
                  {process.env.NEXT_PUBLIC_BUTTON_JOIN || "加入我们"}
                </button>
              </div>
          </div>
      </div>

      <Footer />
    </div>
  );
}
