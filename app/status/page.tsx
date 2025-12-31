"use client";

import { useState, useEffect, ReactNode } from 'react';
import { Footer } from "../components/Footer";
import { Sakura } from "../components/Sakura";
import { motion } from "framer-motion";
import "../styles/home.css";

interface ServerStatus {
  status: string;
  onlinePlayers: number;
  maxPlayers: number;
  minecraft: {
    version: string;
    motd: string;
    address: string;
    protocol: {
      version: string;
    };
    hostname: string;
    ip: string;
    port: number;
    eula_blocked: boolean;
    debug: any;
  };
  system: {
    platform: string;
    type: string;
    release: string;
    hostname: string;
    uptime: number;
    loadAvg: number[];
    loadAvgDetailed: {
      value: number;
      perCore: string;
      status: string;
    }[];
  };
  cpu: {
    model: string;
    cores: number;
    avgUsage: string;
  };
  memory: {
    total: string;
    free: string;
    used: string;
    usagePercent: string;
  };
  disk: {
    usagePercent: string;
    available: string;
    size: string;
    used: string;
    filesystem: string;
    mountedOn: string;
    ioStats: {
      readRate: string;
      writeRate: string;
      util: string;
    };
  };
  timestamp: string;
}

interface CardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

// 简单的图标组件
const ServerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);

const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const ChipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const TimeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MemoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="5" width="22" height="14" rx="2" ry="2"></rect>
    <line x1="5" y1="5" x2="5" y2="19"></line>
    <line x1="9" y1="5" x2="9" y2="19"></line>
    <line x1="15" y1="5" x2="15" y2="19"></line>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);

const HddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="12" x2="2" y2="12"></line>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
    <line x1="6" y1="16" x2="6.01" y2="16"></line>
    <line x1="10" y1="16" x2="10.01" y2="16"></line>
  </svg>
);

// 自定义卡片组件
const Card = ({ title, icon, children, className = "" }: CardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#F6F6F6]/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-[#8785A2]/30 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center mb-4 space-x-2">
        <div className="text-[#333333] text-2xl w-6 h-6">{icon}</div>
        <h2 className="text-2xl font-bold text-[#333333]">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

interface ProgressBarProps {
  value: string;
  label: string;
}

// 进度条组件
const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const percentage = parseInt(value);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[#333333]">{label}:</span>
        <span className={`font-medium ${percentage > 80 ? 'text-[#FFC7C7]' : percentage > 50 ? 'text-[#FFE2E2]' : 'text-[#333333]'}`}>
          {value}
        </span>
      </div>
      <div className="w-full bg-[#FFE2E2] rounded-full h-3 overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: value }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-3 rounded-full ${
            percentage > 80 ? 'bg-[#FFC7C7]' : 
            percentage > 50 ? 'bg-[#FFE2E2]' : 
            'bg-[#333333]/60'
          }`}
        ></motion.div>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

// 状态标签组件
const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      status === 'online' ? 'bg-gray-400' : 'bg-red-500'
    }`}>
      {status === 'online' ? '在线' : '离线'}
    </span>
  );
};

// 新增磁盘IO数据展示组件
const IOStat = ({ label, value, icon }: { label: string; value: string; icon: string }) => {
  return (
    <div className="flex items-center space-x-2 bg-[#FFE2E2]/90 p-2 rounded-lg">
      <div className="text-[#8785A2]">{icon}</div>
      <div className="flex-1 text-xs text-[#8785A2]/80">{label}</div>
      <div className="font-mono text-sm">{value}</div>
    </div>
  );
};

// 在系统信息组件中更新负载均值显示
const LoadAvgItem = ({ load, label, perCore, status }: { load: number, label: string, perCore: string, status: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0.7 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#FFE2E2]/80 px-3 py-2 rounded-lg flex-1 text-center shadow-sm"
    >
      <div className="text-xs text-[#333333]/80 mb-1">{label}</div>
      <div className={`
        ${status === 'high' ? 'text-[#FFC7C7]' : 
          status === 'moderate' ? 'text-[#FFE2E2]' : 
          'text-[#333333]'}
      `}>
        {load.toFixed(2)}
      </div>
      <div className="text-xs mt-1 text-[#333333]">每核: {perCore}</div>
    </motion.div>
  );
};

export default function StatusPage() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 使用静态服务器配置
  const serverConfig = {
    host: 'play.tcbmc.cc',
    port: '25565'
  };
  
  // 使用静态数据代替API调用
  const loadStaticStatus = (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    // 模拟加载延迟
    setTimeout(() => {
      // 只在客户端生成动态数据
      const currentTimestamp = typeof window !== 'undefined' ? new Date().toISOString() : '';
      const currentUptime = typeof window !== 'undefined'
        ? Math.floor((Date.now() - new Date('2023-08-09').getTime()) / 1000)
        : 0;

      const staticData: ServerStatus = {
        status: 'online',
        onlinePlayers: 0,
        maxPlayers: 75,
        timestamp: currentTimestamp,
        minecraft: {
          version: '1.20.1',
          motd: '欢迎来到 NyaSakura Server',
          address: `${serverConfig.host}:${serverConfig.port}`,
          protocol: { version: '1.20.1' },
          hostname: serverConfig.host,
          ip: '',
          port: parseInt(serverConfig.port),
          eula_blocked: false,
          debug: {},
        },
        system: {
          platform: 'Linux',
          type: 'x64',
          release: 'Ubuntu Server 22.04 LTS',
          hostname: serverConfig.host,
          uptime: currentUptime,
          loadAvg: [0.5, 0.6, 0.7],
          loadAvgDetailed: [
            { value: 0.5, perCore: '0.06', status: 'normal' },
            { value: 0.6, perCore: '0.08', status: 'normal' },
            { value: 0.7, perCore: '0.09', status: 'normal' }
          ],
        },
        cpu: {
          model: 'Intel(R) Core(TM) i7-9700K',
          cores: 8,
          avgUsage: '15%',
        },
        memory: {
          total: '32.0 GB',
          free: '20.5 GB',
          used: '11.5 GB',
          usagePercent: '36%',
        },
        disk: {
          usagePercent: '45%',
          available: '550 GB',
          size: '1.0 TB',
          used: '450 GB',
          filesystem: '/dev/nvme0n1p1',
          mountedOn: '/',
          ioStats: {
            readRate: '5.2 MB/s',
            writeRate: '3.8 MB/s',
            util: '12%',
          },
        },
      };

      setStatus(staticData);
      setError(null);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };
  
  // 初始化加载
  useEffect(() => {
    loadStaticStatus(true);

    // 每30秒刷新一次（更新时间戳和运行时间）
    const interval = setInterval(() => loadStaticStatus(false), 30000);

    return () => clearInterval(interval);
  }, []);

  // 手动刷新功能
  const handleManualRefresh = () => {
    if (!refreshing) {
      loadStaticStatus(false);
    }
  };
  
  // 转换秒为天、时、分、秒格式
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.floor(seconds);
    
    return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
  };
  
  // 定义动画变体
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // 定义刷新动画
  const refreshAnimation = {
    rotate: refreshing ? 360 : 0
  };
  
  return (
    <div className="container min-h-screen">
      <Sakura count={20} />
      <div className="content px-4 sm:px-6 lg:px-8 py-12">
        <main>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-8 text-center text-[#333333] tracking-tight"
          >
            服务器运行状态
          </motion.h1>
          
          {/* 移除调试信息 */}
          
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-20 w-20 border-t-4 border-b-4 border-[#333333] rounded-full mb-4"
              ></motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[#333333] mt-4"
              >
                正在获取服务器状态...
              </motion.p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#FFC7C7]/20 border border-[#FFC7C7]/50 text-[#333333] p-6 rounded-lg max-w-2xl mx-auto shadow-lg"
            >
              <p className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#FFC7C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </motion.div>
          ) : status ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              {/* Minecraft服务器状态 */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-[#8785A2]/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#333333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  <h2 className="text-2xl font-bold text-[#333333]">Minecraft 服务器状态</h2>
                </div>
                
                {status.minecraft && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#8785A2] font-medium">状态:</span>
                      <motion.span 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          status.status === 'online' 
                            ? 'bg-[#FFC7C7]/20 text-[#8785A2]' 
                            : 'bg-[#FFC7C7]/20 text-[#8785A2]'
                        }`}
                      >
                        {status.status === 'online' ? '在线' : '离线'}
                      </motion.span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#8785A2] font-medium">在线玩家:</span>
                      <span className="text-[#8785A2] font-bold">
                        {status.onlinePlayers} / {status.maxPlayers}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#8785A2] font-medium">版本:</span>
                      <span className="text-[#8785A2] font-bold">
                        {status.minecraft.version}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#8785A2] font-medium">协议版本:</span>
                      <span className="text-[#8785A2] font-bold">
                        {status.minecraft.protocol.version}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#8785A2] font-medium">服务器地址:</span>
                      <span className="text-[#8785A2] font-bold">
                        {status.minecraft.address}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#8785A2] font-medium">EULA状态:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status.minecraft.eula_blocked 
                          ? 'bg-[#FFC7C7]/20 text-[#8785A2]' 
                          : 'bg-[#FFC7C7]/20 text-[#8785A2]'
                      }`}>
                        {status.minecraft.eula_blocked ? '已阻止' : '正常'}
                      </span>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FFC7C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <span className="text-[#8785A2] font-bold text-lg">服务器公告</span>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-[#FFE2E2]/50 to-[#FFC7C7]/30 p-4 rounded-lg border-l-4 border-[#FFC7C7] shadow-md"
                      >
                        {Array.isArray(status.minecraft.motd) 
                          ? status.minecraft.motd.map((line, index) => (
                              <p key={index} className="text-[#8785A2] font-medium my-1 leading-relaxed">{line}</p>
                            ))
                          : <p className="text-[#8785A2] font-medium leading-relaxed">{status.minecraft.motd}</p>
                        }
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* 系统状态 - 现在在Minecraft服务器状态下方 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-[#8785A2]/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#333333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-[#333333]">系统状态</h2>
                </div>
                
                {status.system && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">系统平台:</span>
                      <span className="text-[#333333] font-bold">
                        {status.system.platform}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">系统类型:</span>
                      <span className="text-[#333333] font-bold">
                        {status.system.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">系统版本:</span>
                      <span className="text-[#333333] font-bold">
                        {status.system.release}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">主机名:</span>
                      <span className="text-[#333333] font-bold">
                        {status.system.hostname}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">运行时间:</span>
                      <span className="text-[#333333] font-bold">
                        {formatUptime(status.system.uptime)}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <span className="text-[#333333] block mb-2">系统负载:</span>
                      <div className="space-y-2">
                        {status.system.loadAvgDetailed && Array.isArray(status.system.loadAvgDetailed) && status.system.loadAvgDetailed.map((load, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                            <span className="text-[#333333] font-medium">
                              {index === 0 ? '1分钟' : index === 1 ? '5分钟' : '15分钟'}:
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              load.status === 'high' 
                                ? 'bg-[#FFC7C7]/20 text-[#333333]' 
                                : load.status === 'moderate'
                                ? 'bg-[#FFE2E2]/20 text-[#333333]'
                                : 'bg-[#F6F6F6]/20 text-[#333333]'
                            }`}>
                              {load.value.toFixed(2)} (每核心: {load.perCore})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {status.cpu && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-semibold text-pink-300">CPU信息</h3>
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">型号:</span>
                      <span className="text-[#333333] font-bold">
                        {status.cpu.model}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">核心数:</span>
                      <span className="text-[#333333] font-bold">
                        {status.cpu.cores}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">使用率:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        parseFloat(status.cpu.avgUsage) > 80
                          ? 'bg-[#FFC7C7]/20 text-[#333333]'
                          : parseFloat(status.cpu.avgUsage) > 60
                          ? 'bg-[#FFE2E2]/20 text-[#333333]'
                          : 'bg-[#F6F6F6]/20 text-[#333333]'
                      }`}>
                        {status.cpu.avgUsage}
                      </span>
                    </div>
                  </div>
                )}
                
                {status.memory && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-semibold text-pink-300">内存信息</h3>
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">总内存:</span>
                      <span className="text-[#333333] font-bold">
                        {status.memory.total}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">已用内存:</span>
                      <span className="text-[#333333] font-bold">
                        {status.memory.used}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">可用内存:</span>
                      <span className="text-[#333333] font-bold">
                        {status.memory.free}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">使用率:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        parseFloat(status.memory.usagePercent) > 80
                          ? 'bg-[#FFC7C7]/20 text-[#333333]'
                          : parseFloat(status.memory.usagePercent) > 60
                          ? 'bg-[#FFE2E2]/20 text-[#333333]'
                          : 'bg-[#F6F6F6]/20 text-[#333333]'
                      }`}>
                        {status.memory.usagePercent}
                      </span>
                    </div>
                  </div>
                )}
                
                {status.disk && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-semibold text-pink-300">磁盘信息</h3>
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">文件系统:</span>
                      <span className="text-[#333333] font-bold">
                        {status.disk.filesystem}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">挂载点:</span>
                      <span className="text-[#333333] font-bold">
                        {status.disk.mountedOn}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">总容量:</span>
                      <span className="text-[#333333] font-bold">
                        {status.disk.size}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">已用空间:</span>
                      <span className="text-[#333333] font-bold">
                        {status.disk.used}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">可用空间:</span>
                      <span className="text-[#333333] font-bold">
                        {status.disk.available}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                      <span className="text-[#333333] font-medium">使用率:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        parseFloat(status.disk.usagePercent) > 80
                          ? 'bg-[#FFC7C7]/20 text-[#333333]'
                          : parseFloat(status.disk.usagePercent) > 60
                          ? 'bg-[#FFE2E2]/20 text-[#333333]'
                          : 'bg-[#F6F6F6]/20 text-[#333333]'
                      }`}>
                        {status.disk.usagePercent}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <span className="text-[#333333] block mb-2">IO状态:</span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                          <span className="text-[#333333] font-medium">读取速率:</span>
                          <span className="text-[#333333] font-bold">
                            {status.disk.ioStats.readRate}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                          <span className="text-[#333333] font-medium">写入速率:</span>
                          <span className="text-[#333333] font-bold">
                            {status.disk.ioStats.writeRate}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#F6F6F6]/40 p-3 rounded-lg">
                          <span className="text-[#333333] font-medium">IO使用率:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            parseFloat(status.disk.ioStats.util) > 80
                              ? 'bg-[#FFC7C7]/20 text-[#333333]'
                              : parseFloat(status.disk.ioStats.util) > 60
                              ? 'bg-[#FFE2E2]/20 text-[#333333]'
                              : 'bg-[#F6F6F6]/20 text-[#333333]'
                          }`}>
                            {status.disk.ioStats.util}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : null}
          
          {/* 更新时间 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 text-center text-sm text-[#333333]"
          >
            最后更新: {new Date(status?.timestamp || '').toLocaleString()}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <motion.a 
              whileTap={{ scale: 0.95 }}
              href="/" 
              className="inline-block px-6 py-3 mr-4 bg-[#333333] text-white rounded-lg transition-all duration-300 shadow-lg"
            >
              返回首页
            </motion.a>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 