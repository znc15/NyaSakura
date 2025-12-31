#!/usr/bin/env node

/**
 * NyaSakura前端启动脚本
 * 用于启动前端服务
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 解析命令行参数
const args = process.argv.slice(2);
let port = 3001; // 默认端口

// 查找端口参数
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' || args[i] === '-p') {
    const portArg = args[i + 1];
    if (portArg && !isNaN(parseInt(portArg))) {
      port = parseInt(portArg);
      break;
    }
  }
}

// 项目根目录
const rootDir = __dirname;

// 日志目录
const logsDir = path.join(rootDir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 日志文件
const frontendLogFile = fs.createWriteStream(path.join(logsDir, 'frontend.log'), { flags: 'a' });
const serviceLogFile = fs.createWriteStream(path.join(logsDir, 'service.log'), { flags: 'a' });

// 记录日志的函数
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // 同时输出到控制台和日志文件
  console.log(message);
  serviceLogFile.write(logEntry);
}

// 记录启动日志
logMessage(`启动NyaSakura前端服务，使用端口: ${port}...`);

// 检查.next目录是否存在
if (!fs.existsSync(path.join(rootDir, '.next'))) {
  logMessage('错误：.next目录不存在，请先运行构建命令: npm run build 或 pnpm build');
  process.exit(1);
}

// 启动前端 - 以生产模式启动构建后的应用
const frontend = spawn('npm', ['start', '--', '-p', port.toString()], {
  cwd: rootDir,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production' },
  detached: false // 确保子进程不会脱离父进程控制
});

frontend.stdout.pipe(frontendLogFile);
frontend.stderr.pipe(frontendLogFile);

frontend.on('error', (err) => {
  logMessage(`前端启动失败: ${err.message}`);
});

frontend.on('spawn', () => {
  logMessage(`前端进程已启动，PID: ${frontend.pid}`);
});

frontend.on('close', (code) => {
  logMessage(`前端进程已关闭，退出码: ${code}`);
});

logMessage('NyaSakura前端服务已启动!');
logMessage(`前端日志文件: ${path.join(logsDir, 'frontend.log')}`);
logMessage(`服务日志文件: ${path.join(logsDir, 'service.log')}`);

// 优雅关闭函数
function gracefulShutdown(signal) {
  logMessage(`收到${signal}信号，正在关闭服务...`);
  
  // 向前端进程发送SIGTERM信号
  if (frontend && !frontend.killed) {
    logMessage(`正在终止前端进程(PID: ${frontend.pid})...`);
    frontend.kill('SIGTERM');
    
    // 确保前端进程被终止
    const forceKillTimeout = setTimeout(() => {
      if (frontend && !frontend.killed) {
        logMessage(`前端进程(PID: ${frontend.pid})未在预期时间内退出，强制终止...`);
        frontend.kill('SIGKILL');
      }
    }, 5000); // 5秒后强制终止
    
    frontend.on('exit', (code) => {
      clearTimeout(forceKillTimeout);
      logMessage(`前端进程已终止，退出码: ${code}`);
      
      // 关闭日志文件流
      frontendLogFile.end();
      serviceLogFile.end(() => {
        logMessage('日志文件已关闭，服务退出');
        process.exit(0);
      });
    });
  } else {
    logMessage('没有运行中的前端进程，服务直接退出');
    
    // 关闭日志文件流
    frontendLogFile.end();
    serviceLogFile.end(() => {
      process.exit(0);
    });
  }
}

// 处理各种退出信号
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // systemd停止服务时发送
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));   // 终端关闭

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logMessage(`未捕获的异常: ${err.message}`);
  logMessage(err.stack);
  gracefulShutdown('异常');
});

// 保持进程运行
process.stdin.resume(); 