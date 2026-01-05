#!/bin/sh
set -eu

# NyaSakura deploy helper
# - Installs Node.js (with npm) + pnpm
# - Option A: pnpm dev (no nginx)
# - Option B: pnpm build + systemd service + nginx reverse proxy

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR="$SCRIPT_DIR"
APP_NAME="nyasakura"
NEXT_PORT_DEFAULT="3001"
ORIG_UID=$(id -u)
ORIG_GID=$(id -g)
DEFAULT_GIT_URL="https://github.com/znc15/NyaSakura.git"

say() { printf '%s\n' "$*"; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

need_cmd() { command -v "$1" >/dev/null 2>&1; }

is_git_repo() {
  [ -d "$1/.git" ] || return 1
  need_cmd git || return 1
  git -C "$1" rev-parse --is-inside-work-tree >/dev/null 2>&1
}

as_root() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif need_cmd sudo; then
    sudo "$@"
  else
    die "需要 root 权限执行：$*（请用 root 运行脚本或安装 sudo）"
  fi
}

install_pkg() {
  pkg="$1"

  if need_cmd apt-get; then
    as_root apt-get update -y
    as_root apt-get install -y "$pkg"
    return
  fi

  if need_cmd dnf; then
    as_root dnf install -y "$pkg"
    return
  fi

  if need_cmd yum; then
    as_root yum install -y "$pkg"
    return
  fi

  if need_cmd apk; then
    as_root apk add --no-cache "$pkg"
    return
  fi

  if need_cmd pacman; then
    as_root pacman -Sy --noconfirm "$pkg"
    return
  fi

  if need_cmd zypper; then
    as_root zypper install -y "$pkg"
    return
  fi

  die "未识别的包管理器，无法自动安装依赖：$pkg"
}

ensure_basic_tools() {
  if ! need_cmd curl; then
    say "安装 curl..."
    install_pkg curl
  fi

  # ca-certificates is needed for HTTPS on many distros
  if need_cmd apt-get && ! dpkg -s ca-certificates >/dev/null 2>&1; then
    say "安装 ca-certificates..."
    install_pkg ca-certificates
  fi
}

ensure_git() {
  if need_cmd git; then
    return
  fi
  say "安装 git..."
  install_pkg git
  need_cmd git || die "git 安装失败"
}

clone_or_pull_source() {
  GIT_URL=${GIT_URL:-$DEFAULT_GIT_URL}
  INSTALL_DIR=${INSTALL_DIR:-/opt/${APP_NAME}}

  [ -n "$GIT_URL" ] || die "未提供源码地址。请通过 --clone <git_url> 或环境变量 GIT_URL 指定仓库。"

  ensure_git

  if [ -d "$INSTALL_DIR" ]; then
    if is_git_repo "$INSTALL_DIR"; then
      say "检测到已存在仓库，拉取更新（git pull --ff-only）..."
      if [ -w "$INSTALL_DIR" ]; then
        git -C "$INSTALL_DIR" pull --ff-only
      else
        as_root git -C "$INSTALL_DIR" pull --ff-only
        as_root chown -R "$ORIG_UID:$ORIG_GID" "$INSTALL_DIR" 2>/dev/null || true
      fi
    else
      die "目录已存在但不是 git 仓库：$INSTALL_DIR（请清空或更换 INSTALL_DIR）"
    fi
  else
    say "克隆仓库到：$INSTALL_DIR"
    as_root mkdir -p "$(dirname "$INSTALL_DIR")"
    if [ -w "$(dirname "$INSTALL_DIR")" ]; then
      git clone "$GIT_URL" "$INSTALL_DIR"
    else
      as_root git clone "$GIT_URL" "$INSTALL_DIR"
      as_root chown -R "$ORIG_UID:$ORIG_GID" "$INSTALL_DIR" 2>/dev/null || true
    fi
  fi

  PROJECT_DIR="$INSTALL_DIR"
}

parse_args() {
  MODE=${MODE:-}
  DO_CLONE=0
  WITH_NGINX=${WITH_NGINX:-}
  DIST_DIR=${DIST_DIR:-}

  while [ "$#" -gt 0 ]; do
    case "$1" in
      --clone)
        shift
        [ "$#" -gt 0 ] || die "--clone 需要一个 git url"
        GIT_URL="$1"
        DO_CLONE=1
        ;;
      --dir)
        shift
        [ "$#" -gt 0 ] || die "--dir 需要一个目录路径"
        INSTALL_DIR="$1"
        ;;
      --mode)
        shift
        [ "$#" -gt 0 ] || die "--mode 需要 dev 或 prod"
        MODE="$1"
        ;;
      --with-nginx)
        WITH_NGINX=1
        ;;
      --no-nginx)
        WITH_NGINX=0
        ;;
      --dist-dir)
        shift
        [ "$#" -gt 0 ] || die "--dist-dir 需要一个目录名（例如 .next-prod）"
        DIST_DIR="$1"
        ;;
      -h|--help)
        say "用法："
        say "  ./deploy.sh                         # 在当前仓库目录交互部署"
        say "  ./deploy.sh --clone <git_url>       # 克隆/拉取到 /opt/nyasakura 后部署"
        say "  ./deploy.sh --clone <git_url> --dir /opt/nyasakura"
        say "  ./deploy.sh --mode dev              # 非交互：直接 pnpm dev"
        say "  ./deploy.sh --mode prod             # 非交互：生产模式（build 后运行，可选 nginx）"
        say "  ./deploy.sh --mode prod --no-nginx   # 生产模式但不安装/配置 nginx"
        say "  ./deploy.sh --mode prod --dist-dir .next-prod  # build 输出到指定目录"
        say "环境变量：NODE_MAJOR, DOMAIN, NEXT_PORT, GIT_URL, INSTALL_DIR, DIST_DIR"
        exit 0
        ;;
      *)
        die "未知参数：$1（使用 --help 查看用法）"
        ;;
    esac
    shift
  done

  if [ "$DO_CLONE" -eq 1 ]; then
    clone_or_pull_source
  fi
}

ensure_node() {
  if need_cmd node && need_cmd npm; then
    node_ver=$(node -v 2>/dev/null || true)
    npm_ver=$(npm -v 2>/dev/null || true)
    node_major=$(printf '%s' "$node_ver" | sed 's/^v//' | cut -d. -f1 | tr -cd '0-9')

    if [ -n "$node_major" ] && [ "$node_major" -ge 18 ]; then
      say "已检测到 Node.js：${node_ver}，npm：${npm_ver}"
      return
    fi

    say "检测到 Node.js 版本过低：${node_ver:-unknown}（需要 >= 18），将自动升级..."
  fi

  ensure_basic_tools

  NODE_MAJOR=${NODE_MAJOR:-}
  if [ -n "$NODE_MAJOR" ]; then
    say "未检测到 Node.js/npm，准备安装 Node.js ${NODE_MAJOR}.x ..."
  else
    say "未检测到 Node.js/npm，准备安装 Node.js 最新稳定版（current）..."
  fi

  if need_cmd apt-get; then
    as_root apt-get update -y
    as_root apt-get install -y ca-certificates curl gnupg

    # NodeSource setup script (Debian/Ubuntu)
    if [ -n "$NODE_MAJOR" ]; then
      as_root sh -c "curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -"
    else
      as_root sh -c "curl -fsSL https://deb.nodesource.com/setup_current.x | bash -"
    fi
    as_root apt-get install -y nodejs
  elif need_cmd dnf || need_cmd yum; then
    if [ -n "$NODE_MAJOR" ]; then
      as_root sh -c "curl -fsSL https://rpm.nodesource.com/setup_${NODE_MAJOR}.x | bash -"
    else
      as_root sh -c "curl -fsSL https://rpm.nodesource.com/setup_current.x | bash -"
    fi
    if need_cmd dnf; then
      as_root dnf install -y nodejs
    else
      as_root yum install -y nodejs
    fi
  elif need_cmd apk; then
    # Alpine
    as_root apk add --no-cache nodejs npm
  elif need_cmd pacman; then
    as_root pacman -Sy --noconfirm nodejs npm
  else
    die "当前系统不支持自动安装 Node.js。请先安装 Node.js >= 18（建议使用最新稳定版 current 或 LTS），然后重新运行脚本。"
  fi

  need_cmd node || die "Node.js 安装失败"
  need_cmd npm || die "npm 安装失败"

  say "Node.js 安装完成：$(node -v)，npm：$(npm -v)"
}

ensure_pnpm() {
  if need_cmd pnpm; then
    pnpm_ver=$(pnpm -v 2>/dev/null || true)
    if [ -n "$pnpm_ver" ]; then
      say "已检测到 pnpm：${pnpm_ver}"
      return
    fi
    say "检测到 pnpm 但无法运行（通常是 Node 版本过低或 pnpm 安装损坏），将重新安装..."
  fi

  say "未检测到 pnpm，尝试通过 corepack 安装..."

  if need_cmd corepack; then
    as_root corepack enable || true

    # Try to activate latest pnpm via corepack
    if corepack prepare pnpm@latest --activate >/dev/null 2>&1; then
      :
    else
      # Some distros ship older corepack; fallback
      say "corepack 激活 pnpm 失败，改用 npm 全局安装 pnpm..."
      as_root npm install -g pnpm
    fi
  else
    say "未检测到 corepack，改用 npm 全局安装 pnpm..."
    as_root npm install -g pnpm
  fi

  need_cmd pnpm || die "pnpm 安装失败"
  say "pnpm 安装完成：$(pnpm -v)"
}

pnpm_install() {
  say "安装依赖（pnpm install）..."
  cd "$PROJECT_DIR"

  # prefer lockfile; if it fails (older pnpm / constraints), fall back
  if pnpm install --frozen-lockfile; then
    :
  else
    say "pnpm install --frozen-lockfile 失败，改用普通安装..."
    pnpm install
  fi
}

setup_nginx_reverse_proxy() {
  NEXT_PORT=${NEXT_PORT:-$NEXT_PORT_DEFAULT}
  DOMAIN=${DOMAIN:-_}

  if ! need_cmd nginx; then
    say "安装 nginx..."
    install_pkg nginx
  fi

  conf_path="/etc/nginx/conf.d/${APP_NAME}.conf"

  say "写入 nginx 配置：${conf_path}（server_name=${DOMAIN}，proxy -> 127.0.0.1:${NEXT_PORT}）"
  as_root sh -c "cat > '${conf_path}' <<EOF
server {
  listen 80;
  server_name ${DOMAIN};

  location / {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;

    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection \"upgrade\";

    proxy_pass http://127.0.0.1:${NEXT_PORT};
  }
}
EOF"

  as_root nginx -t

  if need_cmd systemctl; then
    as_root systemctl enable nginx
    as_root systemctl restart nginx
  else
    as_root nginx -s reload || as_root nginx
  fi

  say "nginx 已启动/重载完成"
}

setup_systemd_service() {
  NEXT_PORT=${NEXT_PORT:-$NEXT_PORT_DEFAULT}
  # Optional: custom Next.js distDir
  NEXT_DIST_DIR=${DIST_DIR:-${NEXT_DIST_DIR:-}}

  if ! need_cmd systemctl; then
    say "未检测到 systemd（systemctl 不存在），将使用前台方式启动。"
    return
  fi

  service_path="/etc/systemd/system/${APP_NAME}.service"

  say "写入 systemd 服务：${service_path}"
  as_root sh -c "cat > '${service_path}' <<EOF
[Unit]
Description=NyaSakura Next.js service
After=network.target

[Service]
Type=simple
WorkingDirectory=${PROJECT_DIR}
Environment=NODE_ENV=production
# next start uses script-defined port; keep env for future compatibility
Environment=PORT=${NEXT_PORT}
Environment=NEXT_DIST_DIR=${NEXT_DIST_DIR}
ExecStart=/usr/bin/env pnpm start
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF"

  as_root systemctl daemon-reload
  as_root systemctl enable "${APP_NAME}.service"
  as_root systemctl restart "${APP_NAME}.service"

  say "systemd 服务已启动：${APP_NAME}.service"
}

run_dev() {
  pnpm_install
  say "启动开发模式：pnpm dev（绑定 127.0.0.1:3001）"
  cd "$PROJECT_DIR"
  pnpm dev
}

run_build_with_nginx() {
  pnpm_install

  say "构建生产版本：pnpm build"
  cd "$PROJECT_DIR"
  if [ -n "${DIST_DIR:-}" ]; then
    say "使用自定义构建目录（distDir）：$DIST_DIR"
    NEXT_DIST_DIR="$DIST_DIR" pnpm build
  else
    pnpm build
  fi

  setup_systemd_service

  if [ -z "${WITH_NGINX}" ]; then
    printf "是否安装/配置 nginx 反向代理（y/N）: "
    read -r ans
    case "$ans" in
      y|Y|yes|YES) WITH_NGINX=1 ;;
      *) WITH_NGINX=0 ;;
    esac
  fi

  if [ "${WITH_NGINX}" -eq 1 ]; then
    setup_nginx_reverse_proxy
  else
    say "已选择不安装/配置 nginx。"
  fi

  if need_cmd systemctl; then
    if [ "${WITH_NGINX}" -eq 1 ]; then
      say "访问方式：浏览器打开 http://<服务器IP>/ （nginx 80 端口反代到 3001）"
    else
      say "访问方式：直接访问 http://<服务器IP>:${NEXT_PORT_DEFAULT}/ （Next.js 监听 3001）"
    fi
    say "查看日志：sudo journalctl -u ${APP_NAME}.service -f"
  else
    say "当前环境没有 systemd，请另开一个终端执行：pnpm start"
    if [ "${WITH_NGINX}" -eq 1 ]; then
      say "nginx 已配置为反代到 127.0.0.1:${NEXT_PORT_DEFAULT}"
    else
      say "未配置 nginx，可直接访问 :${NEXT_PORT_DEFAULT}"
    fi
  fi
}

ensure_source_present_or_clone() {
  if [ -f "$PROJECT_DIR/package.json" ]; then
    return
  fi

  # Auto-clone when source is missing.
  if [ -n "${GIT_URL:-}" ]; then
    say "未检测到源码（package.json），使用 GIT_URL 拉取源码..."
  else
    GIT_URL="$DEFAULT_GIT_URL"
    say "未检测到源码（package.json），将从默认仓库拉取：$GIT_URL"
  fi

  clone_or_pull_source
}

main() {
  parse_args "$@"

  ensure_source_present_or_clone

  ensure_node
  ensure_pnpm

  # Ensure project looks valid after optional clone
  [ -f "$PROJECT_DIR/package.json" ] || die "未找到项目 package.json：$PROJECT_DIR"

  if [ -n "$MODE" ]; then
    case "$MODE" in
      dev) run_dev ;;
      prod) run_build_with_nginx ;;
      *) die "无效 --mode：$MODE（仅支持 dev/prod）" ;;
    esac
  else
    say ""
    say "请选择模式："
    say "  1) 开发模式（pnpm dev，不推荐用于线上）"
    say "  2) 生产模式（pnpm build 后运行，可选 nginx 反代）"
    printf "请输入 1 或 2: "
    read -r choice

    case "$choice" in
      1) run_dev ;;
      2) run_build_with_nginx ;;
      *) die "无效选择：$choice" ;;
    esac
  fi
}

main "$@"
