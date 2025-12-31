# NyaSakura 前端

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/)
- **UI组件**: [NextUI](https://nextui.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Minecraft服务器工具**: [minecraft-server-util](https://www.npmjs.com/package/minecraft-server-util)

## 本地开发

```bash
# 安装依赖
pnpm install

# 开发环境运行
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 环境要求

- Linux系统（支持systemd）
- 已安装Node.js环境
- 已安装pnpm包管理器（脚本会自动检查）

### 使用服务管理脚本（推荐）

服务管理脚本提供了完整的服务生命周期管理，包括环境检查、依赖安装、编译部署和服务控制。

#### 脚本特性

- **环境自检** - 自动检查pnpm是否已安装
- **依赖管理** - 自动执行`pnpm install`安装/更新依赖
- **全新构建** - 更新时自动删除旧的构建产物，确保干净构建
- **服务管理** - 提供安装、更新、卸载和状态查询功能

## 许可

本项目采用 MIT 许可证。