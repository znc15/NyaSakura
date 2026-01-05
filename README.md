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

## 一键部署（Linux）

仓库根目录提供了 `deploy.sh`：自动安装 Node.js/npm + pnpm，并交互选择：

- 开发模式：`pnpm dev`（不推荐用于线上）
- 生产模式：`pnpm build` + `pnpm start`（可选用 nginx 反代到 `127.0.0.1:3001`）

示例：

```bash
chmod +x ./deploy.sh

# 可选：指定 Node 主版本（默认 20）
# 不设置时默认安装 Node.js 最新稳定版（current）
# 如需固定主版本（例如 20/22），可设置：
export NODE_MAJOR=20

# 可选：指定 nginx server_name（默认 '_'）
export DOMAIN=example.com

./deploy.sh
```

### 服务器上拉取源码并部署

如果服务器上还没有源码：

- 直接运行 `./deploy.sh` 时，脚本会检测不到 `package.json` 并自动从默认仓库拉取源码
- 或使用 `--clone` 让脚本自动 `git clone / git pull`

```bash
chmod +x ./deploy.sh

./deploy.sh --clone https://github.com/<owner>/<repo>.git

# 或指定部署目录
./deploy.sh --clone https://github.com/znc15/NyaSakura.git --dir /opt/nyasakura
```

### 非交互模式

```bash
./deploy.sh --mode dev
./deploy.sh --mode prod

# 生产模式但不安装/配置 nginx（直接暴露 :3001）
./deploy.sh --mode prod --no-nginx

# 指定 build 输出目录（Next.js distDir），运行时会使用同一个目录
./deploy.sh --mode prod --dist-dir .next-prod
```

## 卸载（Linux）

仓库根目录提供了 `uninstall.sh`：移除 systemd 服务与 nginx 配置（可选删除源码目录）。

```bash
chmod +x ./uninstall.sh

./uninstall.sh

# 可选：删除源码目录
./uninstall.sh --remove-source --dir /opt/nyasakura
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