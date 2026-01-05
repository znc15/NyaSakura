# NyaSakura 前端

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/)
- **UI组件**: [NextUI](https://nextui.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)

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

## 可选配置（.env.local）

本项目大量使用 `NEXT_PUBLIC_*` 环境变量做文案/链接配置。

### 页脚：友情链接

使用 JSON 数组配置：

```dotenv
NEXT_PUBLIC_FRIEND_LINKS=[{"name":"小绵羊的小窝","url":"/wiki"},{"name":"阿狸的博客","url":"/join"},{"name":"Calibur Server","url":"/status"}]
```

也可以逐条配置（当 `NEXT_PUBLIC_FRIEND_LINKS` 为空/未设置时生效）：

```dotenv
NEXT_PUBLIC_FRIEND_LINK_1_NAME=小绵羊的小窝
NEXT_PUBLIC_FRIEND_LINK_1_URL=/wiki
NEXT_PUBLIC_FRIEND_LINK_2_NAME=阿狸的博客
NEXT_PUBLIC_FRIEND_LINK_2_URL=/join
```

### 页脚：备案信息

```dotenv
NEXT_PUBLIC_ICP_NUMBER=粤ICP备XXXXXXXX号
NEXT_PUBLIC_ICP_LINK=https://beian.miit.gov.cn/

NEXT_PUBLIC_GA_NUMBER=粤公网安备 44030502000001号
NEXT_PUBLIC_GA_LINK=https://beian.miit.gov.cn/
```

### 页脚：Server 名称绑定

页脚展示的 `NyaSakura Server` 与首页同源，来自：

```dotenv
NEXT_PUBLIC_SERVER_NAME=NyaSakura Server
```

### 页脚：介绍文案

```dotenv
NEXT_PUBLIC_FOOTER_INTRO=一个充满创意与欢乐的Minecraft服务器
```

## 许可

本项目采用 MIT 许可证。